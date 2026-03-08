# -*- coding: utf-8 -*-
"""
Dữ liệu mẫu Phần 1 (MVP) - 10 sinh viên.
Chạy từ thư mục backend: python seed_data.py
"""
import sys
from pathlib import Path

_backend_dir = Path(__file__).resolve().parent
if str(_backend_dir) not in sys.path:
    sys.path.insert(0, str(_backend_dir))

from database import SessionLocal, engine, Base
from models import Student

# Xóa bảng cũ và tạo lại
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

# 10 sinh viên mẫu (student_id, name, birth_year, major, gpa)
STUDENTS_DATA = [
    {"name": "Nguyễn Văn Bình", "birth_year": 2004, "major": "Khoa học máy tính", "gpa": 3.5},
    {"name": "Trần Minh Phúc", "birth_year": 2003, "major": "Kinh tế", "gpa": 3.2},
    {"name": "Lê Thu Thảo", "birth_year": 2004, "major": "Kỹ thuật phần mềm", "gpa": 3.8},
    {"name": "Phạm Hoàng Nam", "birth_year": 2003, "major": "Khoa học máy tính", "gpa": 2.9},
    {"name": "Vũ Ngọc Ánh", "birth_year": 2004, "major": "Kinh tế", "gpa": 3.9},
    {"name": "Đặng Quốc Anh", "birth_year": 2003, "major": "Kỹ thuật phần mềm", "gpa": 3.1},
    {"name": "Hoàng Kim Liên", "birth_year": 2004, "major": "Công nghệ thông tin", "gpa": 3.4},
    {"name": "Bùi Tiến Dũng", "birth_year": 2003, "major": "An toàn thông tin", "gpa": 2.7},
    {"name": "Ngô Thanh Hằng", "birth_year": 2004, "major": "Khoa học máy tính", "gpa": 3.6},
    {"name": "Trịnh Công Sơn", "birth_year": 2003, "major": "Kinh tế", "gpa": 3.0},
]


def seed():
    db = SessionLocal()
    try:
        for data in STUDENTS_DATA:
            db.add(Student(**data))
        db.commit()
        print("Da them 10 sinh vien mau thanh cong!")
    except Exception as e:
        print("Loi:", str(e))
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed()
