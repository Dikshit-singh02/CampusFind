import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/MapPage';
import LostFoundPage from './pages/LostFoundPage';
import NoticePage from './pages/NoticePage';
import QRGeneratorPage from './pages/QRGeneratorPage';
import EventsPage from './pages/EventsPage';
import EventPage from './pages/EventPage';
import SOSPage from './pages/SOSPage';
import AdminPanel from './pages/AdminPanel';
import './App.css';


// Private Route component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 ms-sidebar" style={{marginLeft: '250px'}}>
        {children}
      </div>
    </div>
  ) : <Navigate to="/" />;
};

// Admin Route component
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token) {
    return <Navigate to="/" />;
  }
  
  const user = userStr ? JSON.parse(userStr) : null;
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 ms-sidebar" style={{marginLeft: '250px'}}>
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="app-container">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/map" element={
            <PrivateRoute>
              <MapPage />
            </PrivateRoute>
          } />
          <Route path="/lostfound" element={
            <PrivateRoute>
              <LostFoundPage />
            </PrivateRoute>
          } />
          <Route path="/notices" element={
            <PrivateRoute>
              <NoticePage />
            </PrivateRoute>
          } />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/event/:id" element={<EventPage />} />
          <Route path="/qr" element={
            <PrivateRoute>
              <QRGeneratorPage />
            </PrivateRoute>
          } />
          <Route path="/qr-generator" element={
            <PrivateRoute>
              <QRGeneratorPage />
            </PrivateRoute>
          } />

          <Route path="/sos" element={
            <PrivateRoute>
              <SOSPage />
            </PrivateRoute>
          } />
          <Route path="/admin" element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          } />
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
