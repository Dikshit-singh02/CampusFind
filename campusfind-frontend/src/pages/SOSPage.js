import React, { useState } from 'react';
import './SOSPage.css';

const SOSPage = () => {
  const [showPanel, setShowPanel] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const emergencyContacts = [
    { name: 'Police', number: '100' },
    { name: 'Ambulance', number: '102' },
    { name: 'Fire Department', number: '101' },
    { name: 'Women Helpline', number: '1091' },
    { name: 'Disaster Helpline', number: '108' },
    { name: 'Child Helpline', number: '1098' },
    { name: 'Senior Citizen', number: '14567' },
    { name: 'Traffic Police', number: '103' },
    { name: 'Railway Enquiry', number: '139' },
    { name: 'Blood Bank', number: '1910' },
    { name: 'Cyber Crime', number: '1930' },
    { name: 'Missing Children', number: '1094' }
  ];

  const handleSOS = async () => {
    setLoading(true);
    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoading(false);
          setShowPanel(true);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLoading(false);
          setShowPanel(true);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } catch (error) {
      setLoading(false);
      setShowPanel(true);
    }
  };

  const handleClosePanel = () => {
    setShowPanel(false);
  };

  const handleCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  const handleWhatsApp = (number, location) => {
    let message = 'Emergency SOS Alert!';
    if (location) {
      message += ` Location: https://maps.google.com/?q=${location.lat},${location.lng}`;
    }
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      <div className="sos-container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6 text-center">
              <h1 className="display-4 mb-4 text-white fw-bold">Emergency SOS</h1>
              <p className="lead text-white-50 mb-5">Press button for immediate help</p>
              <button
                className="btn btn-danger sos-btn shadow-lg"
                onClick={handleSOS}
              >
                <i className="fas fa-exclamation-triangle me-3"></i>
                SOS
              </button>
            </div>
          </div>
        </div>

      {showPanel && (
        <div className="sos-panel">
          <div className="panel-header">
            <button className="close-btn" onClick={handleClosePanel}>
              <i className="fas fa-times"></i>
            </button>
            <h2><i className="fas fa-phone me-2"></i>Emergency Contacts</h2>
            {currentLocation && (
              <div className="location-info">
                <i className="fas fa-map-marker-alt me-2"></i>
                Location Shared: {currentLocation.lat?.toFixed(6)}, {currentLocation.lng?.toFixed(6)}
              </div>
            )}
          </div>

          {loading ? (
            <div className="loading flex-grow-1 d-flex align-items-center justify-content-center">
              <div className="spinner"></div>
              <p className="mt-3 mb-0">Getting your location...</p>
            </div>
          ) : (
            <div className="contact-list">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="contact-item">
                  <div className="contact-header">
                    <i className="fas fa-user me-2"></i>{contact.name}
                  </div>
                  <div className="contact-number">{contact.number}</div>
                  <div className="action-buttons">
                    <button
                      className="btn btn-call"
                      onClick={() => handleCall(contact.number)}
                    >
                      <i className="fas fa-phone me-2"></i>Call
                    </button>
                    <button
                      className="btn btn-whatsapp"
                      onClick={() => handleWhatsApp(contact.number, currentLocation)}
                    >
                      <i className="fab fa-whatsapp me-2"></i>WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SOSPage;

