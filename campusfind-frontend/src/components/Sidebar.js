import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/map', label: 'Map', icon: '🗺️' },
    { to: '/lostfound', label: 'Lost & Found', icon: '🔍' },
    { to: '/notices', label: 'Notices', icon: '📢' },
    { to: '/qr', label: 'QR Scanner', icon: '📱' },
    { to: '/sos', label: 'SOS', icon: '🚨' },
    { to: '/admin', label: 'Admin Panel', icon: '⚙️' }
  ];

  return (
    <div className="sidebar-root">
      <ul className="sidebar-list">
        {menuItems.map((item) => (
          <li key={item.to}>
            <Link 
              to={item.to} 
              className={`sidebar-item ${location.pathname === item.to ? 'active' : ''}`}
            >
              <span style={{marginRight: '12px'}}>{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
