import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { authService } from '../../services/auth.service';
import ErrorMessage from '../common/ErrorMessage';
import LoadingSpinner from '../common/LoadingSpinner';
import { FiEye, FiEyeOff, FiCopy, FiCheck } from 'react-icons/fi';

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [copied, setCopied] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = watch('password');

  const onEmailSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.forgotPassword(data.email);
      setEmail(data.email);
      
      if (response.data.resetToken) {
        setToken(response.data.resetToken);
      }
      
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.resetPassword(token, data.password);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        {step === 1 ? 'Forgot Password' : 'Reset Password'}
      </h2>
      
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
      
      {step === 1 ? (
        <form onSubmit={handleSubmit(onEmailSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              placeholder="Enter your email address"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          
          <button type="submit" className="btn-primary w-full" disabled={isLoading}>
            {isLoading ? <LoadingSpinner size="small" /> : 'Send Reset Email'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              A reset code has been generated for your email. Please use the code below to reset your password.
            </p>
            {token && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Your reset code:</p>
                  <CopyToClipboard text={token} onCopy={handleCopy}>
                    <button
                      type="button"
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
                    >
                      {copied ? <FiCheck size={12} /> : <FiCopy size={12} />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </CopyToClipboard>
                </div>
                <div className="bg-white dark:bg-gray-800 p-2 rounded border border-blue-300 dark:border-blue-600 break-all">
                  <p className="text-sm font-mono text-blue-900 dark:text-blue-100">{token}</p>
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">Click Copy button or copy the code above</p>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reset Code
            </label>
            <input
              type="text"
              {...register('token', { required: 'Reset code is required' })}
              className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              placeholder="Enter reset code"
              onChange={(e) => setToken(e.target.value)}
            />
            {errors.token && <p className="text-red-500 text-sm mt-1">{errors.token.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  }
                })}
                className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 pr-10"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
                className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 pr-10"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>
          
          <button type="submit" className="btn-primary w-full" disabled={isLoading}>
            {isLoading ? <LoadingSpinner size="small" /> : 'Reset Password'}
          </button>
        </form>
      )}
      
      <div className="mt-6 text-center">
        <Link to="/login" className="text-sm text-primary hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
