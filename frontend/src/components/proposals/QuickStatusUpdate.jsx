import { useState } from 'react';
import { proposalsService } from '../../services/proposals.service';
import { STATUSES } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';

const QuickStatusUpdate = ({ proposal, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const statusOptions = STATUSES.proposal.filter(s => s.value !== 'draft');

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      await proposalsService.updateStatus(proposal._id, newStatus);
      setShowMenu(false);
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'implemented':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return <LoadingSpinner size="small" />;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(proposal.status)} hover:shadow-md transition-all`}
      >
        {STATUSES.proposal.find(s => s.value === proposal.status)?.label || 'Pending'}
      </button>
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-20 min-w-[180px]">
            {statusOptions.map((status) => (
              <button
                key={status.value}
                onClick={() => handleStatusChange(status.value)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  status.value === proposal.status ? 'bg-blue-50' : ''
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default QuickStatusUpdate;
