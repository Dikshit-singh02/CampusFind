import React, { useState, useEffect } from 'react';
import { getNotifications } from '../services/api';

const NoticePage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', 'General', 'Academic', 'Event', 'Emergency', 'Lost', 'Found'];

  useEffect(() => {
    fetchNotices();
  }, [search, category]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError(null);
      // Get all notices without type filter, only filter by status if not 'All'
      const statusFilter = category === 'All' ? null : category;
      const response = await getNotifications(null, statusFilter);
      let filteredNotices = response.data;
      if (search) {
        filteredNotices = filteredNotices.filter(notice =>
          notice.title.toLowerCase().includes(search.toLowerCase()) ||
          notice.content.toLowerCase().includes(search.toLowerCase())
        );
      }
      setNotices(filteredNotices);
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

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Lost':
        return 'bg-danger';
      case 'Found':
        return 'bg-success';
      case 'Academic':
        return 'bg-primary';
      case 'Event':
        return 'bg-info';
      case 'Emergency':
        return 'bg-warning';
      default:
        return 'bg-secondary';
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

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Notices & Notifications</h2>
      
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search notices..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
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
            className="btn btn-secondary w-100"
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
          <div className="spinner-border" role="status">
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
          {notices.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-info" role="alert">
                No notices found.
              </div>
            </div>
          ) : (
            notices.map((notice) => (
              <div className="col-md-12 mb-3" key={notice._id}>
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="mb-0">{notice.title}</h5>
                    </div>
                    <span className={`badge ${getStatusBadgeColor(notice.status)}`}>
                      {notice.status}
                    </span>
                  </div>
                  <div className="card-body">
                    <p className="card-text">{notice.content}</p>
                    {notice.itemDetails && (
                      <div className="mt-2">
                        {notice.itemDetails.location && (
                          <p className="mb-1"><strong>Location:</strong> {notice.itemDetails.location}</p>
                        )}
                        {notice.itemDetails.image && (
                          <img 
                            src={notice.itemDetails.image} 
                            alt="Item" 
                            style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px' }}
                            className="mt-2"
                          />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="card-footer text-muted">
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
  );
};

export default NoticePage;
