import React, { useState, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './MapPage.css';

const MapPage = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapRef = useRef(null);

  const center = {
    lat: 30.7457,
    lng: 76.8035,
  };

  const buildings = [
    { name: 'CSE Block', position: { lat: 30.7465, lng: 76.8040 }, type: 'building-cse' },
    { name: 'Hostel A', position: { lat: 30.7450, lng: 76.8030 }, type: 'hostel' },
    { name: 'Library', position: { lat: 30.7460, lng: 76.8025 }, type: 'library' },
    { name: 'Admin Block', position: { lat: 30.7455, lng: 76.8045 }, type: 'admin' },
    { name: 'Sports Complex', position: { lat: 30.7470, lng: 76.8038 }, type: 'sports' },
    { name: 'Main Gate', position: { lat: 30.7445, lng: 76.8020 }, type: 'admin' },
  ];

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const mapContainerStyle = {
    height: isFullscreen ? '100%' : '600px',
    width: '100%',
  };

  return (
    <div className="map-page-root">
      <div className="map-container">
        <div className="map-hero">
          <h1>Interactive Campus Map</h1>
          <p>Navigate Chandigarh University campus with building markers and fullscreen view</p>
        </div>
        
        <div className={`map-card ${isFullscreen ? 'fullscreen' : ''}`}>
          <div className="map-card-header">
            <h3 className="map-card-title">Chandigarh University Campus</h3>
            <div className="map-controls">
              <button className="fullscreen-btn" onClick={toggleFullscreen}>
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </button>
            </div>
          </div>
          
          <div className={`map-wrapper ${isFullscreen ? 'fullscreen' : ''}`}>
            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                ref={mapRef}
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={16}
              >
                {buildings.map((building, index) => (
                  <Marker
                    key={index}
                    position={building.position}
                    title={building.name}
                  />
                ))}
              </GoogleMap>
            </LoadScript>
          </div>

          {!isFullscreen && (
            <div className="legend-section">
              {buildings.map((building, index) => (
                <div key={index} className="legend-item">
                  <div className={`legend-icon ${building.type}`}>{building.name.charAt(0)}</div>
                  <span>{building.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapPage;
