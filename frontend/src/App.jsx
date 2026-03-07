import { Routes, Route, Link } from 'react-router-dom'
import StudentList from './pages/StudentList'
import AddStudent from './pages/AddStudent'

function App() {
  return (
    <div style={styles.app}>
      <nav style={styles.nav}>
        <Link to="/" style={styles.link}>Danh sách</Link>
        <Link to="/add" style={styles.link}>Thêm sinh viên</Link>
      </nav>
      <main style={styles.main}>
        <Routes>
          <Route path="/" element={<StudentList />} />
          <Route path="/add" element={<AddStudent />} />
        </Routes>
      </main>
    </div>
  )
}

const styles = {
  app: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  nav: {
    background: '#1976d2',
    padding: '12px 24px',
    display: 'flex',
    gap: '16px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 600,
  },
  main: { flex: 1, padding: '24px', maxWidth: 960, margin: '0 auto', width: '100%' },
}

export default App
