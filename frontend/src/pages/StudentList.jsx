import { useState, useEffect } from 'react'
import { getStudents, getClasses, getStats, deleteStudent, updateStudent, exportStudentsCsv } from '../services/api'

const emptyForm = { name: '', birth_year: '', major: '', gpa: '', class_id: '' }

export default function StudentList() {
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const loadStudents = (searchTerm) => {
    return getStudents(searchTerm ? { search: searchTerm } : {}).then((res) => res.data)
  }

  const load = () => {
    setLoading(true)
    Promise.all([
      loadStudents(search),
      getClasses().then((r) => r.data),
      getStats().then((r) => r.data),
    ])
      .then(([studentsRes, classesRes, statsRes]) => {
        setStudents(studentsRes)
        setClasses(classesRes)
        setStats(statsRes)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    loadStudents(search)
      .then(setStudents)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  const handleDelete = (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sinh viên này?')) return
    deleteStudent(id)
      .then(() => {
        load()
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
      class_id: s.class_id || '',
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
      class_id: form.class_id,
    }
    updateStudent(editId, payload)
      .then(() => {
        closeEdit()
        load()
      })
      .catch((e) => setError(e.message))
  }

  const handleExportCsv = () => {
    exportStudentsCsv(search ? { search } : {})
      .then((res) => {
        const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8-sig' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'students.csv'
        a.click()
        URL.revokeObjectURL(url)
      })
      .catch((e) => setError(e.message))
  }

  if (error) return <p style={{ color: 'red' }}>Lỗi: {error}</p>

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>Danh sách sinh viên</h1>

      {/* Dashboard thống kê */}
      {stats && (
        <div style={styles.dashboard}>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Tổng số sinh viên</span>
            <span style={styles.statValue}>{stats.total_students}</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>GPA trung bình toàn trường</span>
            <span style={styles.statValue}>{stats.avg_gpa}</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Số sinh viên theo ngành</span>
            <div style={styles.byMajor}>
              {Object.entries(stats.students_by_major || {}).map(([major, count]) => (
                <span key={major} style={styles.byMajorItem}>{major}: {count}</span>
              ))}
              {(!stats.students_by_major || Object.keys(stats.students_by_major).length === 0) && (
                <span style={styles.byMajorItem}>—</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tìm kiếm + Export CSV */}
      <div style={styles.toolbar}>
        <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên sinh viên..."
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchBtn}>Tìm kiếm</button>
        </form>
        <button type="button" onClick={handleExportCsv} style={styles.exportBtn}>
          Export CSV
        </button>
      </div>

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
                <th style={styles.th}>Tên lớp</th>
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
                  <td style={styles.td}>{s.class_name ?? '—'}</td>
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

      {/* Modal sửa sinh viên - Dropdown chọn lớp */}
      {editId && (
        <div style={styles.modalOverlay} onClick={closeEdit}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Sửa sinh viên</h2>
            <form onSubmit={handleEditSubmit} style={styles.form}>
              <label style={styles.label}>
                Lớp học *
                <select
                  value={form.class_id}
                  onChange={(e) => setForm((f) => ({ ...f, class_id: e.target.value }))}
                  required
                  style={styles.select}
                >
                  <option value="">— Chọn lớp —</option>
                  {classes.map((c) => (
                    <option key={c.class_id} value={c.class_id}>{c.class_name}</option>
                  ))}
                </select>
              </label>
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
  dashboard: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
    padding: 16,
    background: '#f5f5f5',
    borderRadius: 8,
  },
  statCard: {
    flex: '1 1 200px',
    minWidth: 180,
    padding: 12,
    background: '#fff',
    borderRadius: 6,
    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
  },
  statLabel: { display: 'block', fontSize: 12, color: '#666', marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: 600 },
  byMajor: { display: 'flex', flexDirection: 'column', gap: 2, fontSize: 13 },
  byMajorItem: { marginTop: 2 },
  toolbar: { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 16 },
  searchForm: { display: 'flex', gap: 8 },
  searchInput: { padding: '8px 12px', width: 240, borderRadius: 4, border: '1px solid #ccc' },
  searchBtn: { padding: '8px 16px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' },
  exportBtn: { padding: '8px 16px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 },
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
  select: { padding: '8px 10px', borderRadius: 4, border: '1px solid #ccc', fontSize: 14 },
  formActions: { display: 'flex', gap: 8, marginTop: 16 },
  btnCancel: { padding: '8px 16px', background: '#eee', border: 'none', borderRadius: 4, cursor: 'pointer' },
  btnSubmit: { padding: '8px 16px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' },
}
