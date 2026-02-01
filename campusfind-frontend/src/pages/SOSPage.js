import React from 'react';

const SOSPage = () => {
  const handleSOS = () => {
    alert('SOS Alert Sent!');
    // Handle SOS logic here
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <h2 className="mb-4">Emergency SOS</h2>
          <button
            className="btn btn-danger btn-lg"
            style={{ fontSize: '2rem', padding: '20px 40px' }}
            onClick={handleSOS}
          >
            SOS
          </button>
          <p className="mt-3">Press the button in case of emergency</p>
        </div>
      </div>
    </div>
  );
};

export default SOSPage;
