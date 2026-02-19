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

// Lost Items API
export const getLostItems = async () => {
  return api.get('/lostfound/lost');
};

export const createLostItem = async (data) => {
  return api.post('/lostfound/lost', data);
};

// Found Items API
export const getFoundItems = async () => {
  return api.get('/lostfound/found');
};

export const createFoundItem = async (data) => {
  return api.post('/lostfound/found', data);
};

export default api;
