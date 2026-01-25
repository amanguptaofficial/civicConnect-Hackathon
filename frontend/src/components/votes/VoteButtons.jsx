import { useState } from 'react';
import { IoThumbsUp, IoThumbsDown } from 'react-icons/io5';
import { votesService } from '../../services/votes.service';
import useAuthStore from '../../store/authStore';

const VoteButtons = ({ entityId, entityType, currentVote, upvotes, downvotes, onVoteUpdate }) => {
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleVote = async (voteType) => {
    if (!isAuthenticated) {
      alert('Please login to vote');
      return;
    }

    try {
      setLoading(true);
      const response = await votesService.createVote({
        [entityType === 'proposal' ? 'policyProposalId' : 'commentId']: entityId,
        voteType,
      });
      if (onVoteUpdate) {
        onVoteUpdate(response.data);
      }
    } catch (error) {
      console.error('Failed to vote:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => handleVote('upvote')}
        disabled={loading}
        className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
          currentVote === 'upvote'
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-700 hover:bg-green-50'
        }`}
      >
        <IoThumbsUp className="w-5 h-5" />
        <span>{upvotes || 0}</span>
      </button>
      <button
        onClick={() => handleVote('downvote')}
        disabled={loading}
        className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
          currentVote === 'downvote'
            ? 'bg-red-100 text-red-700'
            : 'bg-gray-100 text-gray-700 hover:bg-red-50'
        }`}
      >
        <IoThumbsDown className="w-5 h-5" />
        <span>{downvotes || 0}</span>
      </button>
    </div>
  );
};

export default VoteButtons;
