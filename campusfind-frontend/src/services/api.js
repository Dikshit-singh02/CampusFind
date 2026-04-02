import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const signup = async (data) => {
  return api.post('/auth/signup', data);
};

export const login = async (data) => {
  return api.post('/auth/login', data);
};

// User Management API (Admin)
export const getAllUsers = async () => {
  return api.get('/users');
};

export const getUserStats = async () => {
  return api.get('/users/stats');
};

export const updateUserRole = async (userId, role) => {
  return api.put(`/users/${userId}/role`, { role });
};

export const deleteUser = async (userId) => {
  return api.delete(`/users/${userId}`);
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

// QR Code API
export const getItemByQRCode = async (qrCode) => {
  return api.get(`/lostfound/qr/${qrCode}`);
};

export const updateItemStatus = async (id, data) => {
  return api.put(`/lostfound/status/${id}`, data);
};

// ========== ADMIN LOST & FOUND ==========
export const getLostItemById = async (id) => {
  return api.get(`/lostfound/admin/lost/${id}`);
};

export const updateLostItem = async (id, data) => {
  return api.put(`/lostfound/admin/lost/${id}`, data);
};

export const deleteLostItem = async (id) => {
  return api.delete(`/lostfound/admin/lost/${id}`);
};

export const getFoundItemById = async (id) => {
  return api.get(`/lostfound/admin/found/${id}`);
};

export const updateFoundItem = async (id, data) => {
  return api.put(`/lostfound/admin/found/${id}`, data);
};

export const deleteFoundItem = async (id) => {
  return api.delete(`/lostfound/admin/found/${id}`);
};

// Notices API (fixed endpoint)
export const getNotices = async (status = 'All') => {
  let queryString = '';
  if (status && status !== 'All') {
    queryString = `?status=${encodeURIComponent(status)}`;
  }
  return api.get(`/notices${queryString}`);
};

export const createNotice = async (data) => {
  return api.post('/notices', data);
};

// Legacy notifications (kept for compatibility)
export const getNotifications = async (type, status) => {
  let queryString = '';
  if (type || (status && status !== 'All')) {
    const params = [];
    if (type) params.push(`type=${encodeURIComponent(type)}`);
    if (status && status !== 'All') params.push(`status=${encodeURIComponent(status)}`);
    queryString = '?' + params.join('&');
  }
  return api.get(`/notifications${queryString}`);
};

export const createNotification = async (data) => {
  return api.post('/notifications', data);
};

// Location Help System APIs
export const getLocation = async (code) => {
  return api.get(`/locations/${code}`);
};

export const reportIssue = async (data) => {
  return api.post('/locations/issues', data);
};

export const createSOS = async (data) => {
  return api.post('/sos', data);
};

// Dashboard count APIs (mock data for demo - replace with real endpoints)
export const getDashboardStats = async () => {
  // Mock response - replace with real backend calls
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        lostItems: {
          count: 23,
          today: '+4'
        },
        foundItems: {
          count: 15,
          today: '+2'
        },
        notices: {
          count: 5,
          today: 'New'
        },
        sosAlerts: {
          count: 2,
          today: '+1'
        }
      });
    }, 1000);
  });
};

export const getLostItemsCount = async () => ({ count: 23, today: '+4' });
export const getFoundItemsCount = async () => ({ count: 15, today: '+2' });
export const getNoticesCount = async () => ({ count: 5, today: 'New' });
export const getSOSCount = async () => ({ count: 2, today: '+1' });

export default api;
