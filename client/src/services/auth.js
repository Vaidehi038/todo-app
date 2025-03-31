import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const register = (userData) => axios.post(`${API_URL}/register`, userData);
const login = (userData) => axios.post(`${API_URL}/login`, userData);

const authService = {
  register,
  login
};

export default authService; 