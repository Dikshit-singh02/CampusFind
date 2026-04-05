import React, { useState, useEffect } from 'react';
import { getNotices } from '../services/api';
import './NoticePage-dark-corporate.css';

const NoticePage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [readNotices, setReadNotices] = useState(new Set());

  const categories = ['All', 'Lost', 'Found', 'General', 'Academic', 'Event', 'Emergency'];

  useEffect(() => {
    fetchNotices();
  }, [search, category]);

  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice);
    if (!readNotices.has(notice._id)) {
      const newRead = new Set(readNotices);
      newRead.add(notice._id);
      setReadNotices(newRead);
    }
  };

  const closeModal = () => {
    setSelectedNotice(null);
  };

  const copyContact = (contact) => {
    navigator.clipboard.writeText(contact);
  };

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getNotices(category);
      setNotices(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notices');
      console.error('Error fetching notices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

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

  const filteredNotices = notices.filter(notice => {
    const searchLower = search.toLowerCase();
    return (
      notice.title?.toLowerCase().includes(searchLower) ||
      notice.content?.toLowerCase().includes(searchLower) ||
      (notice.itemDetails?.description?.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="np-page-root">
      <div className="np-container">
        <h2 className="np-title mb-4">Notices & Notifications</h2>
        
        <div className="np-content-wrapper">
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

          {loading && (
            <div className="text-center my-5">
              <div className="spinner-border np-spinner" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

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
                    <div 
                      className={`np-card-glass np-card-clickable ${readNotices.has(notice._id) ? 'np-read' : ''}`}
                      onClick={() => handleNoticeClick(notice)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handleNoticeClick(notice)}
                    >
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

          {selectedNotice && (
            <div className="np-modal-overlay" onClick={closeModal}>
              <div className="np-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="np-modal-header">
                  <h3>{selectedNotice.title}</h3>
                  <button className="np-modal-close" onClick={closeModal}>&times;</button>
                </div>
                <div className="np-modal-body">
                  <p>{selectedNotice.content}</p>
                  <span className={`badge ${getCategoryBadgeColor(selectedNotice.status)}`}>
                    {selectedNotice.status}
                  </span>
                  <div>Posted: {formatDate(selectedNotice.createdAt)}</div>
                  
                  {selectedNotice.itemDetails && (
                    <div className="np-item-details mt-3">
                      <h6>Item Details:</h6>
                      {selectedNotice.itemDetails.description && (
                        <p><strong>Description:</strong> {selectedNotice.itemDetails.description}</p>
                      )}
                      {selectedNotice.itemDetails.location && (
                        <p><strong>Location:</strong> {selectedNotice.itemDetails.location}</p>
                      )}
                      {selectedNotice.itemDetails.contactInfo && (
                        <div>
                          <strong>Contact:</strong> 
                          <button className="btn btn-sm btn-outline-primary ms-2" onClick={() => copyContact(selectedNotice.itemDetails.contactInfo)}>
                            📋 Copy
                          </button>
                          <span className="contact-text">{selectedNotice.itemDetails.contactInfo}</span>
                        </div>
                      )}
                      {selectedNotice.itemDetails.image && (
                        <div className="text-center">
                          <img 
                            src={selectedNotice.itemDetails.image} 
                            alt="Item" 
                            className="np-item-img-modal" 
                            style={{cursor: 'pointer'}}
                            onClick={() => window.open(selectedNotice.itemDetails.image, '_blank')}
                          />
                          <small className="text-muted d-block mt-1">Click to view full size</small>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="np-modal-footer">
                  <button className="np-btn-secondary" onClick={closeModal}>Close</button>
                  {selectedNotice.itemDetails && selectedNotice.itemDetails.contactInfo && (
                    <a href={`mailto:${selectedNotice.itemDetails.contactInfo}`} className="np-btn-primary">Contact Poster</a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoticePage;
