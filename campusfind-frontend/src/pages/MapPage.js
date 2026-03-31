import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapPage.css';
import ChangeMapView from './ChangeMapView';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const MapPage = () => {
  const [position, setPosition] = useState([30.7457, 76.8035]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fullscreen, setFullscreen] = useState(false);
  const [activeBuilding, setActiveBuilding] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const buildings = [
    { name: 'CSE Block', position: [30.7465, 76.8040], type: 'building-cse' },
    { name: 'Hostel A', position: [30.7450, 76.8030], type: 'hostel' },
    { name: 'Library', position: [30.7460, 76.8025], type: 'library' },
    { name: 'Admin Block', position: [30.7455, 76.8045], type: 'admin' },
    { name: 'Sports Complex', position: [30.7470, 76.8038], type: 'sports' },
    { name: 'Main Gate', position: [30.7445, 76.8020], type: 'admin' },
  ];

  const filteredBuildings = buildings.filter(building =>
    building.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchNominatim = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ' Chandigarh University')}&limit=5&addressdetails=1&viewbox=76.78,30.73,76.81,30.75&bounded=1`
      );
      const data = await response.json();
      setSearchResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  };

  const debouncedSearch = (query) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => fetchNominatim(query), 300);
    setSearchTimeout(timeout);
  };

  const handleSearchResultClick = (result) => {
    const [lat, lon] = [parseFloat(result.lat), parseFloat(result.lon)];
    setSelectedLocation([lat, lon]);
    setSearchQuery(result.display_name.split(',')[0]);
    setShowResults(false);
  };

  const getCurrentLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPos = [latitude, longitude];
        setSelectedLocation(newPos);
        setActiveBuilding(null);
        setLoading(false);
      },
      (error) => {
        console.error("Location error:", error);
        alert('Failed to get location');
        setLoading(false);
      }
    );
  };

  const handleCardClick = (building) => {
    setActiveBuilding(building);
    setSelectedLocation(building.position);
  };

  const mapClassName = fullscreen ? 'map-wrapper fullscreen' : 'map-wrapper';

  return (
    <div className="map-page-root">
      <div className="map-container">
        <div className="map-hero">
          <h1>Interactive Campus Map</h1>
          <p>Navigate Chandigarh University campus - Leaflet edition</p>
        </div>
        
        <div className="map-card">
          <div className="map-card-header">
            <h3 className="map-card-title">Chandigarh University Campus</h3>
            <div className="map-controls">
              <input
                type="text"
                placeholder="Search places in CU..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  debouncedSearch(e.target.value);
                }}
                className="search-input"
              />
              {showResults && searchResults.length > 0 && (
                <div className="search-dropdown">
                  {searchResults.map((result, index) => (
                    <div key={index} className="search-result-item" onClick={() => handleSearchResultClick(result)}>
                      <strong>{result.display_name.split(',')[0]}</strong>
                      <br />
                      <small>{result.display_name}</small>
                    </div>
                  ))}
                </div>
              )}
              <button className="map-btn primary" onClick={getCurrentLocation} disabled={loading}>
                {loading ? 'Loading...' : 'My Location'}
              </button>
              <button className="fullscreen-btn" onClick={() => setFullscreen(!fullscreen)}>
                {fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </button>
            </div>
          </div>
          
          <div className={mapClassName}>
            <MapContainer 
              center={position} 
              zoom={16} 
              style={{ height: '100%', width: '100%' }}
              className={fullscreen ? 'fullscreen-map' : ''}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ChangeMapView center={selectedLocation} />
              
              {buildings.map((building, index) => (
                <Marker key={index} position={building.position}>
                  <Popup>
                    <div>
                      <h4>{building.name}</h4>
                      <p>Type: {building.type.replace('-', ' ').toUpperCase()}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
              
              {selectedLocation && !activeBuilding && (
                <Marker position={selectedLocation} icon={L.divIcon({
                  className: 'user-location-icon',
                  html: '<div style="background: #4ecdc4; width: 35px; height: 35px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">You</div>',
                  iconSize: [35, 35],
                })}>
                  <Popup>Your Location</Popup>
                </Marker>
              )}
            </MapContainer>
            {loading && (
              <div className="loading-overlay">
                <div className="spinner"></div>
              </div>
            )}
          </div>

          <div className="legend-section">
            {filteredBuildings.map((building, index) => (
              <div 
                key={index}
                className={`legend-item ${activeBuilding?.name === building.name ? 'active' : ''}`}
                onClick={() => handleCardClick(building)}
              >
                <div className={`legend-icon ${building.type}`}>{building.name.charAt(0)}</div>
                <span>{building.name}</span>
              </div>
            ))}
            {searchQuery && filteredBuildings.length === 0 && (
              <p className="no-results">No buildings found matching "{searchQuery}"</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;

