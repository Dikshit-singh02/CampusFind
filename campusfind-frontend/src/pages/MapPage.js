import React from 'react';

const MapPage = () => {
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Campus Map</h2>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <p>Interactive campus map will be displayed here.</p>
              <div style={{ height: '400px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span>Map Placeholder</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
