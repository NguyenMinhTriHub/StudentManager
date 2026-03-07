from sqlalchemy import Column, Integer, String, Float
from database import Base


class Student(Base):
    __tablename__ = "students"

    student_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    birth_year = Column(Integer, nullable=False)
    major = Column(String(100), nullable=False)
    gpa = Column(Float, nullable=False)
