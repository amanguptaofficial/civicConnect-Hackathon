import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { proposalsService } from '../services/proposals.service';
import { commentsService } from '../services/comments.service';
import VoteButtons from '../components/votes/VoteButtons';
import CommentForm from '../components/comments/CommentForm';
import CommentCard from '../components/comments/CommentCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import MapView from '../components/common/MapView';
import StatusUpdate from '../components/proposals/StatusUpdate';
import useAuthStore from '../store/authStore';
import { formatDistanceToNow } from 'date-fns';
import { IoSparkles, IoLocationOutline, IoImageOutline } from 'react-icons/io5';

const ProposalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [proposal, setProposal] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProposal();
    fetchComments();
  }, [id]);

  const fetchProposal = async () => {
    try {
      setLoading(true);
      const response = await proposalsService.getProposal(id);
      setProposal(response.data);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load proposal');
    } finally {
      setLoading(false);
    }
  };

  const handleVoteUpdate = (voteData) => {
    if (proposal) {
      setProposal({
        ...proposal,
        upvotes: voteData.upvotes,
        downvotes: voteData.downvotes,
        userVote: voteData.vote?.voteType || null,
      });
    }
  };

  const handleStatusUpdate = (newStatus) => {
    if (proposal) {
      setProposal({ ...proposal, status: newStatus });
    }
  };

  const fetchComments = async () => {
    try {
      const response = await commentsService.getComments({ policyProposalId: id });
      setComments(response.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this proposal?')) return;
    try {
      await proposalsService.deleteProposal(id);
      navigate('/proposals');
    } catch (error) {
      console.error('Failed to delete proposal:', error);
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

  if (error || !proposal) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ErrorMessage message={error || 'Proposal not found'} />
        </div>
      </AppLayout>
    );
  }

  const isOwner = user?.id === proposal.authorId?._id || user?.id === proposal.authorId;
  const isPolicymakerOrAdmin = user?.role === 'policymaker' || user?.role === 'admin';

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate(-1)} className="text-primary hover:underline mb-4">
          ← Back
        </button>

        <div className="card mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{proposal.title}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span>By {proposal.authorId?.firstName} {proposal.authorId?.lastName}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(proposal.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
            <div className="flex gap-2">
              {isPolicymakerOrAdmin && (
                <StatusUpdate proposal={proposal} onStatusUpdate={handleStatusUpdate} />
              )}
              {isOwner && (
                <>
                  <Link to={`/proposals/${id}/edit`} className="btn-outline text-sm px-3 py-2">
                    Edit
                  </Link>
                  <button 
                    onClick={handleDelete} 
                    className="btn-outline text-sm px-3 py-2 text-red-600 border-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>

          {proposal.aiSummary && (
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-primary p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <IoSparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">AI Summary</h4>
                  <p className="text-gray-700 text-sm">{proposal.aiSummary}</p>
                </div>
              </div>
            </div>
          )}
          <div className="mb-6">
            <p className="text-gray-700 whitespace-pre-wrap">{proposal.description}</p>
          </div>
          {proposal.images && proposal.images.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <IoImageOutline className="w-5 h-5" />
                Images
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {proposal.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Proposal image ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg border border-gray-300 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(image, '_blank')}
                  />
                ))}
              </div>
            </div>
          )}
          {proposal.location && proposal.location.coordinates && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <IoLocationOutline className="w-5 h-5" />
                Location
              </h3>
              {proposal.location.address && (
                <p className="text-gray-600 mb-2">{proposal.location.address}</p>
              )}
              <MapView items={[proposal]} height="300px" />
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <VoteButtons
              entityId={proposal._id}
              entityType="proposal"
              currentVote={proposal.userVote}
              upvotes={proposal.upvotes}
              downvotes={proposal.downvotes}
              onVoteUpdate={handleVoteUpdate}
            />
            <span className="text-gray-600">👁️ {proposal.viewCount || 0} views</span>
          </div>

          {proposal.governmentResponse && (
            <div className="bg-blue-50 border-l-4 border-primary p-4 rounded mb-6">
              <h3 className="font-semibold mb-2">Government Response</h3>
              <p className="text-gray-700">{proposal.governmentResponse}</p>
              {proposal.responseDate && (
                <p className="text-sm text-gray-500 mt-2">
                  {formatDistanceToNow(new Date(proposal.responseDate), { addSuffix: true })}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Comments ({comments.length})</h2>
          {isAuthenticated ? (
            <CommentForm
              entityId={id}
              entityType="proposal"
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

export default ProposalDetailPage;
