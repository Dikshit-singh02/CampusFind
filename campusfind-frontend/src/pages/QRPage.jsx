import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLocation, createSOS, reportIssue } from '../services/api';

const QRPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (code) {
      fetchLocation();
    } else {
      setError('No location code found');
      setLoading(false);
    }
  }, [code]);

  const fetchLocation = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getLocation(code);
      setLocation(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Location not found');
    } finally {
      setLoading(false);
    }
  };

  const handleSOS = async () => {
    try {
      setError(null);
      const message = `Emergency help needed at ${location.name}`;
      await createSOS({ location: code, message });
      setSuccess('SOS sent successfully! Help is on the way.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send SOS');
    }
  };

  const handleReportIssue = async () => {
    const issueText = prompt('Describe the issue:');
    if (!issueText || issueText.trim() === '') return;

    try {
      setError(null);
      await reportIssue({ location: code, issue: issueText.trim() });
      setSuccess('Issue reported successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to report issue');
    }
  };

  const handleViewNotices = () => {
    navigate('/notices');
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading location details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 p-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="text-center mb-5">
            <h1 className="display-5 fw-bold mb-3 text-primary">
              📍 {location ? location.name : code.toUpperCase()}
            </h1>
            <p className="lead text-muted">Smart Location Help System</p>
            <code className="bg-dark text-white px-3 py-2 rounded-pill small">
              QR Code: {code.toUpperCase()}
            </code>
          </div>

          {error && (
            <div className="alert alert-danger">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
              <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchLocation}>
                Retry
              </button>
            </div>
          )}

          {success && (
            <div className="alert alert-success alert-dismissible fade show">
              <i className="fas fa-check-circle me-2"></i>
              {success}
              <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
            </div>
          )}

          {location && (
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <div className="row mb-5">
                  <div className="col-md-8">
                    <h2 className="fw-bold text-primary mb-3">{location.name}</h2>
                    <p className="fs-5 text-muted lh-lg">{location.description}</p>
                  </div>
                  <div className="col-md-4 text-md-end">
                    <small className="text-muted">Scanned: {new Date().toLocaleString()}</small>
                  </div>
                </div>

                <div className="row g-4">
                  <div className="col-md-4">
                    <button className="btn btn-danger btn-lg w-100 py-4 fs-4" onClick={handleSOS}>
                      🚨 SOS Emergency
                    </button>
                  </div>
                  <div className="col-md-4">
                    <button className="btn btn-warning btn-lg w-100 py-4 fs-4" onClick={handleReportIssue}>
                      ⚠️ Report Issue
                    </button>
                  </div>
                  <div className="col-md-4">
                    <button className="btn btn-info btn-lg w-100 py-4 fs-4" onClick={handleViewNotices}>
                      📋 View Notices
                    </button>
                  </div>
                </div>
              </div>

              <div className="card-footer bg-light text-center py-4">
                <small className="text-muted">
                  CampusFind Location Help | Need login? <a href="/">Go to Dashboard</a>
                </small>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRPage;

