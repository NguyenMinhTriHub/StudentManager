import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createStudent } from '../services/api'

export default function AddStudent() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    birth_year: '',
    major: '',
    gpa: '',
  })
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null)
    const payload = {
      name: form.name,
      birth_year: Number(form.birth_year),
      major: form.major,
      gpa: Number(form.gpa),
    }
    createStudent(payload)
      .then(() => navigate('/'))
      .catch((e) => setError(e.message))
  }

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>Thêm sinh viên</h1>
      {error && <p style={styles.error}>Lỗi: {error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Student ID
          <input type="text" value="(Tự động sau khi thêm)" disabled style={styles.input} />
        </label>
        <label style={styles.label}>
          Name *
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Họ tên"
          />
        </label>
        <label style={styles.label}>
          Birth year *
          <input
            name="birth_year"
            type="number"
            value={form.birth_year}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Năm sinh"
          />
        </label>
        <label style={styles.label}>
          Major *
          <input
            name="major"
            value={form.major}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Chuyên ngành"
          />
        </label>
        <label style={styles.label}>
          GPA *
          <input
            name="gpa"
            type="number"
            step="0.01"
            value={form.gpa}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Điểm GPA"
          />
        </label>
        <button type="submit" style={styles.btnAdd}>
          Add Student
        </button>
      </form>
    </div>
  )
}

const styles = {
  wrapper: { background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxWidth: 480 },
  title: { marginTop: 0, marginBottom: 20 },
  error: { color: '#d32f2f', marginBottom: 12 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  label: { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14 },
  input: { padding: '10px 12px', borderRadius: 4, border: '1px solid #ccc', fontSize: 14 },
  btnAdd: {
    padding: '12px 24px',
    background: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 8,
  },
}
