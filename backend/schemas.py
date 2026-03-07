from pydantic import BaseModel


class StudentBase(BaseModel):
    name: str
    birth_year: int
    major: str
    gpa: float


class StudentCreate(StudentBase):
    pass


class StudentUpdate(StudentBase):
    pass


class StudentResponse(StudentBase):
    student_id: int

    class Config:
        from_attributes = True
