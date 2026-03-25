import React, { useState, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';

const EventsPage = () => {
  const [showQR, setShowQR] = useState(null); // null, 'all', or event id
  const [qrValue, setQrValue] = useState('');
  const canvasRef = useRef(null);
  const downloadLinkRef = useRef(null);
  const navigate = useNavigate();

  // Event management with localStorage
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: ''
  });

  // Load events from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('campusEvents');
    if (saved) {
      setEvents(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  const saveEvents = (newEvents) => {
    setEvents(newEvents);
    localStorage.setItem('campusEvents', JSON.stringify(newEvents));
  };

  // Add new event
  const addEvent = (e) => {
    e.preventDefault();
    const newEvent = {
      id: Date.now().toString(),
      ...formData
    };
    saveEvents([newEvent, ...events]);
    setFormData({ title: '', date: '', location: '', description: '' });
    setShowForm(false);
  };

  // Update form
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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

  return (
    <div className="container mt-5 min-vh-100">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="d-flex justify-content-between align-items-center mb-5">
            <h1 className="display-5 fw-bold text-primary">
              <i className="fas fa-calendar-alt me-3"></i>
              Campus Events
            </h1>
            <button 
              className="btn btn-success btn-lg px-4 py-2 me-2"
              onClick={() => generateQR('/events')}
            >
              <i className="fas fa-qrcode me-2"></i>
              QR: All Events
            </button>
            <button 
              className="btn btn-primary btn-lg px-4 py-2"
              onClick={() => setShowForm(!showForm)}
            >
              <i className="fas fa-plus me-2"></i>
              {showForm ? 'Cancel' : 'Add Event'}
            </button>
          </div>

          {/* Add Event Form */}
          {showForm && (
            <div className="card shadow mb-5">
              <div className="card-body p-4">
                <h3 className="fw-bold mb-4">Create New Event</h3>
                <form onSubmit={addEvent}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Title</label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Date</label>
                      <input
                        type="date"
                        className="form-control form-control-lg"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Location</label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Description</label>
                      <textarea
                        className="form-control form-control-lg"
                        rows="3"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <button type="submit" className="btn btn-success btn-lg px-5">
                      <i className="fas fa-save me-2"></i>Create Event
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="row g-4 mb-5">
            {events.map((event) => (
              <div key={event.id} className="col-lg-6 col-xl-4">
                <div className="card h-100 shadow-lg border-0 hover-lift">
                  <div className="card-body p-4">
                    <h3 className="card-title fw-bold text-primary mb-2">{event.title}</h3>
                    <p className="text-muted mb-1"><i className="fas fa-calendar me-2"></i>{event.date}</p>
                    <p className="text-muted mb-3"><i className="fas fa-map-marker-alt me-2"></i>{event.location}</p>
                    <p className="card-text lh-lg text-truncate" title={event.description}>{event.description}</p>
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-outline-primary flex-fill"
                        onClick={() => navigate(`/event/${event.id}`)}
                      >
                        View Details
                      </button>
                      <button 
                        className="btn btn-success px-3"
                        onClick={() => generateQR(`/event/${event.id}`)}
                      >
                        <i className="fas fa-qrcode"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QR Modal */}
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

export default EventsPage;

