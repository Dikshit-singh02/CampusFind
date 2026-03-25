import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getItemByQRCode, updateItemStatus } from '../services/api';

const QRScannerPage = () => {
  const [scannedCode, setScannedCode] = useState('');
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [manualCode, setManualCode] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Handle manual QR code entry
  const handleManualSearch = async (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    
    setScannedCode(manualCode);
    await fetchItemDetails(manualCode);
  };

  // Fetch item details by QR code
const fetchItemDetails = async (qrCode) => {
    if (!qrCode.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      setItem(null);
      
      // Mock data for demo (no backend needed)
      const mockItems = {
        'LOST-001': {
          _id: '1',
          title: 'Blue Laptop Charger',
          description: 'Dell charger found near library',
          image: 'https://via.placeholder.com/400x300?text=Charger',
          location: 'Library Entrance',
          contactInfo: 'Contact finder at john@example.com',
          qrCode: 'LOST-001',
          itemType: 'found',
          status: 'Available',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date().toISOString(),
          userId: { name: 'John Doe', email: 'john@example.com' }
        },
        'FOUND-ABC': {
          _id: '2',
          title: 'Black Backpack',
          description: 'Black backpack with laptop compartment',
          image: 'https://via.placeholder.com/400x300?text=Backpack',
          location: 'Canteen',
          qrCode: 'FOUND-ABC',
          itemType: 'lost',
          claimStatus: 'Claimed',
          userId: { name: 'Jane Smith', email: 'jane@example.com' }
        }
      };
      
      const mockItem = mockItems[qrCode];
      if (mockItem) {
        setItem({ ...mockItem, itemType: mockItem.itemType });
      } else {
        setError('Mock item not found. Try LOST-001 or FOUND-ABC');
      }
    } catch (err) {
      setError('Demo error');
    } finally {
      setLoading(false);
    }
  };

  // Update item status
  const handleStatusUpdate = async (newStatus) => {
    if (!item) return;
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await updateItemStatus(item._id, { 
        status: newStatus,
        claimedBy: null // In a real app, this would be the current user's ID
      });
      
      setSuccess(`Item status updated to ${newStatus}`);
      
      // Refresh item details
      await fetchItemDetails(scannedCode);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
      console.error('Error updating status:', err);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to map with location
  const handleViewOnMap = () => {
    if (item && item.location) {
      // Pass location to MapPage via state or URL params
      navigate('/map', { state: { location: item.location } });
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Available':
        return 'badge-success';
      case 'Claimed':
        return 'badge-warning';
      case 'Returned':
        return 'badge-info';
      default:
        return 'badge-secondary';
    }
  };

  // Get item type badge
  const getItemTypeBadge = (type) => {
    return type === 'lost' ? 'badge-danger' : 'badge-primary';
  };

  return (
    <div className="container mt-5 p-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="text-center mb-5">
            <h1 className="display-5 fw-bold mb-3 text-primary">QR Scanner</h1>
            <p className="lead text-muted mb-0">Scan or enter QR code to manage lost & found items</p>
          </div>

          {/* QR Code Input */}
          <div className="card shadow-lg border-0 mb-5">
            <div className="card-header bg-primary text-white py-4">
              <h4 className="mb-0 fw-semibold">🔍 Search by QR Code</h4>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleManualSearch} className="row g-3">
                <div className="col-md-9">
                  <div className="input-group input-group-lg">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="fas fa-qrcode text-primary"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 fs-6 py-3"
                      placeholder="Enter QR code (e.g., LOST-001 or FOUND-ABC)"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      ref={inputRef}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <button type="submit" className="btn btn-primary btn-lg w-100 py-3" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Searching...
                      </>
                    ) : 'Search'}
                  </button>
                </div>
              </form>
              <div className="text-center mt-3">
                <small className="text-muted">
                  💡 Or use your phone's QR scanner app and enter the code above
                </small>
              </div>
            </div>
          </div>

          <div className="qr-main-content">
            {/* Messages */}
            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
                <button type="button" className="btn-close" onClick={() => setError(null)}></button>
              </div>
            )}

            {success && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                <i className="fas fa-check-circle me-2"></i>
                {success}
                <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
              </div>
            )}

            {/* Item Details */}
            {item && !loading && (
              <div className="card shadow-xl border-0">
                <div className="card-header bg-gradient-primary text-white py-4 px-4">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <h3 className="mb-1 fw-bold">{item.title}</h3>
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <code className="bg-dark text-white px-2 py-1 rounded small">
                          QR: {item.qrCode}
                        </code>
                        <span className={`badge fs-6 px-3 py-2 ${getItemTypeBadge(item.itemType)}`}>
                          {item.itemType === 'lost' ? 'LOST ITEM' : 'FOUND ITEM'}
                        </span>
                        <span className={`badge fs-6 px-3 py-2 ${getStatusBadgeColor(item.status || item.claimStatus)}`}>
                          {item.status || item.claimStatus}
                        </span>
                      </div>
                    </div>
                    <div className="col-md-4 text-md-end mt-2 mt-md-0">
                      <small className="opacity-75">Scanned: {new Date().toLocaleTimeString()}</small>
                    </div>
                  </div>
                </div>

                <div className="card-body p-4 p-md-5">
                  {/* Item Image */}
                  {item.image && (
                    <div className="text-center mb-4">
                      <div className="item-image-container position-relative">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="img-fluid rounded-3 shadow-lg" 
                          style={{ maxHeight: '320px', objectFit: 'cover' }}
                        />
                        <div className="position-absolute top-0 start-0 bg-primary text-white px-2 py-1 rounded-bottom-3 small fw-bold">
                          Photo
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="row g-4">
                    {/* Main Details */}
                    <div className="col-lg-8">
                      <div className="detail-section mb-4 p-4 bg-light rounded-3 shadow-sm">
                        <h5 className="fw-bold mb-3 text-dark">
                          <i className="fas fa-info-circle me-2 text-primary"></i>
                          Item Details
                        </h5>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-muted small mb-1">Description</label>
                            <p className="fs-5 mb-0 lh-lg">{item.description}</p>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-muted small mb-1">Location</label>
                            <div className="d-flex align-items-center">
                              <p className="fs-5 mb-0 me-3 lh-1">{item.location}</p>
                              <button 
                                className="btn btn-outline-primary btn-sm px-3 py-1"
                                onClick={handleViewOnMap}
                              >
                                <i className="fas fa-map-marker-alt me-1"></i>
                                View Map
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {item.contactInfo && (
                        <div className="detail-section mb-4 p-4 bg-light rounded-3 shadow-sm">
                          <h5 className="fw-bold mb-3 text-dark">
                            <i className="fas fa-phone me-2 text-success"></i>
                            Contact Information
                          </h5>
                          <p className="fs-5 mb-1 lh-lg">{item.contactInfo}</p>
                        </div>
                      )}
                    </div>

                    {/* Sidebar Info */}
                    <div className="col-lg-4">
                      {item.userId && (
                        <div className="detail-section mb-4 p-4 bg-light rounded-3 shadow-sm">
                          <h6 className="fw-bold mb-3 text-dark border-bottom pb-2">
                            👤 {item.itemType === 'lost' ? 'Owner' : 'Finder'}
                          </h6>
                          <p className="mb-1"><strong>Name:</strong> {item.userId.name || 'N/A'}</p>
                          <p className="mb-0"><strong>Email:</strong> {item.userId.email || 'N/A'}</p>
                        </div>
                      )}

                      <div className="detail-section p-4 bg-light rounded-3 shadow-sm">
                        <h6 className="fw-bold mb-3 text-dark border-bottom pb-2">
                          📅 Timeline
                        </h6>
                        <div className="small text-muted">
                          <div className="d-flex justify-content-between mb-1">
                            <span>Reported</span>
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Last Updated</span>
                            <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Update Section */}
                <div className="card-footer bg-gradient-secondary p-4">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <h5 className="text-white mb-3 fw-semibold">⚙️ Update Status</h5>
                      <div className="row g-2">
                        <div className="col">
                          <button
                            className="btn btn-success w-100 py-3 fs-6 fw-semibold"
                            onClick={() => handleStatusUpdate('Available')}
                            disabled={loading || (item.status === 'Available' || item.claimStatus === 'Available')}
                          >
                            ✅ Available
                          </button>
                        </div>
                        <div className="col">
                          <button
                            className="btn btn-warning w-100 py-3 fs-6 fw-semibold"
                            onClick={() => handleStatusUpdate('Claimed')}
                            disabled={loading || (item.status === 'Claimed' || item.claimStatus === 'Claimed')}
                          >
                            👤 Claimed
                          </button>
                        </div>
                        <div className="col">
                          <button
                            className="btn btn-info w-100 py-3 fs-6 fw-semibold"
                            onClick={() => handleStatusUpdate('Returned')}
                            disabled={loading || (item.status === 'Returned' || item.claimStatus === 'Returned')}
                          >
                            📦 Returned
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 text-md-end mt-3 mt-md-0">
                      <div className="text-white-50">
                        <small className="d-block mb-1 opacity-75">
                          Status changes saved instantly
                        </small>
                        <small>Scanned: {new Date().toLocaleString()}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!item && !loading && !error && (
              <div className="row justify-content-center mt-5">
                <div className="col-md-8 text-center">
                  <div className="card border-0 shadow-lg p-5 bg-light rounded-4">
                    <div className="display-1 mb-4 text-primary opacity-75">📱</div>
                    <h3 className="fw-normal mb-3 text-dark">Ready to Scan</h3>
                    <p className="lead text-muted mb-4">
                      Enter QR code from lost or found item to view details and update status.
                    </p>
                    <div className="row g-3 justify-content-center">
                      <div className="col-auto">
                        <div className="p-3 bg-white rounded-3 shadow-sm">
                          <i className="fas fa-qrcode fa-2x text-primary mb-2"></i>
                          <div className="small fw-semibold text-dark">QR Code</div>
                        </div>
                      </div>
                      <div className="col-auto">
                        <div className="p-3 bg-white rounded-3 shadow-sm">
                          <i className="fas fa-search fa-2x text-success mb-2"></i>
                          <div className="small fw-semibold text-dark">Search</div>
                        </div>
                      </div>
                      <div className="col-auto">
                        <div className="p-3 bg-white rounded-3 shadow-sm">
                          <i className="fas fa-edit fa-2x text-info mb-2"></i>
                          <div className="small fw-semibold text-dark">Update</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScannerPage;
