import { useState, useEffect } from 'react'
import { getStudents, deleteStudent, updateStudent } from '../services/api'

const emptyForm = { name: '', birth_year: '', major: '', gpa: '' }

export default function StudentList() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const loadStudents = () => {
    setLoading(true)
    getStudents()
      .then((res) => setStudents(res.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadStudents()
  }, [])

  const handleDelete = (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sinh viên này?')) return
    deleteStudent(id)
      .then(() => {
        setStudents((prev) => prev.filter((s) => s.student_id !== id))
      })
      .catch((e) => setError(e.message))
  }

  const openEdit = (s) => {
    setEditId(s.student_id)
    setForm({
      name: s.name,
      birth_year: String(s.birth_year),
      major: s.major,
      gpa: String(s.gpa),
    })
  }

  const closeEdit = () => {
    setEditId(null)
    setForm(emptyForm)
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    const payload = {
      name: form.name,
      birth_year: Number(form.birth_year),
      major: form.major,
      gpa: Number(form.gpa),
    }
    updateStudent(editId, payload)
      .then((res) => {
        setStudents((prev) =>
          prev.map((s) => (s.student_id === editId ? res.data : s))
        )
        closeEdit()
      })
      .catch((e) => setError(e.message))
  }

  if (error) return <p style={{ color: 'red' }}>Lỗi: {error}</p>

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>Danh sách sinh viên</h1>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Major</th>
                <th style={styles.th}>GPA</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.student_id}>
                  <td style={styles.td}>{s.student_id}</td>
                  <td style={styles.td}>{s.name}</td>
                  <td style={styles.td}>{s.major}</td>
                  <td style={styles.td}>{s.gpa}</td>
                  <td style={styles.td}>
                    <button
                      type="button"
                      style={{ ...styles.btn, ...styles.btnEdit }}
                      onClick={() => openEdit(s)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      style={{ ...styles.btn, ...styles.btnDelete }}
                      onClick={() => handleDelete(s.student_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 && (
            <p style={styles.empty}>Không có sinh viên nào.</p>
          )}
        </>
      )}

      {/* Modal sửa sinh viên */}
      {editId && (
        <div style={styles.modalOverlay} onClick={closeEdit}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Sửa sinh viên</h2>
            <form onSubmit={handleEditSubmit} style={styles.form}>
              <label style={styles.label}>
                Name *
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                Birth year *
                <input
                  type="number"
                  value={form.birth_year}
                  onChange={(e) => setForm((f) => ({ ...f, birth_year: e.target.value }))}
                  required
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                Major *
                <input
                  value={form.major}
                  onChange={(e) => setForm((f) => ({ ...f, major: e.target.value }))}
                  required
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                GPA *
                <input
                  type="number"
                  step="0.01"
                  value={form.gpa}
                  onChange={(e) => setForm((f) => ({ ...f, gpa: e.target.value }))}
                  required
                  style={styles.input}
                />
              </label>
              <div style={styles.formActions}>
                <button type="button" style={styles.btnCancel} onClick={closeEdit}>
                  Hủy
                </button>
                <button type="submit" style={styles.btnSubmit}>Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  wrapper: { background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  title: { marginTop: 0, marginBottom: 20 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 12px', borderBottom: '2px solid #e0e0e0' },
  td: { padding: '10px 12px', borderBottom: '1px solid #eee' },
  btn: { marginRight: 8, padding: '6px 12px', borderRadius: 4, border: 'none', cursor: 'pointer', fontWeight: 600 },
  btnEdit: { background: '#1976d2', color: '#fff' },
  btnDelete: { background: '#d32f2f', color: '#fff' },
  empty: { color: '#666', marginTop: 16 },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: { background: '#fff', padding: 24, borderRadius: 8, minWidth: 320, maxWidth: 400 },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  label: { display: 'flex', flexDirection: 'column', gap: 4, fontSize: 14 },
  input: { padding: '8px 10px', borderRadius: 4, border: '1px solid #ccc' },
  formActions: { display: 'flex', gap: 8, marginTop: 16 },
  btnCancel: { padding: '8px 16px', background: '#eee', border: 'none', borderRadius: 4, cursor: 'pointer' },
  btnSubmit: { padding: '8px 16px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' },
}
