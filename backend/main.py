import sys
import io
import csv
from pathlib import Path

_backend_dir = Path(__file__).resolve().parent
if str(_backend_dir) not in sys.path:
    sys.path.insert(0, str(_backend_dir))

from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import engine, get_db, Base
from models import Student, Class
from schemas import (
    StudentCreate,
    StudentUpdate,
    StudentResponse,
    ClassResponse,
    StatsResponse,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Student Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _student_to_response(s):
    return StudentResponse(
        student_id=s.student_id,
        name=s.name,
        birth_year=s.birth_year,
        major=s.major,
        gpa=s.gpa,
        class_id=s.class_id,
        class_name=s.class_ref.class_name if s.class_ref else None,
    )


@app.get("/api/classes", response_model=list[ClassResponse])
def get_classes(db: Session = Depends(get_db)):
    """GET /api/classes - Lay danh sach lop hoc"""
    return db.query(Class).all()


@app.get("/students", response_model=list[StudentResponse])
@app.get("/api/students", response_model=list[StudentResponse])
def get_students(
    db: Session = Depends(get_db),
    search: str | None = Query(None, description="Tim theo ten sinh vien"),
):
    """GET /students - Lay danh sach sinh vien (co tim kiem)"""
    q = db.query(Student).outerjoin(Class, Student.class_id == Class.class_id)
    if search and search.strip():
        q = q.filter(Student.name.ilike(f"%{search.strip()}%"))
    students = q.all()
    return [_student_to_response(s) for s in students]


@app.get("/api/students/export/csv")
def export_students_csv(
    db: Session = Depends(get_db),
    search: str | None = Query(None, description="Tim theo ten sinh vien"),
):
    """GET /api/students/export/csv - Xuat file CSV voi ma hoa utf-8-sig (Excel)"""
    q = db.query(Student).outerjoin(Class, Student.class_id == Class.class_id)
    if search and search.strip():
        q = q.filter(Student.name.ilike(f"%{search.strip()}%"))
    students = q.all()

    output = io.StringIO()
    writer = csv.writer(output, delimiter=",")
    writer.writerow(["student_id", "name", "birth_year", "major", "gpa", "class_id", "class_name"])
    for s in students:
        writer.writerow([
            s.student_id,
            s.name,
            s.birth_year,
            s.major,
            s.gpa,
            s.class_id,
            s.class_ref.class_name if s.class_ref else "",
        ])

    content = output.getvalue()
    bom = "\ufeff"
    encoded = (bom + content).encode("utf-8")

    return StreamingResponse(
        iter([encoded]),
        media_type="text/csv; charset=utf-8-sig",
        headers={"Content-Disposition": "attachment; filename=students.csv"},
    )


@app.get("/api/students/{student_id}", response_model=StudentResponse)
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = (
        db.query(Student)
        .outerjoin(Class, Student.class_id == Class.class_id)
        .filter(Student.student_id == student_id)
        .first()
    )
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return _student_to_response(student)


@app.post("/students", response_model=StudentResponse)
@app.post("/api/students", response_model=StudentResponse)
def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    _class = db.query(Class).filter(Class.class_id == student.class_id).first()
    if not _class:
        raise HTTPException(
            status_code=400,
            detail=f"Lop co class_id '{student.class_id}' khong ton tai",
        )
    db_student = Student(**student.model_dump())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return _student_to_response(db_student)


@app.put("/students/{student_id}", response_model=StudentResponse)
@app.put("/api/students/{student_id}", response_model=StudentResponse)
def update_student(
    student_id: int, student: StudentUpdate, db: Session = Depends(get_db)
):
    _class = db.query(Class).filter(Class.class_id == student.class_id).first()
    if not _class:
        raise HTTPException(
            status_code=400,
            detail=f"Lop co class_id '{student.class_id}' khong ton tai",
        )
    db_student = db.query(Student).filter(Student.student_id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    for key, value in student.model_dump().items():
        setattr(db_student, key, value)
    db.commit()
    db.refresh(db_student)
    return _student_to_response(db_student)


@app.delete("/students/{student_id}")
@app.delete("/api/students/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    db_student = db.query(Student).filter(Student.student_id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(db_student)
    db.commit()
    return {"message": "Student deleted successfully"}


@app.get("/api/stats", response_model=StatsResponse)
def get_stats(db: Session = Depends(get_db)):
    """GET /api/stats - Thong ke: tong SV, GPA TB, so SV theo nganh"""
    total = db.query(Student).count()
    if total == 0:
        return StatsResponse(
            total_students=0,
            avg_gpa=0.0,
            students_by_major={},
        )
    avg_row = db.query(func.avg(Student.gpa).label("avg")).first()
    avg_gpa = round(float(avg_row.avg or 0), 2)
    by_major = (
        db.query(Student.major, func.count(Student.student_id))
        .group_by(Student.major)
        .all()
    )
    students_by_major = {m: c for m, c in by_major}
    return StatsResponse(
        total_students=total,
        avg_gpa=avg_gpa,
        students_by_major=students_by_major,
    )
