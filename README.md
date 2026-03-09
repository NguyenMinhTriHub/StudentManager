# Ứng dụng Web Quản lý Sinh viên (MVP)

- **Backend:** FastAPI + SQLite
- **Frontend:** React (Vite)

## Dữ liệu (Phần 1 và Phần 2)

- **Lớp (Class):** `class_id`, `class_name`, `advisor`. Dữ liệu mẫu: C01, Khoa học máy tính 1, Nguyen Van A.
- **Sinh viên:** `student_id`, `name`, `birth_year`, `major`, `gpa`, `class_id` (mỗi sinh viên thuộc một lớp).

## Chạy ứng dụng

### Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

*(Dùng `python -m uvicorn` thay vì gõ `uvicorn` trực tiếp để tránh lỗi "uvicorn is not recognized" khi venv chưa kích hoạt.)*

**PowerShell (đường dẫn có dấu cách / tiếng Việt):** Khi dùng `.venv` trong thư mục gốc project, phải đặt đường dẫn trong dấu ngoặc kép và gọi bằng `&`:

```powershell
cd backend
& "D:\23710141_Nguyễn Minh Trí_Bài tập tuần 6_Phát triển ứng dụng\.venv\Scripts\python.exe" -m pip install -r requirements.txt
& "D:\23710141_Nguyễn Minh Trí_Bài tập tuần 6_Phát triển ứng dụng\.venv\Scripts\python.exe" -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Hoặc kích hoạt venv trước rồi chạy lệnh bình thường:

```powershell
# Từ thư mục gốc project
.\.venv\Scripts\Activate.ps1
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

*(Nếu dùng Python 3.13 mà lỗi khi cài pydantic, thử dùng môi trường Python 3.11 hoặc 3.12.)*

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Mở trình duyệt: http://localhost:3000

- **Trang 1 – Danh sách:** Bảng cột ID, Name, Major, GPA, Tên lớp, Action (Edit, Delete).
- **Trang 2 – Thêm:** Form có ô chọn Lớp học (Dropdown) + các trường sinh viên + nút "Add Student".

*Nâng cấp từ Phần 1 lên Phần 2:* Xóa file `backend/students.db` (nếu có) để tạo lại bảng có cột `class_id` và bảng `classes`.

## API Backend (CRUD)

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | `/api/classes` | Lấy danh sách lớp học |
| GET | `/api/students` | Lấy danh sách sinh viên (kèm tên lớp) |
| GET | `/api/students/{id}` | Lấy một sinh viên |
| POST | `/api/students` | Tạo sinh viên mới (cần `class_id`) |
| PUT | `/api/students/{id}` | Cập nhật sinh viên |
| DELETE | `/api/students/{id}` | Xóa sinh viên |
