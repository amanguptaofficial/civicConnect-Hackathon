import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { feedbackService } from '../../services/feedback.service';
import { FEEDBACK_CATEGORIES } from '../../utils/constants';
import ErrorMessage from '../common/ErrorMessage';
import LoadingSpinner from '../common/LoadingSpinner';
import ImageUpload from '../common/ImageUpload';

const FeedbackForm = ({ feedback = null }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const proposalId = searchParams.get('proposalId');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState(feedback?.images || []);
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const isAnonymous = watch('isAnonymous');

  useEffect(() => {
    if (feedback) {
      setValue('title', feedback.title);
      setValue('content', feedback.content);
      setValue('category', feedback.category);
      setValue('isAnonymous', feedback.isAnonymous);
      setImages(feedback.images || []);
    }
    if (proposalId) {
      setValue('policyProposalId', proposalId);
    }
  }, [feedback, proposalId, setValue]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const feedbackData = {
        ...data,
        policyProposalId: data.policyProposalId || undefined,
        images: images,
      };

      if (feedback) {
        await feedbackService.updateFeedback(feedback._id, feedbackData);
        navigate(`/feedback/${feedback._id}`);
      } else {
        await feedbackService.createFeedback(feedbackData);
        navigate('/feedback');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to save feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{feedback ? 'Edit Feedback' : 'Create Feedback'}</h2>
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {proposalId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              This feedback will be linked to a proposal
            </p>
            <input type="hidden" {...register('policyProposalId')} value={proposalId} />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
          <input
            type="text"
            {...register('title', { required: 'Title is required' })}
            className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
          <textarea
            {...register('content', { required: 'Content is required', minLength: 10 })}
            rows={6}
            className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          />
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
          <select {...register('category', { required: 'Category is required' })} className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
            <option value="">Select category</option>
            {FEEDBACK_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Images (Optional)</label>
          <ImageUpload
            onUploadComplete={setImages}
            maxFiles={5}
            existingImages={images}
            folder="feedback"
          />
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('isAnonymous')}
              className="mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Submit anonymously</span>
          </label>
        </div>
        <div className="flex gap-4">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <LoadingSpinner size="small" /> : feedback ? 'Update' : 'Submit'}
          </button>
          <button type="button" onClick={() => navigate('/feedback')} className="btn-outline">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
