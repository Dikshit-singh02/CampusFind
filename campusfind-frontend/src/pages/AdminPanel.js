import React, { useState, useEffect } from 'react';
import { 
  getAllUsers, getUserStats, updateUserRole, deleteUser,
  getLostItems, getFoundItems, getLostItemById, getFoundItemById,
  updateLostItem, deleteLostItem, updateFoundItem, deleteFoundItem 
} from '../services/api';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    students: 0,
    faculty: 0,
    admins: 0,
    totalLost: 0,
    totalFound: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, statsRes, lostRes, foundRes] = await Promise.all([
        getAllUsers(),
        getUserStats(),
        getLostItems(),
        getFoundItems()
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
      setLostItems(lostRes.data || []);
      setFoundItems(foundRes.data || []);
      setStats(prev => ({ ...prev, totalLost: lostRes.data?.length || 0, totalFound: foundRes.data?.length || 0 }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // User Actions
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(userId);
      setSuccess('User deleted successfully');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      setSuccess('User role updated successfully');
      setShowUserModal(false);
      setSelectedUser(null);
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update role');
      setTimeout(() => setError(''), 3000);
    }
  };

  const openUserModal = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  // Item Actions
  const copyQRCode = (qrCode) => {
    navigator.clipboard.writeText(qrCode);
    setSuccess('QR Code copied!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const openItemModal = async (item, type) => {
    try {
      const getFn = type === 'lost' ? getLostItemById : getFoundItemById;
      const fullItem = await getFn(item._id);
      setEditingItem(fullItem.data);
      setSelectedItem({ ...item, type });
      setShowItemModal(true);
    } catch (err) {
      console.error('Load item error:', err);
      setError('Failed to load item details: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem || !selectedItem) return;
    
    try {
      const updateFn = selectedItem.type === 'lost' ? updateLostItem : updateFoundItem;
      await updateFn(editingItem._id, editingItem);
      setSuccess(`Item '${editingItem.title}' updated!`);
      setShowItemModal(false);
      setEditingItem(null);
      setSelectedItem(null);
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Update error:', err);
      setError('Update failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteItem = async (itemId, type) => {
    if (!window.confirm(`Delete "${type === 'lost' ? 'Lost' : 'Found'} Item: ${type === 'lost' ? lostItems.find(i => i._id === itemId)?.title : foundItems.find(i => i._id === itemId)?.title}"?`)) return;
    
    try {
      const deleteFn = type === 'lost' ? deleteLostItem : deleteFoundItem;
      await deleteFn(itemId);
      setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} item deleted!`);
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Delete error:', err);
      setError('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'bg-danger';
      case 'faculty': return 'bg-warning text-dark';
      default: return 'bg-primary';
    }
  };

  const getItemStatusBadge = (status, type) => {
    if (type === 'lost') {
      return status === 'Available' ? 'bg-success' : status === 'Claimed' ? 'bg-warning' : 'bg-info';
    }
    return status === 'Available' ? 'bg-success' : status === 'Claimed' ? 'bg-warning' : 'bg-info';
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center mb-4 display-6 fw-bold text-primary">
            <i className="fas fa-crown me-3"></i>
            CampusFind Admin Dashboard
          </h1>

          {/* Stats Cards */}
          <div className="row g-4 mb-5">
            <div className="col-xl-2 col-md-3 col-sm-6">
              <div className="card h-100 shadow-lg border-0 hover-shadow">
                <div className="card-body text-center p-4">
                  <i className="fas fa-users fa-3x text-primary mb-3"></i>
                  <h3 className="fw-bold text-primary">{stats.totalUsers}</h3>
                  <p className="mb-0 text-muted fs-6">Total Users</p>
                </div>
              </div>
            </div>
            <div className="col-xl-2 col-md-3 col-sm-6">
              <div className="card h-100 shadow-lg border-0 hover-shadow">
                <div className="card-body text-center p-4">
                  <i className="fas fa-user-graduate fa-3x text-success mb-3"></i>
                  <h3 className="fw-bold text-success">{stats.students}</h3>
                  <p className="mb-0 text-muted fs-6">Students</p>
                </div>
              </div>
            </div>
            <div className="col-xl-2 col-md-3 col-sm-6">
              <div className="card h-100 shadow-lg border-0 hover-shadow">
                <div className="card-body text-center p-4">
                  <i className="fas fa-chalkboard-teacher fa-3x text-warning mb-3"></i>
                  <h3 className="fw-bold text-warning">{stats.faculty}</h3>
                  <p className="mb-0 text-muted fs-6">Faculty</p>
                </div>
              </div>
            </div>
            <div className="col-xl-2 col-md-3 col-sm-6">
              <div className="card h-100 shadow-lg border-0 hover-shadow">
                <div className="card-body text-center p-4">
                  <i className="fas fa-shield-alt fa-3x text-danger mb-3"></i>
                  <h3 className="fw-bold text-danger">{stats.admins}</h3>
                  <p className="mb-0 text-muted fs-6">Admins</p>
                </div>
              </div>
            </div>
            <div className="col-xl-2 col-md-3 col-sm-6">
              <div className="card h-100 shadow-lg border-0 hover-shadow">
                <div className="card-body text-center p-4">
                  <i className="fas fa-exclamation-triangle fa-3x text-info mb-3"></i>
                  <h3 className="fw-bold text-info">{stats.totalLost}</h3>
                  <p className="mb-0 text-muted fs-6">Lost Items</p>
                </div>
              </div>
            </div>
            <div className="col-xl-2 col-md-3 col-sm-6">
              <div className="card h-100 shadow-lg border-0 hover-shadow">
                <div className="card-body text-center p-4">
                  <i className="fas fa-search fa-3x text-success mb-3"></i>
                  <h3 className="fw-bold text-success">{stats.totalFound}</h3>
                  <p className="mb-0 text-muted fs-6">Found Items</p>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button type="button" className="btn-close" onClick={() => setError('')}></button>
            </div>
          )}
          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {success}
              <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
            </div>
          )}

          {/* Tabs */}
          <ul className="nav nav-tabs nav-fill mb-4" id="adminTabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} 
                onClick={() => setActiveTab('users')}
              >
                <i className="fas fa-users me-1"></i>Users
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${activeTab === 'lost' ? 'active' : ''}`} 
                onClick={() => setActiveTab('lost')}
              >
                <i className="fas fa-exclamation-triangle me-1"></i>Lost Items
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${activeTab === 'found' ? 'active' : ''}`} 
                onClick={() => setActiveTab('found')}
              >
                <i className="fas fa-search me-1"></i>Found Items
              </button>
            </li>
          </ul>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="card shadow-lg">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="fas fa-user-cog me-2"></i>Manage Users ({users.length})
                  </h5>
                  <button className="btn btn-sm btn-outline-primary" onClick={fetchData}>
                    <i className="fas fa-sync-alt"></i> Refresh
                  </button>
                </div>
                <div className="card-body p-0">
                  {users.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fas fa-users fa-3x text-muted mb-3"></i>
                      <p className="text-muted">No users found</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="table-dark">
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Registered</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user._id}>
                              <td>
                                <div>
                                  <strong>{user.name}</strong>
                                </div>
                              </td>
                              <td>{user.email}</td>
                              <td>
                                <span className={`badge px-3 py-2 fs-6 ${getRoleBadgeClass(user.role)}`}>
                                  {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                                </span>
                              </td>
                              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                              <td>
                                <div className="actions-group">
                                  <button
                                    className="btn-action btn-edit"
                                    onClick={() => openUserModal(user)}
                                  >
                                    Edit Role
                                  </button>
                                  <button
                                    className="btn-action btn-delete"
                                    onClick={() => handleDeleteUser(user._id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Lost Items Tab */}
            {activeTab === 'lost' && (
              <div className="card shadow-lg">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="fas fa-exclamation-triangle me-2 text-warning"></i>
                    Lost Items ({lostItems.length})
                  </h5>
                  <button className="btn btn-sm btn-outline-primary" onClick={fetchData}>
                    <i className="fas fa-sync-alt"></i> Refresh
                  </button>
                </div>
                <div className="card-body p-0">
                  {lostItems.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                      <p className="text-muted">No lost items</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Title</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>User</th>
                            <th>Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lostItems.map((item) => (
                            <tr key={item._id}>
                              <td>{item.title}</td>
                              <td><small>{item.location}</small></td>
                              <td>
                                <span className={`badge px-3 py-2 fs-6 ${getItemStatusBadge(item.status, 'lost')}`}>
                                  {item.status}
                                </span>
                              </td>
                              <td>{item.userId?.name || 'Anonymous'}</td>
                              <td>
                                <small className="d-block">{new Date(item.createdAt).toLocaleDateString()}</small>
                                <small className="text-muted">QR: {item.qrCode}</small>
                              </td>
                              <td>
                                <div className="actions-group">
                                  <button
                                    className="btn-action btn-view"
                                    onClick={() => copyQRCode(item.qrCode)}
                                  >
                                    View QR
                                  </button>
                                  <button
                                    className="btn-action btn-edit"
                                    onClick={() => openItemModal(item, 'lost')}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="btn-action btn-delete"
                                    onClick={() => handleDeleteItem(item._id, 'lost')}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Found Items Tab */}
            {activeTab === 'found' && (
              <div className="card shadow-lg">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="fas fa-search me-2 text-success"></i>
                    Found Items ({foundItems.length})
                  </h5>
                  <button className="btn btn-sm btn-outline-primary" onClick={fetchData}>
                    <i className="fas fa-sync-alt"></i> Refresh
                  </button>
                </div>
                <div className="card-body p-0">
                  {foundItems.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fas fa-search fa-3x text-muted mb-3"></i>
                      <p className="text-muted">No found items</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Title</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>User</th>
                            <th>Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {foundItems.map((item) => (
                            <tr key={item._id}>
                              <td>{item.title}</td>
                              <td><small>{item.location}</small></td>
                              <td>
                                <span className={`badge px-3 py-2 fs-6 ${getItemStatusBadge(item.claimStatus || item.status, 'found')}`}>
                                  {item.claimStatus || item.status}
                                </span>
                              </td>
                              <td>{item.userId?.name || 'Anonymous'}</td>
                              <td>
                                <small className="d-block">{new Date(item.createdAt).toLocaleDateString()}</small>
                                <small className="text-muted">QR: {item.qrCode}</small>
                              </td>
                              <td>
                                <div className="actions-group">
                                  <button
                                    className="btn-action btn-view"
                                    onClick={() => copyQRCode(item.qrCode)}
                                  >
                                    View QR
                                  </button>
                                  <button
                                    className="btn-action btn-edit"
                                    onClick={() => openItemModal(item, 'found')}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="btn-action btn-delete"
                                    onClick={() => handleDeleteItem(item._id, 'found')}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Role Modal */}
          {showUserModal && selectedUser && (
            <>
              <div className="modal-backdrop fade show" onClick={() => setShowUserModal(false)}></div>
              <div className="modal fade show d-block" tabIndex="-1">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header border-0">
                      <h5 className="modal-title">
                        <i className="fas fa-user-cog me-2"></i>Change Role for {selectedUser.name}
                      </h5>
                      <button className="btn-close" onClick={() => setShowUserModal(false)}></button>
                    </div>
                    <div className="modal-body">
                      <p>Current role: <strong className="badge bg-secondary">{selectedUser.role}</strong></p>
                      <div className="row g-2">
                        <div className="col">
                          <button
                            className={`btn w-100 ${selectedUser.role === 'student' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => handleUpdateRole(selectedUser._id, 'student')}
                          >
                            👨‍🎓 Student
                          </button>
                        </div>
                        <div className="col">
                          <button
                            className={`btn w-100 ${selectedUser.role === 'faculty' ? 'btn-warning' : 'btn-outline-warning'}`}
                            onClick={() => handleUpdateRole(selectedUser._id, 'faculty')}
                          >
                            👨‍🏫 Faculty
                          </button>
                        </div>
                        <div className="col">
                          <button
                            className={`btn w-100 ${selectedUser.role === 'admin' ? 'btn-danger' : 'btn-outline-danger'}`}
                            onClick={() => handleUpdateRole(selectedUser._id, 'admin')}
                          >
                            ⚙️ Admin
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Item Edit Modal */}
          {showItemModal && selectedItem && (
            <>
              <div className="modal-backdrop fade show" onClick={() => setShowItemModal(false)}></div>
              <div className="modal fade show d-block" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header border-0">
                      <h5 className="modal-title">
                        <i className={`fas fa-${selectedItem.type === 'lost' ? 'exclamation-triangle' : 'search'} me-2 text-${selectedItem.type === 'lost' ? 'warning' : 'success'}`}></i>
                        Edit {selectedItem.type.toUpperCase()} Item: {selectedItem.title}
                      </h5>
                      <button className="btn-close" onClick={() => setShowItemModal(false)}></button>
                    </div>
                    <div className="modal-body">
                      {editingItem && (
                        <form>
                          <div className="row g-3">
                            <div className="col-md-6">
                              <label className="form-label fw-bold">Title</label>
                              <input 
                                type="text" 
                                className="form-control" 
                                value={editingItem.title || ''}
                                onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-bold">Status</label>
                              <select 
                                className="form-select" 
                                value={editingItem.status || editingItem.claimStatus || 'Available'}
                                onChange={(e) => {
                                  const status = e.target.value;
                                  setEditingItem({
                                    ...editingItem,
                                    ...(selectedItem.type === 'lost' ? { status } : { claimStatus: status })
                                  });
                                }}
                              >
                                <option value="Available">Available</option>
                                <option value="Claimed">Claimed</option>
                                <option value="Returned">Returned</option>
                              </select>
                            </div>
                            <div className="col-12">
                              <label className="form-label fw-bold">Location</label>
                              <input 
                                type="text" 
                                className="form-control" 
                                value={editingItem.location || ''}
                                onChange={(e) => setEditingItem({...editingItem, location: e.target.value})}
                              />
                            </div>
                            <div className="col-12">
                              <label className="form-label fw-bold">Description</label>
                              <textarea 
                                className="form-control" 
                                rows="3"
                                value={editingItem.description || ''}
                                onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-bold">Contact Info</label>
                              <input 
                                type="text" 
                                className="form-control" 
                                value={editingItem.contactInfo || ''}
                                onChange={(e) => setEditingItem({...editingItem, contactInfo: e.target.value})}
                              />
                            </div>
                          </div>
                        </form>
                      )}
                    </div>
                    <div className="modal-footer border-0">
                      <button className="btn btn-secondary" onClick={() => setShowItemModal(false)}>
                        Cancel
                      </button>
                      <button className="btn btn-primary" onClick={handleUpdateItem}>
                        <i className="fas fa-save me-1"></i> Update Item
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

