import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';

const EventPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [showQR, setShowQR] = useState(null);
  const [qrValue, setQrValue] = useState('');
  const canvasRef = useRef(null);
  const downloadLinkRef = useRef(null);
  const navigate = useNavigate();

  // Load events from localStorage
  const loadEvents = () => {
    const saved = localStorage.getItem('campusEvents');
    if (saved) {
      const events = JSON.parse(saved);
      const foundEvent = events.find(e => e.id === id);
      setEvent(foundEvent || null);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [id]);

  const baseUrl = window.location.origin;

  const generateQR = (path) => {
    const fullUrl = `${baseUrl}${path}`;
    setQrValue(fullUrl);
    setShowQR(path);
  };

  const downloadQR = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = downloadLinkRef.current;
      link.href = canvas.toDataURL();
      link.download = `qr-event-${showQR === '/events' ? 'all' : showQR}.png`;
      link.click();
    }
  };

  const closeQR = () => {
    setShowQR(null);
    setQrValue('');
  };

  if (!event) {
    return (
      <div className="container mt-5 min-vh-100 d-flex align-items-center">
        <div className="text-center">
          <h2 className="display-4 fw-bold text-muted">Event not found</h2>
          <p className="lead">Event ID: {id}</p>
          <p className="text-muted">No event found in localStorage with this ID.</p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/events')}>
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 min-vh-100">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <button className="btn btn-outline-secondary mb-4" onClick={() => navigate('/events')}>
            <i className="fas fa-arrow-left me-2"></i>Back to Events
          </button>
          
          <div className="card shadow-lg border-0 mb-5">
            <div className="card-body p-5 text-center">
              <h1 className="display-4 fw-bold text-primary mb-4">{event.title}</h1>
              <div className="row mb-5">
                <div className="col-md-4">
                  <h5 className="text-muted"><i className="fas fa-calendar me-2"></i>Date</h5>
                  <p className="fs-4 fw-bold">{event.date}</p>
                </div>
                <div className="col-md-4">
                  <h5 className="text-muted"><i className="fas fa-map-marker-alt me-2"></i>Location</h5>
                  <p className="fs-4 fw-bold">{event.location}</p>
                </div>
                <div className="col-md-4">
                  <h5 className="text-muted"><i className="fas fa-info-circle me-2"></i>Event ID</h5>
                  <p className="fs-4 fw-bold">{event.id}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <h3 className="fw-bold mb-4">Details</h3>
                  <p className="lead lh-lg text-muted">{event.description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="mb-4">
              <h3 className="fw-bold text-primary mb-3">Generate QR Codes</h3>
              <p className="text-muted mb-4">Scan to redirect to this page on deployed site</p>
            </div>
            <div className="row g-3 justify-content-center">
              <div className="col-auto">
                <button 
                  className="btn btn-success btn-lg px-5 py-3"
                  onClick={() => generateQR(`/event/${id}`)}
                >
                  <i className="fas fa-qrcode me-2"></i>QR: This Event
                </button>
              </div>
              <div className="col-auto">
                <button 
                  className="btn btn-outline-success btn-lg px-5 py-3"
                  onClick={() => generateQR('/events')}
                >
                  <i className="fas fa-qrcode me-2"></i>QR: All Events
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Modal - same as EventsPage */}
      {showQR && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center" style={{zIndex: 1060}}>
          <div className="bg-white rounded-4 p-5 shadow-lg" style={{maxWidth: '400px', width: '90vw'}}>
            <div className="text-center mb-4">
              <h3 className="fw-bold text-primary mb-3">
                QR Code: {showQR === '/events' ? 'All Events' : `Event ${showQR.slice(7)}`}
              </h3>
              <QRCodeCanvas
                canvasRef={canvasRef}
                value={qrValue}
                size={256}
                fgColor="#000000"
                bgColor="#ffffff"
              />
              <code className="small text-muted d-block mt-3 mb-4">{qrValue}</code>
            </div>
            <div className="d-flex gap-2 justify-content-center">
              <button className="btn btn-success px-4" onClick={downloadQR}>
                <i className="fas fa-download me-2"></i>Download PNG
              </button>
              <button className="btn btn-secondary px-4" onClick={closeQR}>
                Close
              </button>
            </div>
            <canvas ref={canvasRef} style={{display: 'none'}} />
            <a ref={downloadLinkRef} style={{display: 'none'}}>Download</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventPage;

