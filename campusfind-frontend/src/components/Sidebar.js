import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="bg-light border-right" id="sidebar-wrapper" style={{ width: '250px', height: '100vh', position: 'fixed', left: 0, top: 0, paddingTop: '56px' }}>
      <div className="list-group list-group-flush">
        <Link to="/dashboard" className="list-group-item list-group-item-action">Dashboard</Link>
        <Link to="/map" className="list-group-item list-group-item-action">Map</Link>
        <Link to="/lostfound" className="list-group-item list-group-item-action">Lost & Found</Link>
        <Link to="/notices" className="list-group-item list-group-item-action">Notices</Link>
        <Link to="/qr" className="list-group-item list-group-item-action">QR Scanner</Link>
        <Link to="/sos" className="list-group-item list-group-item-action">SOS</Link>
        <Link to="/admin" className="list-group-item list-group-item-action">Admin Panel</Link>
      </div>
    </div>
  );
};

export default Sidebar;
