import React from 'react';

const NoticePage = () => {
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Notices</h2>
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h5>Recent Notices</h5>
            </div>
            <div className="card-body">
              <p>Notices and announcements will be displayed here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticePage;
