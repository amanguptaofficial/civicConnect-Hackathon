import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useAuthStore from '../store/authStore';
import { authService } from '../services/auth.service';
import ErrorMessage from '../components/common/ErrorMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { IoShieldCheckmark, IoLogoGoogle } from 'react-icons/io5';

const AdminSigninPage = () => {
  const navigate = useNavigate();
  const { login, setError, error, isLoading, setLoading } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: async (response) => {
            try {
              const googleData = JSON.parse(atob(response.credential.split('.')[1]));
              const authResponse = await authService.googleLogin({
                email: googleData.email,
                firstName: googleData.given_name,
                lastName: googleData.family_name,
                profileImage: googleData.picture,
                googleId: googleData.sub,
              });
              
              if (authResponse.data.user.role !== 'policymaker' && authResponse.data.user.role !== 'admin') {
                setError('This login is only for government officials and administrators.');
                setLoading(false);
                return;
              }
              
              login(authResponse.data.user, authResponse.data.token);
              const redirectPath = authResponse.data.user.role === 'admin' 
                ? '/admin' 
                : '/government';
              navigate(redirectPath);
            } catch (err) {
              setError('Google login failed. Please try again.');
            } finally {
              setLoading(false);
            }
          },
        });
        window.google.accounts.id.prompt();
      } else {
        setError('Google Sign-In is not available. Please use email/password login.');
        setLoading(false);
      }
    } catch (err) {
      setError('Google login failed. Please try again.');
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(data.email, data.password);
      
      if (response.data.user.role !== 'policymaker' && response.data.user.role !== 'admin') {
        setError('This login is only for government officials and administrators. Please use the regular login page.');
        setLoading(false);
        return;
      }
      
      login(response.data.user, response.data.token);
      const redirectPath = response.data.user.role === 'admin' 
        ? '/admin' 
        : '/government';
      navigate(redirectPath);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4">
            <IoShieldCheckmark className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Government Portal</h1>
          <p className="text-gray-600 dark:text-gray-400">Sign in to your government account</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                placeholder="official@government.gov"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <input
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="btn-primary w-full py-3" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="small" />
                  <span>Signing in...</span>
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="mt-4 w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 bg-white dark:bg-gray-800"
            >
              <IoLogoGoogle className="w-5 h-5 text-red-500" />
              <span className="font-medium text-gray-700 dark:text-gray-300">Continue with Google</span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Are you a citizen?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Citizen Login
              </Link>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Don't have an account? Contact your administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSigninPage;
