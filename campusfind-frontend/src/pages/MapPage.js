import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapPage = () => {
  const mapContainerStyle = {
    height: '400px',
    width: '100%',
  };

  const center = {
    lat: 30.7457,
    lng: 76.8035,
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Chandigarh University Map</h2>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={15}
                >
                  <Marker position={center} />
                </GoogleMap>
              </LoadScript>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
