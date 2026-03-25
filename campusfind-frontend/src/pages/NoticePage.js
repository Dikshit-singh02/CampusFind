import React, { useState, useEffect } from 'react';
import { getNotifications } from '../services/api';
import './NoticePage.css';

const NoticePage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', 'Lost', 'Found', 'General', 'Academic', 'Event', 'Emergency'];

  // Fetch notices on mount and when search/filter changes
  useEffect(() => {
    fetchNotices();
  }, [search, category]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getNotifications('notification', category);
      setNotices(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notices');
      console.error('Error fetching notices:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Handle category filter change
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  // Get badge color based on status/category
  const getCategoryBadgeColor = (cat) => {
    switch (cat) {
      case 'Lost':
        return 'np-badge-danger';
      case 'Found':
        return 'np-badge-success';
      case 'Academic':
        return 'np-badge-primary';
      case 'Event':
        return 'np-badge-info';
      case 'Emergency':
        return 'np-badge-warning';
      default:
        return 'np-badge-secondary';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter notices by search
  const filteredNotices = notices.filter(notice => {
    const searchLower = search.toLowerCase();
    return (
      notice.title?.toLowerCase().includes(searchLower) ||
      notice.content?.toLowerCase().includes(searchLower) ||
      notice.itemDetails?.description?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="np-page-root">
      <div className="np-container">
        <h2 className="np-title mb-4">Notices & Notifications</h2>
        
        {/* Search and Filter Section */}
        <div className="row mb-4 np-search-section">
          <div className="col-md-6">
            <input
              type="text"
              className="np-form-control"
              placeholder="Search notices..."
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          <div className="col-md-4">
            <select
              className="np-form-select"
              value={category}
              onChange={handleCategoryChange}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <button
              className="np-btn-clear"
              onClick={() => {
                setSearch('');
                setCategory('All');
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center my-5">
            <div className="spinner-border np-spinner" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* Notices Display */}
        {!loading && !error && (
          <div className="row">
            {filteredNotices.length === 0 ? (
              <div className="col-12">
                <div className="np-no-notices" role="alert">
                  No notices found.
                </div>
              </div>
            ) : (
              filteredNotices.map((notice) => (
                <div className="col-md-12 mb-3" key={notice._id}>
                  <div className="np-card-glass">
                    <div className="np-card-header">
                      <div>
                        <h5 className="mb-0">{notice.title}</h5>
                      </div>
                      <span className={`badge ${getCategoryBadgeColor(notice.status)}`}>
                        {notice.status}
                      </span>
                    </div>
                    <div className="np-card-body">
                      <p className="np-card-text">{notice.content}</p>
                      
                      {/* Item Details Section for Lost/Found notifications */}
                      {notice.itemDetails && (notice.status === 'Lost' || notice.status === 'Found') && (
                        <div className="np-item-details">
                          <h6>Item Details:</h6>
                          {notice.itemDetails.description && (
                            <p className="mb-1"><strong>Description:</strong> {notice.itemDetails.description}</p>
                          )}
                          {notice.itemDetails.location && (
                            <p className="mb-1"><strong>Location:</strong> {notice.itemDetails.location}</p>
                          )}
                          {notice.itemDetails.contactInfo && (
                            <p className="mb-1"><strong>Contact:</strong> {notice.itemDetails.contactInfo}</p>
                          )}
                          {notice.itemDetails.image && (
                            <div className="mt-2">
                              <img 
                                src={notice.itemDetails.image} 
                                alt="Item" 
                                className="np-item-img"
                                style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '5px' }}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="np-card-footer">
                      <small>
                        Posted: {formatDate(notice.createdAt)}
                      </small>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticePage;
