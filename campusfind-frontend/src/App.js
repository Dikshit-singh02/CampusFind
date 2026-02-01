import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/MapPage';
import LostFoundPage from './pages/LostFoundPage';
import NoticePage from './pages/NoticePage';
import QRScannerPage from './pages/QRScannerPage';
import SOSPage from './pages/SOSPage';
import AdminPanel from './pages/AdminPanel';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/lostfound" element={<LostFoundPage />} />
        <Route path="/notices" element={<NoticePage />} />
        <Route path="/qr" element={<QRScannerPage />} />
        <Route path="/sos" element={<SOSPage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
