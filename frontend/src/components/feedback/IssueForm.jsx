import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { feedbackService } from '../../services/feedback.service';
import { aiService } from '../../services/ai.service';
import { FEEDBACK_CATEGORIES } from '../../utils/constants';
import ErrorMessage from '../common/ErrorMessage';
import LoadingSpinner from '../common/LoadingSpinner';
import ImageUpload from '../common/ImageUpload';
import LocationPicker from '../common/LocationPicker';
import { FiMapPin, FiEdit3, FiZap } from 'react-icons/fi';

const IssueForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [showAiPrompt, setShowAiPrompt] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const isAnonymous = watch('isAnonymous');

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const issueData = {
        ...data,
        category: 'concern',
        images: images,
        isIssue: true,
        location: selectedLocation,
      };

      await feedbackService.createFeedback(issueData);
      navigate('/issues');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to report issue');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDescription = async () => {
    if (!aiPrompt.trim()) {
      setError('Please enter a prompt for AI description');
      return;
    }

    try {
      setIsGeneratingDescription(true);
      setError(null);
      const response = await aiService.generateIssueDescription(aiPrompt);
      setValue('content', response.data.description);
      setShowAiPrompt(false);
      setAiPrompt('');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to generate description');
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  return (
    <div className="max-w-3xl mx-auto card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Report Issue</h2>
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Issue Title</label>
          <input
            type="text"
            {...register('title', { required: 'Title is required' })}
            className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            placeholder="Brief description of the issue"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Issue Description</label>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Provide detailed information about the issue
              </span>
              <button
                type="button"
                onClick={() => setShowAiPrompt(!showAiPrompt)}
                className="flex items-center gap-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
              >
                <FiZap size={12} />
                AI Generate
              </button>
            </div>
            
            {showAiPrompt && (
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3 space-y-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Describe your issue briefly (e.g., 'pothole on main road', 'broken streetlight')"
                  className="input-field text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-purple-300 dark:border-purple-600"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={isGeneratingDescription}
                    className="btn-primary text-sm px-3 py-1 disabled:opacity-50"
                  >
                    {isGeneratingDescription ? <LoadingSpinner size="small" /> : 'Generate'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAiPrompt(false)}
                    className="btn-outline text-sm px-3 py-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            <textarea
              {...register('content', { required: 'Description is required', minLength: 10 })}
              rows={6}
              className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              placeholder="Provide detailed information about the issue"
            />
            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Issue Type</label>
          <select {...register('issueType', { required: 'Issue type is required' })} className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
            <option value="">Select issue type</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="public_service">Public Service</option>
            <option value="safety">Safety & Security</option>
            <option value="environment">Environmental</option>
            <option value="traffic">Traffic & Transportation</option>
            <option value="noise">Noise Pollution</option>
            <option value="waste">Waste Management</option>
            <option value="other">Other</option>
          </select>
          {errors.issueType && <p className="text-red-500 text-sm mt-1">{errors.issueType.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
          <select {...register('priority', { required: 'Priority is required' })} className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
            <option value="">Select priority level</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
            <FiMapPin size={16} />
            Issue Location
          </label>
          <LocationPicker 
            onLocationSelect={handleLocationSelect}
            initialPosition={selectedLocation?.coordinates}
            address={selectedLocation?.address}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Click on the map or use current location to pinpoint the issue location
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Attach Images (Optional)</label>
          <ImageUpload
            onUploadComplete={setImages}
            maxFiles={5}
            existingImages={images}
            folder="issues"
          />
        </div>
        
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('isAnonymous')}
              className="mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Report anonymously</span>
          </label>
        </div>
        
        <div className="flex gap-4">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <LoadingSpinner size="small" /> : 'Report Issue'}
          </button>
          <button type="button" onClick={() => navigate('/feedback')} className="btn-outline">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default IssueForm;
