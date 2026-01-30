import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useAuthStore from '../../store/authStore';
import { authService } from '../../services/auth.service';
import ErrorMessage from '../common/ErrorMessage';
import LoadingSpinner from '../common/LoadingSpinner';
import { IoLogoGoogle } from 'react-icons/io5';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, setError, error, isLoading, setLoading } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleGoogleLogin = () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Google Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
      
      if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
        setError('Google Client ID is not configured. Please contact support.');
        setLoading(false);
        return;
      }

      const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(window.location.origin + '/auth/google/callback')}&` +
        `response_type=code&` +
        `scope=email%20profile&` +
        `access_type=offline`;
      
      console.log('Redirecting to:', googleOAuthUrl);
      window.location.href = googleOAuthUrl;
      
    } catch (err) {
      console.error('Google login error:', err);
      setError('Google login failed. Please try again.');
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(data.email, data.password);
      login(response.data.user, response.data.token);
      const redirectPath = response.data.user.role === 'policymaker' || response.data.user.role === 'admin' 
        ? '/government' 
        : '/dashboard';
      navigate(redirectPath);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Login</h2>
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <input
            type="password"
            {...register('password', { required: 'Password is required' })}
            className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
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
        <button type="submit" className="btn-primary w-full" disabled={isLoading}>
          {isLoading ? <LoadingSpinner size="small" /> : 'Login'}
        </button>
      </form>
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
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
      <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
      <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
        Government official?{' '}
        <Link to="/admin/signin" className="text-primary hover:underline">
          Admin Sign In
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
