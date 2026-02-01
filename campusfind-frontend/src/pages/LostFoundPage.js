import React from 'react';

const LostFoundPage = () => {
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Lost & Found</h2>
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Report Lost Item</h5>
            </div>
            <div className="card-body">
              <p>Form to report lost items will be here.</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Found Items</h5>
            </div>
            <div className="card-body">
              <p>List of found items will be displayed here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LostFoundPage;
