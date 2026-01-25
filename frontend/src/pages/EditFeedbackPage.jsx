import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import FeedbackForm from '../components/feedback/FeedbackForm';
import { feedbackService } from '../services/feedback.service';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const EditFeedbackPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeedback();
  }, [id]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await feedbackService.getFeedbackItem(id);
      setFeedback(response.data);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="large" />
        </div>
      </AppLayout>
    );
  }

  if (error || !feedback) {
    return (
      <AppLayout>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <ErrorMessage message={error || 'Feedback not found'} />
          <button onClick={() => navigate('/feedback')} className="btn-primary mt-4">
            Back to Feedback
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FeedbackForm feedback={feedback} />
      </div>
    </AppLayout>
  );
};

export default EditFeedbackPage;
