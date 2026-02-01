import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import useAuthStore from '../store/authStore';

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          setError('Google login was cancelled or failed. Please try again.');
          navigate('/login');
          return;
        }

        if (!code) {
          setError('No authorization code received from Google.');
          navigate('/login');
          return;
        }

        const response = await authService.googleCallback({ code });
        
        login(response.data.user, response.data.token);
        
        const redirectPath = response.data.user.role === 'policymaker' || response.data.user.role === 'admin' 
          ? '/government' 
          : '/dashboard';
        navigate(redirectPath);
        
      } catch (err) {
        console.error('Google callback error:', err);
        setError(err.response?.data?.error?.message || 'Google login failed. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      } finally {
        setLoading(false);
      }
    };

    handleGoogleCallback();
  }, [searchParams, navigate, login]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Completing Google sign-in...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-4">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Redirecting to login page...</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default GoogleCallback;
