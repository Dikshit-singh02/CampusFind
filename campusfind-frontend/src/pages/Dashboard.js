import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const allFeatures = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊', keywords: ['dashboard', 'home', 'main'] },
    { name: 'Map', path: '/map', icon: '🗺️', keywords: ['map', 'location', 'campus', 'navigate'] },
    { name: 'Lost & Found', path: '/lostfound', icon: '🔍', keywords: ['lost', 'found', 'item', 'report'] },
    { name: 'Notices', path: '/notices', icon: '📢', keywords: ['notice', 'notification', 'announcement'] },
    { name: 'QR Scanner', path: '/qr', icon: '📱', keywords: ['qr', 'scanner', 'code', 'scan'] },
    { name: 'QR Generator', path: '/qr-generator', icon: '🔗', keywords: ['qr', 'generator', 'create', 'code'] },
    { name: 'SOS', path: '/sos', icon: '🚨', keywords: ['sos', 'emergency', 'help', 'alert'] },
    { name: 'Admin Panel', path: '/admin', icon: '⚙️', keywords: ['admin', 'panel', 'administrator', 'manage'] },
    { name: 'Events', path: '/events', icon: '🎉', keywords: ['event', 'events', 'calendar'] },
    { name: 'Login', path: '/', icon: '🔐', keywords: ['login', 'sign in'] },
    { name: 'Signup', path: '/signup', icon: '📝', keywords: ['signup', 'register', 'sign up'] }
  ];

  const filteredFeatures = allFeatures.filter(feature =>
    feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feature.keywords.some(kw => kw.includes(searchTerm.toLowerCase()))
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
                placeholder="Search CampusFind features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </section>
        <div className="dashboard-grid">
          {filteredFeatures.length > 0 ? (
            <div className="row g-3">
              {filteredFeatures.map((feature, index) => (
                <div key={index} className={`col-md-6 col-lg-4 fadeInUp`}>
                  <Link to={feature.path} className="text-decoration-none">
                    <div className="h-100 search-result-card">
                      <div className="module-card h-100">
                        <div className="module-card-inner h-100">
                          <div className="card-glass h-100 p-3">
                            <div className="card-body d-flex flex-column justify-content-center h-100 p-2 text-center">
                              <div className="icon-pulse mb-2 fs-1">{feature.icon}</div>
                              <h5 className="card-title-dashboard mb-3">{feature.name}</h5>
                              <div className="gradient-btn">Open {feature.name}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : searchTerm ? (
            <div className="text-center py-5 my-5">
              <i className="fas fa-search fs-1 text-muted mb-4"></i>
              <h4 className="mb-3">No features found matching "{searchTerm}"</h4>
              <p className="text-muted lead">Try searching for Map, Lost & Found, QR, SOS, Admin, Events, Login or Signup</p>
              <small className="opacity-75">Clear search to see all features</small>
            </div>
          ) : null}
          
          <div className="row g-4 mt-auto">
            <div className="col-lg-8">
              <div className="row g-3">
                {allFeatures.slice(0, 6).map((feature, index) => (
                  <div key={index} className={`col-md-6 fadeInUp`} style={{animationDelay: `${index * 0.1}s`}}>
                    <Link to={feature.path} className="text-decoration-none">
                      <div className="module-card h-100">
                        <div className="module-card-inner h-100">
                          <div className="card-glass h-100 p-4">
                            <div className="card-body d-flex flex-column justify-content-center h-100 text-center">
                              <div className="icon-pulse mb-3 fs-1">{feature.icon}</div>
                              <h5 className="card-title-dashboard mb-4">{feature.name}</h5>
                              <div className="gradient-btn w-100">Go to {feature.name}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-4">
              <div className="qr-section h-100 d-flex flex-column justify-content-center">
                <div className="qr-card h-100 p-4">
                  <QRCodeSVG value={websiteUrl} size={200} />
                  <h6 className="mt-4 mb-2 text-purple">Scan to Share</h6>
                  <p className="text-muted small mb-0">CampusFind - Your Campus Companion</p>
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
