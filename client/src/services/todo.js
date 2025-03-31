import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const todoService = {
  getTodos: () => axios.get(`${API_URL}/todos`, { headers: getAuthHeader() }),
  
  createTodo: (todoData) => axios.post(`${API_URL}/todos`, todoData, { headers: getAuthHeader() }),
  
  updateTodo: (id, todoData) => axios.put(`${API_URL}/todos/${id}`, todoData, { headers: getAuthHeader() }),
  
  deleteTodo: (id) => axios.delete(`${API_URL}/todos/${id}`, { headers: getAuthHeader() })
};

export default todoService; 