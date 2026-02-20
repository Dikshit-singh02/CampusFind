import React, { useState, useEffect } from 'react';
import { getLostItems, createLostItem, getFoundItems, createFoundItem } from '../services/api';

const LostFoundPage = () => {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [lostFormData, setLostFormData] = useState({
    title: '',
    description: '',
    image: '',
    location: '',
    contactInfo: ''
  });
  const [foundFormData, setFoundFormData] = useState({
    title: '',
    description: '',
    image: '',
    location: '',
    contactInfo: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const [lostResponse, foundResponse] = await Promise.all([
        getLostItems(),
        getFoundItems()
      ]);
      setLostItems(lostResponse.data);
      setFoundItems(foundResponse.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Failed to load items: ' + err.message);
      setLoading(false);
    }
  };

  const handleLostChange = (e) => {
    setLostFormData({
      ...lostFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleFoundChange = (e) => {
    setFoundFormData({
      ...foundFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e, setFormData, formData) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLostSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    console.log('=== Submitting Lost Item ===');
    console.log('Form data:', lostFormData);
    
    try {
      const response = await createLostItem(lostFormData);
      console.log('Success! Response:', response);
      setSuccessMessage('Lost item reported successfully!');
      setLostFormData({ title: '', description: '', image: '', location: '', contactInfo: '' });
      fetchItems();
    } catch (err) {
      console.error('Error creating lost item:', err);
      console.error('Error details:', err.response?.data || err.message);
      setError('Failed to report lost item: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleFoundSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    console.log('=== Submitting Found Item ===');
    console.log('Form data:', foundFormData);
    
    try {
      const response = await createFoundItem(foundFormData);
      console.log('Success! Response:', response);
      setSuccessMessage('Found item reported successfully!');
      setFoundFormData({ title: '', description: '', image: '', location: '', contactInfo: '' });
      fetchItems();
    } catch (err) {
      console.error('Error creating found item:', err);
      console.error('Error details:', err.response?.data || err.message);
      setError('Failed to report found item: ' + (err.response?.data?.message || err.message));
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

  // Copy QR code to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('QR Code copied to clipboard!');
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Lost & Found</h2>
      
      {error && (
        <div className="alert alert-danger alert-dismissible">
          {error}
          <button type="button" className="close" onClick={() => setError('')}>
            <span>&times;</span>
          </button>
        </div>
      )}
      
      {successMessage && (
        <div className="alert alert-success alert-dismissible">
          {successMessage}
          <button type="button" className="close" onClick={() => setSuccessMessage('')}>
            <span>&times;</span>
          </button>
        </div>
      )}
      
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {/* Report Lost Item Form */}
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Report Lost Item</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleLostSubmit}>
                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={lostFormData.title}
                      onChange={handleLostChange}
                      required
                      placeholder="What did you lose?"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description *</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={lostFormData.description}
                      onChange={handleLostChange}
                      required
                      placeholder="Describe the item in detail"
                      rows="3"
                    />
                  </div>
                  <div className="form-group">
                    <label>Location *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      value={lostFormData.location}
                      onChange={handleLostChange}
                      required
                      placeholder="Where did you lose it?"
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact Info</label>
                    <input
                      type="text"
                      className="form-control"
                      name="contactInfo"
                      value={lostFormData.contactInfo}
                      onChange={handleLostChange}
                      placeholder="Phone number or email"
                    />
                  </div>
                  <div className="form-group">
                    <label>Image (optional)</label>
                    <input
                      type="file"
                      className="form-control"
                      name="image"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, setLostFormData, lostFormData)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">
                    Report Lost Item
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Report Found Item Form */}
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">Report Found Item</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleFoundSubmit}>
                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={foundFormData.title}
                      onChange={handleFoundChange}
                      required
                      placeholder="What did you find?"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description *</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={foundFormData.description}
                      onChange={handleFoundChange}
                      required
                      placeholder="Describe the item in detail"
                      rows="3"
                    />
                  </div>
                  <div className="form-group">
                    <label>Location *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      value={foundFormData.location}
                      onChange={handleFoundChange}
                      required
                      placeholder="Where did you find it?"
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact Info</label>
                    <input
                      type="text"
                      className="form-control"
                      name="contactInfo"
                      value={foundFormData.contactInfo}
                      onChange={handleFoundChange}
                      placeholder="Phone number or email"
                    />
                  </div>
                  <div className="form-group">
                    <label>Image (optional)</label>
                    <input
                      type="file"
                      className="form-control"
                      name="image"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, setFoundFormData, foundFormData)}
                    />
                  </div>
                  <button type="submit" className="btn btn-success btn-block">
                    Report Found Item
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lost Items List */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-danger text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Lost Items ({lostItems.length})</h5>
            </div>
            <div className="card-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {lostItems.length === 0 ? (
                <p className="text-muted text-center">No lost items reported yet.</p>
              ) : (
                <ul className="list-group">
                  {lostItems.map((item) => (
                    <li key={item._id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="mb-1">{item.title}</h6>
                          <span className={`badge ${getStatusBadgeColor(item.status)}`}>
                            {item.status || 'Available'}
                          </span>
                        </div>
                        {item.qrCode && (
                          <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => copyToClipboard(item.qrCode)}
                            title="Copy QR Code"
                          >
                            📋 QR
                          </button>
                        )}
                      </div>
                      <p className="mb-1">{item.description}</p>
                      <small className="text-muted">
                        <strong>Location:</strong> {item.location}<br />
                        {item.contactInfo && (
                          <span><strong>Contact:</strong> {item.contactInfo}<br /></span>
                        )}
                        {item.qrCode && (
                          <span><strong>QR Code:</strong> {item.qrCode}<br /></span>
                        )}
                        {item.createdAt && (
                          <span>Reported on: {new Date(item.createdAt).toLocaleDateString()}</span>
                        )}
                      </small>
                      {item.image && (
                        <div className="mt-2">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '5px' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Found Items List */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Found Items ({foundItems.length})</h5>
            </div>
            <div className="card-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {foundItems.length === 0 ? (
                <p className="text-muted text-center">No found items reported yet.</p>
              ) : (
                <ul className="list-group">
                  {foundItems.map((item) => (
                    <li key={item._id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="mb-1">{item.title}</h6>
                          <span className={`badge ${getStatusBadgeColor(item.claimStatus || item.status)}`}>
                            {item.claimStatus || item.status || 'Available'}
                          </span>
                        </div>
                        {item.qrCode && (
                          <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => copyToClipboard(item.qrCode)}
                            title="Copy QR Code"
                          >
                            📋 QR
                          </button>
                        )}
                      </div>
                      <p className="mb-1">{item.description}</p>
                      <small className="text-muted">
                        <strong>Location:</strong> {item.location}<br />
                        {item.contactInfo && (
                          <span><strong>Contact:</strong> {item.contactInfo}<br /></span>
                        )}
                        {item.qrCode && (
                          <span><strong>QR Code:</strong> {item.qrCode}<br /></span>
                        )}
                        {item.createdAt && (
                          <span>Reported on: {new Date(item.createdAt).toLocaleDateString()}</span>
                        )}
                      </small>
                      {item.image && (
                        <div className="mt-2">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '5px' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LostFoundPage;
