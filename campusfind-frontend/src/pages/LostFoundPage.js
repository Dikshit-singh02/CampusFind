import React, { useState, useEffect } from 'react';
import { getLostItems, createLostItem, getFoundItems, createFoundItem, updateItemStatus } from '../services/api';
import './LostFoundPage.css';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
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
      setLostItems(lostResponse.data || []);
      setFoundItems(foundResponse.data || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load items');
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
    try {
      await createLostItem(lostFormData);
      setSuccessMessage('Lost item reported!');
      setLostFormData({ title: '', description: '', image: '', location: '', contactInfo: '' });
      fetchItems();
    } catch (err) {
      setError('Failed to report lost item');
    }
  };

  const handleFoundSubmit = async (e) => {
    e.preventDefault();
    try {
      await createFoundItem(foundFormData);
      setSuccessMessage('Found item reported!');
      setFoundFormData({ title: '', description: '', image: '', location: '', contactInfo: '' });
      fetchItems();
    } catch (err) {
      setError('Failed to report found item');
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Available':
        return 'lf-badge-success';
      case 'Claimed':
        return 'lf-badge-warning';
      case 'Returned':
        return 'lf-badge-info';
      default:
        return 'lf-badge-secondary';
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('QR copied!');
  };

  const claimItem = async (item) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Claim this item?')) return;
    try {
      await updateItemStatus(item._id, { status: 'Claimed' });
      setSuccessMessage('Claimed!');
      fetchItems();
    } catch (err) {
      setError('Claim failed');
    }
  };


  const openImageModal = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  const filteredLostItems = lostItems.filter(item => 
    (!searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterStatus === 'All' || item.status === filterStatus)
  );

  const filteredFoundItems = foundItems.filter(item => 
    (!searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterStatus === 'All' || item.status === filterStatus)
  );

  const renderItem = (item, type) => (
    <div className="lf-list-group-item" key={item._id}>
      <div>
        <h6>{item.title}</h6>
        <span className={`badge ${getStatusBadgeColor(item.status)}`}>
          {item.status || 'Available'}
        </span>
        <p>{item.description}</p>
        <small>{item.location} | {item.contactInfo}</small>
        {item.image && (
          <img 
            src={item.image} 
            alt={item.title}
            className="lf-img"
            onClick={() => openImageModal(item.image)}
            style={{cursor: 'pointer', maxHeight: '100px'}}
          />
        )}
      </div>
      <div>
        {item.qrCode && (
          <button className="lf-qr-btn me-2" onClick={() => copyToClipboard(item.qrCode)}>
            QR
          </button>
        )}
        {type === 'found' && item.status === 'Available' && (
          <button className="btn btn-primary btn-sm" onClick={() => claimItem(item)}>
            Claim
          </button>
        )}
      </div>
    </div>
  );

  if (showModal) {
    return (
      <div className="modal-backdrop" onClick={closeModal}>
        <div className="lf-modal" onClick={(e) => e.stopPropagation()}>
          <img src={selectedImage} alt="Item" />
          <button onClick={closeModal}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="lf-page-root">
      <div className="lf-container">
        <h2 className="lf-title mb-4">Lost & Found</h2>
        
        {error && (
          <div className="lf-alert lf-alert-danger mb-4">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="lf-alert lf-alert-success mb-4">
            {successMessage}
          </div>
        )}

        <div className="lf-tabs mb-4">
          <button 
            className={`lf-tab-btn ${activeTab === 'report' ? 'active' : ''}`}
            onClick={() => setActiveTab('report')}
          >
            Report Item
          </button>
          <button 
            className={`lf-tab-btn ${activeTab === 'browse' ? 'active' : ''}`}
            onClick={() => setActiveTab('browse')}
          >
            Browse Items
          </button>
        </div>

        {loading && <div className="text-center p-5"><div className="spinner-border lf-spinner" /></div>}

        {activeTab === 'report' && (
          <div className="row mb-5">
            <div className="col-md-6">
              <div className="lf-card-glass">
                <div className="lf-card-header-lost">
                  Report Lost Item
                </div>
                <div className="p-4">
                  <form onSubmit={handleLostSubmit}>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="lf-form-control mb-3"
                        name="title"
                        value={lostFormData.title}
                        onChange={handleLostChange}
                        placeholder="Title"
                        required
                      />
                      <textarea
                        className="lf-form-control mb-3"
                        name="description"
                        value={lostFormData.description}
                        onChange={handleLostChange}
                        placeholder="Description"
                        rows="3"
                      />
                      <input
                        type="text"
                        className="lf-form-control mb-3"
                        name="location"
                        value={lostFormData.location}
                        onChange={handleLostChange}
                        placeholder="Location"
                      />
                      <input
                        type="text"
                        className="lf-form-control mb-3"
                        name="contactInfo"
                        value={lostFormData.contactInfo}
                        onChange={handleLostChange}
                        placeholder="Contact"
                      />
                      <input
                        type="file"
                        className="lf-form-control"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, setLostFormData, lostFormData)}
                      />
                    </div>
                    <button type="submit" className="lf-btn-lost w-100">
                      Report Lost
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="lf-card-glass">
                <div className="lf-card-header-found">
                  Report Found Item
                </div>
                <div className="p-4">
                  <form onSubmit={handleFoundSubmit}>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="lf-form-control mb-3"
                        name="title"
                        value={foundFormData.title}
                        onChange={handleFoundChange}
                        placeholder="Title"
                        required
                      />
                      <textarea
                        className="lf-form-control mb-3"
                        name="description"
                        value={foundFormData.description}
                        onChange={handleFoundChange}
                        placeholder="Description"
                        rows="3"
                      />
                      <input
                        type="text"
                        className="lf-form-control mb-3"
                        name="location"
                        value={foundFormData.location}
                        onChange={handleFoundChange}
                        placeholder="Location"
                      />
                      <input
                        type="text"
                        className="lf-form-control mb-3"
                        name="contactInfo"
                        value={foundFormData.contactInfo}
                        onChange={handleFoundChange}
                        placeholder="Contact"
                      />
                      <input
                        type="file"
                        className="lf-form-control"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, setFoundFormData, foundFormData)}
                      />
                    </div>
                    <button type="submit" className="lf-btn-found w-100">
                      Report Found
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'browse' && (
          <div>
            <div className="row mb-4">
              <div className="col-md-3">
                <input
                  type="text"
                  className="lf-form-control"
                  placeholder="🔍 Search items"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <select className="lf-form-control" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option>All Status</option>
                  <option>Available</option>
                  <option>Claimed</option>
                </select>
              </div>
              <div className="col-md-2">
                <select className="lf-form-control" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                  <option>All Types</option>
                  <option>Lost</option>
                  <option>Found</option>
                </select>
              </div>
              <div className="col-md-2">
                <select className="lf-form-control" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option>Newest</option>
                  <option>Oldest</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="lf-card-glass h-100">
                  <div className="lf-card-header-list-lost">
                    Lost Items ({filteredLostItems.length})
                  </div>
                  <div className="card-body lf-scrollable">
                    {filteredLostItems.map(item => renderItem(item, 'lost'))}
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="lf-card-glass h-100">
                  <div className="lf-card-header-list-found">
                    Found Items ({filteredFoundItems.length})
                  </div>
                  <div className="card-body lf-scrollable">
                    {filteredFoundItems.map(item => renderItem(item, 'found'))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LostFoundPage;
