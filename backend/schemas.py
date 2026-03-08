from pydantic import BaseModel


class ClassResponse(BaseModel):
    class_id: str
    class_name: str
    advisor: str

    class Config:
        from_attributes = True


class StudentBase(BaseModel):
    name: str
    birth_year: int
    major: str
    gpa: float
    class_id: str


class StudentCreate(StudentBase):
    pass


class StudentUpdate(StudentBase):
    pass


class StudentResponse(StudentBase):
    student_id: int
    class_name: str | None = None

    class Config:
        from_attributes = True


class StatsResponse(BaseModel):
    total_students: int
    avg_gpa: float
    students_by_major: dict[str, int]
