import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useAuthStore from '../../store/authStore';
import { authService } from '../../services/auth.service';
import ErrorMessage from '../common/ErrorMessage';
import LoadingSpinner from '../common/LoadingSpinner';
import { IoLogoGoogle } from 'react-icons/io5';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { login, setError, error, isLoading, setLoading } = useAuthStore();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const handleGoogleSignup = () => {
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
      
      console.log('Redirecting to Google OAuth for signup:', googleOAuthUrl);
      window.location.href = googleOAuthUrl;
      
    } catch (err) {
      console.error('Google signup error:', err);
      setError('Google signup failed. Please try again.');
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(data);
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Create Account</h2>
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
            <input
              type="text"
              {...register('firstName', { required: 'First name is required' })}
              className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
            <input
              type="text"
              {...register('lastName', { required: 'Last name is required' })}
              className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
          </div>
        </div>
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
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
            })}
            className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
          <input
            type="password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === password || 'Passwords do not match',
            })}
            className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>
        <input type="hidden" {...register('role')} value="citizen" />
        <button type="submit" className="btn-primary w-full" disabled={isLoading}>
          {isLoading ? <LoadingSpinner size="small" /> : 'Sign Up'}
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
          onClick={handleGoogleSignup}
          disabled={isLoading}
          className="mt-4 w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 bg-white dark:bg-gray-800"
        >
          <IoLogoGoogle className="w-5 h-5 text-red-500" />
          <span className="font-medium text-gray-700 dark:text-gray-300">Sign up with Google</span>
        </button>
      </div>
      <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:underline">
          Login
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

export default RegisterForm;
