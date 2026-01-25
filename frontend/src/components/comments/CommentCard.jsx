import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { commentsService } from '../../services/comments.service';
import useAuthStore from '../../store/authStore';
import VoteButtons from '../votes/VoteButtons';
import CommentForm from './CommentForm';

const CommentCard = ({ comment, onUpdate }) => {
  const { user } = useAuthStore();
  const [showReply, setShowReply] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      setLoading(true);
      await commentsService.deleteComment(comment._id);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      setLoading(true);
      await commentsService.updateComment(comment._id, editContent);
      setIsEditing(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to update comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const isOwner = user?.id === comment.userId?._id || user?.id === comment.userId;

  return (
    <div className="border-b pb-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
          {comment.userId?.firstName?.[0] || 'U'}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">
              {comment.userId?.firstName} {comment.userId?.lastName}
            </span>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
            {comment.isEdited && <span className="text-xs text-gray-400">(edited)</span>}
          </div>
          {isEditing ? (
            <div>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
                className="input-field w-full mb-2"
              />
              <div className="flex gap-2">
                <button onClick={handleEdit} className="btn-primary text-sm" disabled={loading}>
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                  className="btn-outline text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 mb-2">{comment.content}</p>
          )}
          <div className="flex items-center gap-4">
            <VoteButtons
              entityId={comment._id}
              entityType="comment"
              currentVote={comment.userVote}
              upvotes={comment.upvotes}
              downvotes={comment.downvotes}
              onVoteUpdate={onUpdate}
            />
            {!isEditing && (
              <>
                <button
                  onClick={() => setShowReply(!showReply)}
                  className="text-sm text-primary hover:underline"
                >
                  Reply
                </button>
                {isOwner && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-sm text-gray-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="text-sm text-red-600 hover:underline"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </>
                )}
              </>
            )}
          </div>
          {showReply && (
            <div className="mt-4 ml-4">
              <CommentForm
                parentId={comment._id}
                entityId={comment.policyProposalId || comment.feedbackId}
                entityType={comment.policyProposalId ? 'proposal' : 'feedback'}
                onSubmit={() => {
                  setShowReply(false);
                  if (onUpdate) onUpdate();
                }}
              />
            </div>
          )}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 ml-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentCard key={reply._id} comment={reply} onUpdate={onUpdate} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
