import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { feedbackService } from '../services/feedback.service';
import { commentsService } from '../services/comments.service';
import CommentForm from '../components/comments/CommentForm';
import CommentCard from '../components/comments/CommentCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import useAuthStore from '../store/authStore';
import { formatDistanceToNow } from 'date-fns';

const FeedbackDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [feedback, setFeedback] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeedback();
    fetchComments();
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

  const fetchComments = async () => {
    try {
      const response = await commentsService.getComments({ feedbackId: id });
      setComments(response.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    try {
      await feedbackService.deleteFeedback(id);
      navigate('/feedback');
    } catch (error) {
      console.error('Failed to delete feedback:', error);
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
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ErrorMessage message={error || 'Feedback not found'} />
        </div>
      </AppLayout>
    );
  }

  const isOwner = user?.id === feedback.userId?._id || user?.id === feedback.userId;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate(-1)} className="text-primary hover:underline mb-4">
          ← Back
        </button>

        <div className="card mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{feedback.title}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                {feedback.isAnonymous ? (
                  <span>Anonymous</span>
                ) : (
                  <span>
                    By {feedback.userId?.firstName} {feedback.userId?.lastName}
                  </span>
                )}
                <span>•</span>
                <span>{formatDistanceToNow(new Date(feedback.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
            {isOwner && (
              <div className="flex gap-2">
                <Link to={`/feedback/${id}/edit`} className="btn-outline text-sm px-3 py-2">
                  Edit
                </Link>
                <button 
                  onClick={handleDelete} 
                  className="btn-outline text-sm px-3 py-2 text-red-600 border-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <div className="mb-6">
            <p className="text-gray-700 whitespace-pre-wrap">{feedback.content}</p>
          </div>

          {feedback.policyProposalId && (
            <div className="mb-6">
              <Link
                to={`/proposals/${feedback.policyProposalId._id || feedback.policyProposalId}`}
                className="text-primary hover:underline"
              >
                Related Proposal: {feedback.policyProposalId.title}
              </Link>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Comments ({comments.length})</h2>
          {isAuthenticated ? (
            <CommentForm
              entityId={id}
              entityType="feedback"
              onSubmit={fetchComments}
            />
          ) : (
            <p className="text-gray-600 mb-4">
              <Link to="/login" className="text-primary hover:underline">
                Login
              </Link>{' '}
              to comment
            </p>
          )}
          <div className="mt-6">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <CommentCard key={comment._id} comment={comment} onUpdate={fetchComments} />
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default FeedbackDetailPage;
