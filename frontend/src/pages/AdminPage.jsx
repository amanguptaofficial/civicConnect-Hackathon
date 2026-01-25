import { useState, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { authService } from '../services/auth.service';
import { adminService } from '../services/admin.service';
import ErrorMessage from '../components/common/ErrorMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { IoAdd, IoTrash, IoShieldCheckmark, IoMail, IoPerson } from 'react-icons/io5';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'policymaker',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getUsers();
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await adminService.createUser(formData);
      setShowForm(false);
      setFormData({ email: '', password: '', firstName: '', lastName: '', role: 'policymaker' });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      setLoading(true);
      await adminService.deleteUser(id);
      fetchUsers();
    } catch (err) {
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const governmentUsers = users.filter(u => u.role === 'policymaker' || u.role === 'admin');
  const citizenUsers = users.filter(u => u.role === 'citizen');

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Panel</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage government users and platform settings</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            <IoAdd className="w-5 h-5" />
            Add Government User
          </button>
        </div>

        {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

        {showForm && (
          <div className="card bg-white dark:bg-gray-800 mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Create Government User</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="policymaker">Policymaker</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-4">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? <LoadingSpinner size="small" /> : 'Create User'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="card bg-white dark:bg-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <IoShieldCheckmark className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Government Users</h2>
            </div>
            {loading ? (
              <LoadingSpinner />
            ) : governmentUsers.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No government users found</p>
            ) : (
              <div className="space-y-4">
                {governmentUsers.map((user) => (
                  <div key={user._id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <IoPerson className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <IoMail className="w-4 h-4" />
                          {user.email}
                        </p>
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                          {user.role}
                        </span>
                      </div>
                    </div>
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <IoTrash className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card bg-white dark:bg-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <IoPerson className="w-6 h-6 text-green-600 dark:text-green-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Citizen Users</h2>
            </div>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="text-center py-8">
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{citizenUsers.length}</p>
                <p className="text-gray-500 dark:text-gray-400">Total Citizens</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminPage;
