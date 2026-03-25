import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

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
    <div className="dashboard-root">
      <main role="main">
        <section className="dashboard-hero">
          <h1>Welcome to CampusFind</h1>
          <p>Your campus companion - everything you need at your fingertips</p>
        </section>
        <div className="dashboard-grid">
          <div className="row">
            {modules.map((module, index) => (
              <div key={index} className={`col-md-4 mb-4 fadeInUp`}>
                <div className="module-card">
                  <div className="module-card-inner h-100">
                    <div className="card-glass h-100 p-4">
                      <div className="card-body text-center d-flex flex-column justify-content-center h-100">
                        <div className="icon-pulse mb-3">{module.icon}</div>
                        <h5 className="card-title-dashboard">{module.name}</h5>
                        <Link to={module.path} className="gradient-btn mt-auto">
                          Go to {module.name}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
