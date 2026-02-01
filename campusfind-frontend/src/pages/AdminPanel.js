import React from 'react';

const AdminPanel = () => {
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Admin Panel</h2>
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Manage Users</h5>
            </div>
            <div className="card-body">
              <p>Tools to manage user accounts will be here.</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>System Settings</h5>
            </div>
            <div className="card-body">
              <p>System configuration options will be here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
