import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { proposalsService } from '../../services/proposals.service';
import { CATEGORIES, PRIORITIES } from '../../utils/constants';
import ErrorMessage from '../common/ErrorMessage';
import LoadingSpinner from '../common/LoadingSpinner';
import useAuthStore from '../../store/authStore';
import LocationPicker from '../common/LocationPicker';
import ImageUpload from '../common/ImageUpload';
import AISummary from '../common/AISummary';

const ProposalForm = ({ proposal = null }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [images, setImages] = useState([]);
  const [aiData, setAiData] = useState(null);
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const description = watch('description');

  useEffect(() => {
    if (!isAuthenticated && !proposal) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate, proposal]);

  useEffect(() => {
    if (proposal) {
      setValue('title', proposal.title);
      setValue('description', proposal.description);
      setValue('category', proposal.category);
      setValue('priority', proposal.priority);
      setValue('tags', proposal.tags?.join(', '));
    }
  }, [proposal, setValue]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Form data:', data);
      
      const proposalData = {
        title: data.title.trim(),
        description: data.description.trim(),
        category: aiData?.category || data.category,
        priority: data.priority || 'medium',
        tags: data.tags ? data.tags.split(',').map((tag) => tag.trim()).filter((tag) => tag.length > 0) : [],
        location: location,
        images: images,
      };

      console.log('Sending proposal data:', proposalData);

      if (proposal) {
        const response = await proposalsService.updateProposal(proposal._id, proposalData);
        console.log('Update response:', response);
        navigate(`/proposals/${proposal._id}`);
      } else {
        const response = await proposalsService.createProposal(proposalData);
        console.log('Create response:', response);
        navigate('/proposals');
      }
    } catch (err) {
      console.error('Proposal creation error:', err);
      console.error('Error response:', err.response);
      
      let errorMessage = 'Failed to save proposal';
      
      if (err.response?.data?.error) {
        if (err.response.data.error.details && Array.isArray(err.response.data.error.details)) {
          const details = err.response.data.error.details.map((d) => d.msg || d.message || JSON.stringify(d)).join(', ');
          errorMessage = `Validation failed: ${details}`;
        } else {
          errorMessage = err.response.data.error.message || JSON.stringify(err.response.data.error);
        }
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.status === 401) {
        errorMessage = 'Please login to create a proposal';
        setTimeout(() => navigate('/login'), 2000);
      } else if (err.response?.status === 400) {
        errorMessage = 'Invalid data. Please check all fields.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated && !proposal) {
    return null;
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">{proposal ? 'Edit Proposal' : 'Create Proposal'}</h2>
      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} onDismiss={() => setError(null)} />
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            {...register('title', { required: 'Title is required', minLength: { value: 5, message: 'Title must be at least 5 characters' } })}
            className="input-field"
            placeholder="Enter proposal title"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            {...register('description', { required: 'Description is required', minLength: { value: 20, message: 'Description must be at least 20 characters' } })}
            rows={6}
            className="input-field"
            placeholder="Describe your proposal in detail"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          {description && description.length >= 20 && (
            <AISummary
              text={description}
              onSummaryGenerated={(data) => {
                setAiData(data);
                if (data.category && !watch('category')) {
                  setValue('category', data.category);
                }
              }}
            />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location (Optional)
          </label>
          <LocationPicker
            onLocationSelect={setLocation}
            initialPosition={proposal?.location?.coordinates}
            address={proposal?.location?.address}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Images (Optional)
          </label>
          <ImageUpload
            onUploadComplete={setImages}
            maxFiles={5}
            existingImages={proposal?.images || []}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select 
              id="category"
              {...register('category', { required: 'Category is required' })} 
              className="input-field"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
          </div>
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select 
              id="priority"
              {...register('priority')} 
              className="input-field" 
              defaultValue="medium"
            >
              {PRIORITIES.map((pri) => (
                <option key={pri.value} value={pri.value}>
                  {pri.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            Tags (comma separated)
          </label>
          <input 
            id="tags"
            type="text" 
            {...register('tags')} 
            className="input-field" 
            placeholder="e.g., education, school, policy"
          />
          <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
          <button 
            type="submit" 
            className="btn-primary flex-1 sm:flex-none min-w-[150px]" 
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="small" />
                <span>Creating...</span>
              </span>
            ) : (
              proposal ? 'Update Proposal' : 'Create Proposal'
            )}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/proposals')} 
            className="btn-outline flex-1 sm:flex-none min-w-[150px]"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProposalForm;
