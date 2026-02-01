import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const signup = async (data) => {
  return api.post('/auth/signup', data);
};

export const login = async (data) => {
  return api.post('/auth/login', data);
};

export default api;
