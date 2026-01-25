import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { FEEDBACK_CATEGORIES, STATUSES } from '../../utils/constants';

const FeedbackCard = ({ feedback, onClick }) => {
  const category = FEEDBACK_CATEGORIES.find((c) => c.value === feedback.category);
  const status = STATUSES.feedback.find((s) => s.value === feedback.status);

  return (
    <div
      className="card hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick && onClick(feedback._id)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Link
            to={`/feedback/${feedback._id}`}
            className="text-xl font-semibold text-gray-900 hover:text-primary transition-colors"
          >
            {feedback.title}
          </Link>
          <p className="text-gray-600 mt-2 line-clamp-2">{feedback.content}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              category?.value === 'suggestion'
                ? 'bg-blue-100 text-blue-800'
                : category?.value === 'concern'
                ? 'bg-red-100 text-red-800'
                : category?.value === 'support'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {category?.label}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              status?.value === 'addressed'
                ? 'bg-green-100 text-green-800'
                : status?.value === 'new'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {status?.label}
          </span>
          {feedback.sentiment && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                feedback.sentiment === 'positive'
                  ? 'bg-green-100 text-green-800'
                  : feedback.sentiment === 'negative'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {feedback.sentiment}
            </span>
          )}
        </div>
        <div className="text-sm text-gray-500">
          {formatDistanceToNow(new Date(feedback.createdAt), { addSuffix: true })}
        </div>
      </div>
      {feedback.userId && !feedback.isAnonymous && (
        <div className="mt-4 pt-4 border-t text-sm text-gray-600">
          By {feedback.userId.firstName} {feedback.userId.lastName}
        </div>
      )}
      {feedback.isAnonymous && (
        <div className="mt-4 pt-4 border-t text-sm text-gray-600">Anonymous</div>
      )}
      {feedback.policyProposalId && (
        <div className="mt-2 text-sm text-primary">
          <Link to={`/proposals/${feedback.policyProposalId._id || feedback.policyProposalId}`}>
            Related to: {feedback.policyProposalId.title}
          </Link>
        </div>
      )}
    </div>
  );
};

export default FeedbackCard;
