import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const modules = [
    { name: 'Map', path: '/map', icon: '🗺️' },
    { name: 'Lost & Found', path: '/lostfound', icon: '🔍' },
    { name: 'Notices & Notifications', path: '/notices', icon: '📢' },
    { name: 'QR Scanner', path: '/qr', icon: '📱' },
    { name: 'SOS', path: '/sos', icon: '🚨' },
    { name: 'Admin Panel', path: '/admin', icon: '⚙️' }
  ];

  const filteredModules = modules.filter(module =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const websiteUrl = window.location.origin;

  return (
    <div className="dashboard-root">
      <main role="main">
        <section className="dashboard-hero">
          <h1>Welcome to CampusFind</h1>
          <p>Your campus companion - everything you need at your fingertips</p>
          <div className="dashboard-search mt-4">
            <div className="search-container">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                className="search-input"
                placeholder="Search features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </section>
        <div className="dashboard-grid">
          {filteredModules.length > 0 ? (
            <div className="row">
              {filteredModules.map((module, index) => (
                <div key={index} className={`col-md-4 mb-3 fadeInUp`}>
                  <div className="module-card h-100">
                    <div className="module-card-inner h-100">
                      <div className="card-glass h-100 p-3">
                        <div className="card-body text-center d-flex flex-column justify-content-center h-100 p-2">
                          <div className="icon-pulse mb-2">{module.icon}</div>
                          <h5 className="card-title-dashboard mb-3">{module.name}</h5>
                          <Link to={module.path} className="gradient-btn w-100">
                            Go to {module.name}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <h4>No features found matching "{searchTerm}"</h4>
              <p className="text-muted">Try searching for Map, Lost & Found, SOS, etc.</p>
            </div>
          )}
          
          {/* QR Code Section */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="qr-section text-center">
                <h5 className="mb-4">Share CampusFind</h5>
                <div className="qr-card p-4">
<QRCodeSVG value={websiteUrl} size={180} />
                  <p className="mt-3 mb-0 text-muted small">Scan to visit CampusFind</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
