from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Class(Base):
    """Bang Class: class_id (PK), class_name, advisor"""
    __tablename__ = "classes"

    class_id = Column(String(20), primary_key=True, index=True)
    class_name = Column(String(100), nullable=False)
    advisor = Column(String(100), nullable=False)

    students = relationship("Student", back_populates="class_ref")


class Student(Base):
    """Bang Student: student_id, name, birth_year, major, gpa, class_id (FK)"""
    __tablename__ = "students"

    student_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    birth_year = Column(Integer, nullable=False)
    major = Column(String(100), nullable=False)
    gpa = Column(Float, nullable=False)
    class_id = Column(String(20), ForeignKey("classes.class_id"), nullable=False)

    class_ref = relationship("Class", back_populates="students")
