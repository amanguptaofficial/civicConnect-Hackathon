import { useState } from 'react';
import { commentsService } from '../../services/comments.service';

const CommentForm = ({ parentId, entityId, entityType, onSubmit }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);
      const commentData = {
        [entityType === 'proposal' ? 'policyProposalId' : 'feedbackId']: entityId,
        parentCommentId: parentId,
        content: content.trim(),
      };
      const response = await commentsService.createComment(commentData);
      setContent('');
      if (onSubmit) onSubmit(response.data);
    } catch (error) {
      console.error('Failed to create comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        rows={3}
        className="input-field w-full"
      />
      <div className="flex justify-end mt-2">
        <button type="submit" className="btn-primary" disabled={loading || !content.trim()}>
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
