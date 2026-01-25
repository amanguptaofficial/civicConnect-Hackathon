import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import AppLayout from '../components/layout/AppLayout';
import { authService } from '../services/auth.service';
import useAuthStore from '../store/authStore';
import ErrorMessage from '../components/common/ErrorMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  useEffect(() => {
    if (user) {
      setValue('firstName', user.firstName);
      setValue('lastName', user.lastName);
      setValue('phoneNumber', user.phoneNumber || '');
      setValue('address', user.address || '');
      setValue('city', user.city || '');
      setValue('state', user.state || '');
      setValue('zipCode', user.zipCode || '');
      setProfileLoading(false);
    } else {
      fetchProfile();
    }
  }, [user, setValue]);

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const response = await authService.getMe();
      const userData = response.data;
      setValue('firstName', userData.firstName);
      setValue('lastName', userData.lastName);
      setValue('phoneNumber', userData.phoneNumber || '');
      setValue('address', userData.address || '');
      setValue('city', userData.city || '');
      setValue('state', userData.state || '');
      setValue('zipCode', userData.zipCode || '');
      setUser(userData);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.updateProfile(data);
      const updatedUser = response.data;
      setUser(updatedUser);
      const userId = updatedUser._id || updatedUser.id || user?.id || user?._id;
      navigate(`/profile/${userId || 'me'}`);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="large" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
          {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  {...register('firstName', { required: 'First name is required' })}
                  className="input-field"
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  {...register('lastName', { required: 'Last name is required' })}
                  className="input-field"
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                {...register('phoneNumber')}
                className="input-field"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                {...register('address')}
                className="input-field"
                placeholder="Street address"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  {...register('city')}
                  className="input-field"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  {...register('state')}
                  className="input-field"
                  placeholder="State"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                <input
                  type="text"
                  {...register('zipCode')}
                  className="input-field"
                  placeholder="Zip Code"
                />
              </div>
            </div>
            <div className="flex gap-4 pt-4 border-t">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner size="small" />
                    <span>Saving...</span>
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-outline"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default EditProfilePage;
