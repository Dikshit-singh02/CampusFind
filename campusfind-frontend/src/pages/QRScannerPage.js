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
      
      const response = await getItemByQRCode(qrCode);
      setItem(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Item not found with this QR code');
      console.error('Error fetching item:', err);
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
        return 'bg-success';
      case 'Claimed':
        return 'bg-warning';
      case 'Returned':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  };

  // Get item type badge
  const getItemTypeBadge = (type) => {
    return type === 'lost' ? 'bg-danger' : 'bg-primary';
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">QR Scanner - Lost & Found</h2>
      
      {/* Manual QR Code Input */}
      <div className="row mb-4">
        <div className="col-md-8 offset-md-2">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Enter QR Code</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleManualSearch} className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter QR code (e.g., LOST-xxx or FOUND-xxx)"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  ref={inputRef}
                />
                <button type="submit" className="btn btn-primary">
                  Search
                </button>
              </form>
              <small className="text-muted mt-2 d-block">
                Tip: Enter the QR code manually or use a QR scanner app
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Searching for item...</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}

      {/* Item Details Card */}
      {item && !loading && (
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="card shadow-lg">
              <div className="card-header d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-0">{item.title}</h4>
                  <small className="text-muted">QR: {item.qrCode}</small>
                </div>
                <div>
                  <span className={`badge ${getItemTypeBadge(item.itemType)} me-2`}>
                    {item.itemType === 'lost' ? 'Lost Item' : 'Found Item'}
                  </span>
                  <span className={`badge ${getStatusBadgeColor(item.status || item.claimStatus)}`}>
                    {item.status || item.claimStatus}
                  </span>
                </div>
              </div>
              
              <div className="card-body">
                {/* Item Image */}
                {item.image && (
                  <div className="text-center mb-3">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
                      className="img-fluid"
                    />
                  </div>
                )}
                
                {/* Item Description */}
                <div className="mb-3">
                  <h6>Description:</h6>
                  <p>{item.description}</p>
                </div>
                
                {/* Location */}
                <div className="mb-3">
                  <h6>Location:</h6>
                  <p>{item.location}</p>
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={handleViewOnMap}
                  >
                    📍 View on Map
                  </button>
                </div>
                
                {/* Contact Info */}
                {item.contactInfo && (
                  <div className="mb-3">
                    <h6>Contact Info:</h6>
                    <p>{item.contactInfo}</p>
                  </div>
                )}
                
                {/* Owner/Finder Info */}
                {item.userId && (
                  <div className="mb-3">
                    <h6>{item.itemType === 'lost' ? 'Owner:' : 'Finder:'}</h6>
                    <p>{item.userId.name || 'Unknown'} ({item.userId.email || 'No email'})</p>
                  </div>
                )}
                
                {/* Timestamps */}
                <div className="text-muted">
                  <small>
                    Reported: {new Date(item.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </small>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="card-footer">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-2">Update Status:</h6>
                    <div className="btn-group" role="group">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleStatusUpdate('Available')}
                        disabled={item.status === 'Available' || item.claimStatus === 'Available'}
                      >
                        Available
                      </button>
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleStatusUpdate('Claimed')}
                        disabled={item.status === 'Claimed' || item.claimStatus === 'Claimed'}
                      >
                        Claimed
                      </button>
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => handleStatusUpdate('Returned')}
                        disabled={item.status === 'Returned' || item.claimStatus === 'Returned'}
                      >
                        Returned
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-end">
                    <small className="text-muted">
                      Last Updated: {new Date(item.updatedAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!item && !loading && !error && (
        <div className="text-center my-5">
          <div className="card">
            <div className="card-body">
              <h5>No Item Selected</h5>
              <p className="text-muted">
                Enter a QR code above to view item details and manage claims.
              </p>
              <div className="mt-4">
                <span style={{ fontSize: '4rem' }}>📱</span>
                <span style={{ fontSize: '4rem' }}>🔍</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScannerPage;
