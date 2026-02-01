import React from 'react';

const QRScannerPage = () => {
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">QR Scanner</h2>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body text-center">
              <p>QR Scanner functionality will be implemented here.</p>
              <button className="btn btn-primary">Scan QR Code</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScannerPage;
