import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import { getDashboardStats } from '../services/api.js';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats({
          lostItems: {
            title: 'Lost Items',
            count: data.lostItems.count,
            todayCount: data.lostItems.today,
            icon: '📦',
            color: '#EF4444',
            route: '/lostfound'
          },
          foundItems: {
            title: 'Found Items',
            count: data.foundItems.count,
            todayCount: data.foundItems.today,
            icon: '✅',
            color: '#10B981',
            route: '/lostfound'
          },
          notices: {
            title: 'Active Notices',
            count: data.notices.count,
            todayCount: data.notices.today,
            icon: '📢',
            color: '#3B82F6',
            route: '/notices'
          },
          sosAlerts: {
            title: 'SOS Alerts',
            count: data.sosAlerts.count,
            todayCount: data.sosAlerts.today,
            icon: '🚨',
            color: '#F59E0B',
            route: '/sos'
          }
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        // Fallback mock data
        setStats({
          lostItems: { title: 'Lost Items', count: '23', todayCount: '+4', icon: '📦', color: '#EF4444', route: '/lostfound' },
          foundItems: { title: 'Found Items', count: '15', todayCount: '+2', icon: '✅', color: '#10B981', route: '/lostfound' },
          notices: { title: 'Active Notices', count: '5', todayCount: 'New', icon: '📢', color: '#3B82F6', route: '/notices' },
          sosAlerts: { title: 'SOS Alerts', count: '2', todayCount: '+1', icon: '🚨', color: '#F59E0B', route: '/sos' }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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

  if (loading) {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Loading stats...</p>
        </header>
        <section className="stats-grid">
          {Array(4).fill().map((_, index) => (
            <div key={index} className="stat-card" style={{ height: '200px' }}>
              <div style={{ width: '60px', height: '60px', background: '#e2e8f0', borderRadius: '16px', marginBottom: '1rem', animation: 'pulse 1.5s ease-in-out infinite' }}></div>
              <div style={{ height: '48px', background: '#e2e8f0', borderRadius: '8px', marginBottom: '0.5rem', animation: 'pulse 1.5s ease-in-out infinite 0.2s' }}></div>
              <div style={{ height: '16px', background: '#e2e8f0', borderRadius: '4px', animation: 'pulse 1.5s ease-in-out infinite 0.4s' }}></div>
            </div>
          ))}
        </section>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Clean, fast access to essential campus tools</p>
      </header>

      {/* Stats Row */}
      <section className="stats-grid">
        <DashboardCard {...stats.lostItems} />
        <DashboardCard {...stats.foundItems} />
        <DashboardCard {...stats.notices} />
        <DashboardCard {...stats.sosAlerts} />
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
