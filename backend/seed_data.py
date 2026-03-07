"""
Chạy script này để khởi tạo 10 sinh viên mẫu.
Từ thư mục backend: python seed_data.py
"""
from database import SessionLocal, engine
from models import Student, Base

# Tạo bảng nếu chưa có
Base.metadata.create_all(bind=engine)

# 5 lớp khác nhau (major lưu tên lớp)
STUDENTS_DATA = [
    {"name": "Nguyễn Văn Bình", "birth_year": 2004, "major": "Lớp Khoa học máy tính 1", "gpa": 3.5},
    {"name": "Trần Minh Phúc", "birth_year": 2003, "major": "Lớp Kinh tế 1", "gpa": 3.2},
    {"name": "Lê Thu Thảo", "birth_year": 2004, "major": "Lớp Kỹ thuật phần mềm 1", "gpa": 3.8},
    {"name": "Phạm Hoàng Nam", "birth_year": 2003, "major": "Lớp Công nghệ thông tin 1", "gpa": 2.9},
    {"name": "Vũ Ngọc Ánh", "birth_year": 2004, "major": "Lớp An toàn thông tin 1", "gpa": 3.9},
    {"name": "Đặng Quốc Anh", "birth_year": 2003, "major": "Lớp Khoa học máy tính 1", "gpa": 3.1},
    {"name": "Hoàng Kim Liên", "birth_year": 2004, "major": "Lớp Kinh tế 1", "gpa": 3.4},
    {"name": "Bùi Tiến Dũng", "birth_year": 2003, "major": "Lớp Kỹ thuật phần mềm 1", "gpa": 2.7},
    {"name": "Ngô Thanh Hằng", "birth_year": 2004, "major": "Lớp Công nghệ thông tin 1", "gpa": 3.6},
    {"name": "Trịnh Công Sơn", "birth_year": 2003, "major": "Lớp An toàn thông tin 1", "gpa": 3.0},
]


def seed():
    db = SessionLocal()
    try:
        existing = db.query(Student).count()
        if existing > 0:
            print(f"Đã có {existing} sinh viên trong DB. Bỏ qua seed (chạy lại sau khi xóa bảng/DB nếu cần).")
            return
        for data in STUDENTS_DATA:
            db.add(Student(**data))
        db.commit()
        print("--- Đã thêm 10 sinh viên mẫu thành công! ---")
    except Exception as e:
        print(f"Lỗi khi thêm dữ liệu: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed()
