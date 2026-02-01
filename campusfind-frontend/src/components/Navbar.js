import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">CampusFind</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/map">Map</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/lostfound">Lost & Found</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/notices">Notices</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/qr">QR Scanner</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/sos">SOS</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin">Admin</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
