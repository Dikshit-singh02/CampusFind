import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const updateUser = () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          setUser(JSON.parse(userStr));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    updateUser(); // Initial load

    const handleStorageChange = (e) => {
      if (e.key === 'user') updateUser();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', updateUser);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', updateUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark bg-dark navbar-enhanced ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <Link className="navbar-brand navbar-brand-enhanced" to="/">
          CampusFind
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link nav-link-enhanced" to="/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-link-enhanced" to="/map">Map</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-link-enhanced" to="/lostfound">Lost & Found</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-link-enhanced" to="/notices">Notices</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-link-enhanced" to="/qr">QR Scanner</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-link-enhanced" to="/sos">SOS</Link>
            </li>
            {user && user.role === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link nav-link-enhanced" to="/admin">Admin</Link>
              </li>
            )}
            {user ? (
              <>
                <li className="nav-item position-relative">
                  <button className="btn nav-link nav-link-enhanced position-relative p-2" style={{borderRadius: '50%'}}>
                    <i className="fas fa-bell fs-5"></i>
                    <span className="notification-badge">3</span>
                  </button>
                </li>
                <li className="nav-item">
                  <button className="btn logout-btn-enhanced ms-2" onClick={handleLogout}>
                    Logout ({user.name})
                  </button>
                </li>
              </>
            ) : null}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
