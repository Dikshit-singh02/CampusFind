import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const modules = [
    { name: 'Map', path: '/map', icon: '🗺️' },
    { name: 'Lost & Found', path: '/lostfound', icon: '🔍' },
    { name: 'Notices & Notifications', path: '/notices', icon: '📢' },
    { name: 'QR Scanner', path: '/qr', icon: '📱' },
    { name: 'SOS', path: '/sos', icon: '🚨' },
    { name: 'Admin Panel', path: '/admin', icon: '⚙️' }
  ];

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Dashboard</h2>
      <div className="row">
        {modules.map((module, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <div className="mb-3" style={{ fontSize: '3rem' }}>{module.icon}</div>
                <h5 className="card-title">{module.name}</h5>
                <Link to={module.path} className="btn btn-primary">Go to {module.name}</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
