import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { CATEGORIES, STATUSES } from '../../utils/constants';
import { IoSparkles, IoLocationOutline, IoImageOutline } from 'react-icons/io5';
import QuickStatusUpdate from './QuickStatusUpdate';
import useAuthStore from '../../store/authStore';

const ProposalCard = ({ proposal, onClick, onStatusUpdate }) => {
  const { user } = useAuthStore();
  const category = CATEGORIES.find((c) => c.value === proposal.category);
  const status = STATUSES.proposal.find((s) => s.value === proposal.status);
  const isPolicymakerOrAdmin = user?.role === 'policymaker' || user?.role === 'admin';

  return (
    <div
      className="card hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      onClick={() => onClick && onClick(proposal._id)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Link
            to={`/proposals/${proposal._id}`}
            className="text-xl font-semibold text-gray-900 dark:text-white hover:text-primary dark:hover:text-blue-400 transition-colors group-hover:underline"
          >
            {proposal.title}
          </Link>
          {proposal.aiSummary && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1 flex items-center gap-1">
              <span className="text-primary dark:text-blue-400">✨</span>
              {proposal.aiSummary}
            </p>
          )}
          <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{proposal.description}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              category?.value === 'education'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                : category?.value === 'healthcare'
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                : category?.value === 'infrastructure'
                ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            {category?.label}
          </span>
          {isPolicymakerOrAdmin ? (
            <QuickStatusUpdate proposal={proposal} onUpdate={onStatusUpdate} />
          ) : (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                status?.value === 'approved'
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  : status?.value === 'pending'
                  ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                  : status?.value === 'under_review'
                  ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                  : status?.value === 'rejected'
                  ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  : status?.value === 'implemented'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              {status?.label}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span>👍 {proposal.upvotes || 0}</span>
          <span>👎 {proposal.downvotes || 0}</span>
          <span>{formatDistanceToNow(new Date(proposal.createdAt), { addSuffix: true })}</span>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
        <div>
          {proposal.authorId && (
            <span>By {proposal.authorId.firstName} {proposal.authorId.lastName}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {proposal.aiSummary && (
            <span className="flex items-center gap-1 text-primary dark:text-blue-400" title="AI Summary Available">
              <IoSparkles className="w-4 h-4" />
            </span>
          )}
          {proposal.location?.coordinates && proposal.location.coordinates[0] !== 0 && (
            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400" title="Location Available">
              <IoLocationOutline className="w-4 h-4" />
            </span>
          )}
          {proposal.images && proposal.images.length > 0 && (
            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400" title={`${proposal.images.length} image(s)`}>
              <IoImageOutline className="w-4 h-4" />
              <span>{proposal.images.length}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalCard;
