import React, { useState, useEffect } from 'react';
import { getLostItems, createLostItem, getFoundItems, createFoundItem } from '../services/api';

const LostFoundPage = () => {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [lostFormData, setLostFormData] = useState({
    title: '',
    description: '',
    image: '',
    location: ''
  });
  const [foundFormData, setFoundFormData] = useState({
    title: '',
    description: '',
    image: '',
    location: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const handleLostSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLostItem(lostFormData);
      setLostFormData({ title: '', description: '', image: '', location: '' });
      fetchItems();
      alert('Lost item reported successfully!');
    } catch (err) {
      console.error('Error creating lost item:', err);
      alert('Failed to report lost item');
    }
  };

  const handleFoundSubmit = async (e) => {
    e.preventDefault();
    try {
      await createFoundItem(foundFormData);
      setFoundFormData({ title: '', description: '', image: '', location: '' });
      fetchItems();
      alert('Found item reported successfully!');
    } catch (err) {
      console.error('Error creating found item:', err);
      alert('Failed to report found item');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Lost & Found</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
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
                    <label>Title</label>
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
                    <label>Description</label>
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
                    <label>Location</label>
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
                    <label>Image URL (optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="image"
                      value={lostFormData.image}
                      onChange={handleLostChange}
                      placeholder="Enter image URL"
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
                    <label>Title</label>
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
                    <label>Description</label>
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
                    <label>Location</label>
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
                    <label>Image URL (optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="image"
                      value={foundFormData.image}
                      onChange={handleFoundChange}
                      placeholder="Enter image URL"
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
            <div className="card-header bg-danger text-white">
              <h5 className="mb-0">Lost Items ({lostItems.length})</h5>
            </div>
            <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {lostItems.length === 0 ? (
                <p className="text-muted text-center">No lost items reported yet.</p>
              ) : (
                <ul className="list-group">
                  {lostItems.map((item) => (
                    <li key={item._id} className="list-group-item">
                      <h6>{item.title}</h6>
                      <p className="mb-1">{item.description}</p>
                      <small className="text-muted">
                        <strong>Location:</strong> {item.location}<br />
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
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">Found Items ({foundItems.length})</h5>
            </div>
            <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {foundItems.length === 0 ? (
                <p className="text-muted text-center">No found items reported yet.</p>
              ) : (
                <ul className="list-group">
                  {foundItems.map((item) => (
                    <li key={item._id} className="list-group-item">
                      <h6>{item.title}</h6>
                      <p className="mb-1">{item.description}</p>
                      <small className="text-muted">
                        <strong>Location:</strong> {item.location}<br />
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
