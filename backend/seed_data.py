# -*- coding: utf-8 -*-
"""
Du lieu mau Phan 2: 4 lop hoc + 20 sinh vien.
Xoa du lieu cu, tao lai bang va nap du lieu moi.
Chay tu thu muc backend: python seed_data.py
"""
import sys
from pathlib import Path

_backend_dir = Path(__file__).resolve().parent
if str(_backend_dir) not in sys.path:
    sys.path.insert(0, str(_backend_dir))

from database import SessionLocal, engine, Base
from models import Student, Class

# Xoa bang cu va tao lai
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

# 4 lop hoc mau
CLASSES_DATA = [
    {"class_id": "C01", "class_name": "Khoa học máy tính 1", "advisor": "Nguyễn Văn A"},
    {"class_id": "C02", "class_name": "Kinh tế 1", "advisor": "Trần Thị B"},
    {"class_id": "C03", "class_name": "Kỹ thuật phần mềm 1", "advisor": "Lê Văn C"},
    {"class_id": "C04", "class_name": "Công nghệ thông tin 1", "advisor": "Phạm Thị D"},
]

# 20 sinh vien mau (phan bo deu cac lop va nganh)
STUDENTS_DATA = [
    {"name": "Nguyễn Văn Bình", "birth_year": 2004, "major": "Khoa học máy tính", "gpa": 3.5, "class_id": "C01"},
    {"name": "Trần Minh Phúc", "birth_year": 2003, "major": "Kinh tế", "gpa": 3.2, "class_id": "C02"},
    {"name": "Lê Thu Thảo", "birth_year": 2004, "major": "Kỹ thuật phần mềm", "gpa": 3.8, "class_id": "C03"},
    {"name": "Phạm Hoàng Nam", "birth_year": 2003, "major": "Khoa học máy tính", "gpa": 2.9, "class_id": "C01"},
    {"name": "Vũ Ngọc Ánh", "birth_year": 2004, "major": "Kinh tế", "gpa": 3.9, "class_id": "C02"},
    {"name": "Đặng Quốc Anh", "birth_year": 2003, "major": "Kỹ thuật phần mềm", "gpa": 3.1, "class_id": "C03"},
    {"name": "Hoàng Kim Liên", "birth_year": 2004, "major": "Công nghệ thông tin", "gpa": 3.4, "class_id": "C04"},
    {"name": "Bùi Tiến Dũng", "birth_year": 2003, "major": "An toàn thông tin", "gpa": 2.7, "class_id": "C01"},
    {"name": "Ngô Thanh Hằng", "birth_year": 2004, "major": "Khoa học máy tính", "gpa": 3.6, "class_id": "C01"},
    {"name": "Trịnh Công Sơn", "birth_year": 2003, "major": "Kinh tế", "gpa": 3.0, "class_id": "C02"},
    {"name": "Lương Minh Tuấn", "birth_year": 2004, "major": "Kỹ thuật phần mềm", "gpa": 3.3, "class_id": "C03"},
    {"name": "Đỗ Thu Hà", "birth_year": 2003, "major": "Công nghệ thông tin", "gpa": 3.7, "class_id": "C04"},
    {"name": "Chu Văn Đức", "birth_year": 2004, "major": "An toàn thông tin", "gpa": 2.8, "class_id": "C01"},
    {"name": "Tạ Thị Mai", "birth_year": 2003, "major": "Khoa học máy tính", "gpa": 3.5, "class_id": "C01"},
    {"name": "Hồ Quang Huy", "birth_year": 2004, "major": "Kinh tế", "gpa": 3.1, "class_id": "C02"},
    {"name": "Dương Thị Lan", "birth_year": 2003, "major": "Kỹ thuật phần mềm", "gpa": 3.9, "class_id": "C03"},
    {"name": "Võ Minh Khôi", "birth_year": 2004, "major": "Công nghệ thông tin", "gpa": 2.6, "class_id": "C04"},
    {"name": "Tăng Thị Nhung", "birth_year": 2003, "major": "An toàn thông tin", "gpa": 3.4, "class_id": "C02"},
    {"name": "Kiều Văn Thắng", "birth_year": 2004, "major": "Khoa học máy tính", "gpa": 3.2, "class_id": "C01"},
    {"name": "Lâm Thị Xuân", "birth_year": 2003, "major": "Kinh tế", "gpa": 3.6, "class_id": "C02"},
]


def seed():
    db = SessionLocal()
    try:
        for c in CLASSES_DATA:
            db.add(Class(**c))
        db.flush()

        for data in STUDENTS_DATA:
            db.add(Student(**data))
        db.commit()
        print("Da tao 4 lop va 20 sinh vien mau thanh cong!")
    except Exception as e:
        print("Loi:", str(e))
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed()
