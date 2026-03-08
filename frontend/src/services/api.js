import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

export const getClasses = () => api.get('/classes')
export const getStudents = (params) => api.get('/students', { params: params || {} })
export const getStudent = (id) => api.get(`/students/${id}`)
export const createStudent = (data) => api.post('/students', data)
export const updateStudent = (id, data) => api.put(`/students/${id}`, data)
export const deleteStudent = (id) => api.delete(`/students/${id}`)
export const getStats = () => api.get('/stats')

/** Export CSV - tra ve blob de download file */
export const exportStudentsCsv = (params) =>
  api.get('/students/export/csv', {
    params: params || {},
    responseType: 'blob',
  })
