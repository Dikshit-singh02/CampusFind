import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css'; // Reuse hover styles or create new

const DashboardCard = ({ title, count, todayCount, icon, color, route }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(route);
  };

  return (
    <div 
      className="stat-card dashboard-card" 
      style={{ 
        '--stat-color': color,
        cursor: 'pointer'
      }}
      onClick={handleClick}
    >
      <div className="stat-icon">
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="stat-number">{count || '0'}</div>
      <div className="stat-label">{title}</div>
      <div className="stat-change">{todayCount || 'Loading...'}</div>
    </div>
  );
};

export default DashboardCard;

