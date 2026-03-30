import React, { useState, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import './MapPage.css';

const MapPage = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredBuildings = buildings.filter(building =>
    building.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
              <input
                type="text"
                placeholder="Search buildings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '12px 16px',
                  border: '1px solid var(--border-light)',
                  borderRadius: '12px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  background: 'var(--glass-bg)',
                  minWidth: '250px'
                }}
              />
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
                mapTypeId="satellite"
                options={{
                  styles: [
                    {
                      featureType: "poi",
                      elementType: "labels",
                      stylers: [{ visibility: "off" }]
                    }
                  ],
                  fullscreenControl: false,
                  streetViewControl: false
                }}
              >
                {filteredBuildings.map((building, index) => (
                  <Marker
                    key={index}
                    position={building.position}
                    title={building.name}
                    onClick={() => setSelectedBuilding(building)}
                  />
                ))}
                {selectedBuilding && (
                  <InfoWindow
                    position={selectedBuilding.position}
                    onCloseClick={() => setSelectedBuilding(null)}
                  >
                    <div style={{ fontFamily: 'Inter, sans-serif', padding: '10px' }}>
                      <h4 style={{ margin: '0 0 5px 0', color: 'var(--text-primary)' }}>{selectedBuilding.name}</h4>
                      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Building Type: {selectedBuilding.type.replace('-', ' ').toUpperCase()}</p>
                    </div>
                  </InfoWindow>
                )}
                {filteredBuildings.map((building, index) => (
                  <Marker
                    key={index}
                    position={building.position}
                    title={building.name}
                    onClick={() => setSelectedBuilding(building)}
                  />
                ))}
                {selectedBuilding && (
                  <InfoWindow
                    position={selectedBuilding.position}
                    onCloseClick={() => setSelectedBuilding(null)}
                  >
                    <div style={{ fontFamily: 'Inter, sans-serif', padding: '10px' }}>
                      <h4 style={{ margin: '0 0 5px 0', color: 'var(--text-primary)' }}>{selectedBuilding.name}</h4>
                      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Building Type: {selectedBuilding.type.replace('-', ' ').toUpperCase()}</p>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
          </div>

          {!isFullscreen && (
            <div className="legend-section">
              {filteredBuildings.map((building, index) => (
                <div key={index} className="legend-item">
                  <div className={`legend-icon ${building.type}`}>{building.name.charAt(0)}</div>
                  <span>{building.name}</span>
                </div>
              ))}
              {searchQuery && filteredBuildings.length === 0 && (
                <p style={{ gridColumn: '1', textAlign: 'center', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  No buildings found matching "{searchQuery}"
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapPage;
