import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const stats = [
    { label: 'Lost Items', value: '23', change: '+4 today', icon: '📦', color: '#EF4444' },
    { label: 'Found Items', value: '15', change: '+2 today', icon: '✅', color: '#10B981' },
    { label: 'Active Notices', value: '5', change: 'New', icon: '📢', color: '#3B82F6' },
    { label: 'SOS Alerts', value: '2', change: '+1 today', icon: '🚨', color: '#F59E0B' }
  ];

  const features = [
    { name: 'Campus Map', path: '/map', icon: '🗺️', desc: 'Navigate campus' },
    { name: 'Lost & Found', path: '/lostfound', icon: '🔍', desc: 'Report items' },
    { name: 'Notices', path: '/notices', icon: '📢', desc: 'Latest updates' },
    { name: 'QR Scanner', path: '/qr', icon: '📱', desc: 'Scan locations' }
  ];

  const recentActivity = [
    { time: '2 min ago', action: 'New lost item reported in Library' },
    { time: '10 min ago', action: 'SOS alert resolved - Lab 1' },
    { time: '1 hr ago', action: 'Notice posted by Admin' },
    { time: 'Today', action: 'QR Scanner used 5 times' }
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Clean, fast access to essential campus tools</p>
      </header>

      {/* Stats Row */}
      <section className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ '--stat-color': stat.color }}>
            <div className="stat-icon">
              {stat.icon}
            </div>
            <div className="stat-number">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-change">{stat.change}</div>
          </div>
        ))}
      </section>

      {/* Features 2x2 Grid */}
      <section className="features-grid">
        <h2>Quick Actions</h2>
        <div className="features-row">
          {features.map((feature, index) => (
            <Link key={index} to={feature.path} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.name}</h3>
              <p>{feature.desc}</p>
              <button className="simple-btn">Go</button>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {recentActivity.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-time">{activity.time}</div>
              <div className="activity-desc">{activity.action}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
