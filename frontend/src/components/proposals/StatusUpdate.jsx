import { useState } from 'react';
import { proposalsService } from '../../services/proposals.service';
import { STATUSES } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { IoCheckmarkCircle, IoCloseCircle, IoTime, IoDocumentText } from 'react-icons/io5';

const StatusUpdate = ({ proposal, onStatusUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState(proposal?.status || 'pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const statusOptions = STATUSES.proposal.filter(
    (status) => status.value !== 'draft'
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <IoCheckmarkCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <IoCloseCircle className="w-5 h-5 text-red-600" />;
      case 'under_review':
        return <IoTime className="w-5 h-5 text-yellow-600" />;
      case 'implemented':
        return <IoCheckmarkCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <IoDocumentText className="w-5 h-5 text-gray-600" />;
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

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      setError(null);
      await proposalsService.updateStatus(proposal._id, newStatus);
      setSelectedStatus(newStatus);
      setShowDropdown(false);
      if (onStatusUpdate) {
        onStatusUpdate(newStatus);
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const currentStatus = statusOptions.find((s) => s.value === selectedStatus);

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">Status:</label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-medium transition-all ${
              getStatusColor(selectedStatus)
            } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md cursor-pointer'}`}
          >
            {loading ? (
              <LoadingSpinner size="small" />
            ) : (
              <>
                {getStatusIcon(selectedStatus)}
                <span>{currentStatus?.label || 'Pending'}</span>
              </>
            )}
          </button>

          {showDropdown && !loading && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-20 min-w-[200px]">
                {statusOptions.map((status) => (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => handleStatusChange(status.value)}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                      status.value === selectedStatus ? 'bg-blue-50' : ''
                    } ${
                      status.value === 'pending' ? 'border-b border-gray-200' : ''
                    }`}
                  >
                    {getStatusIcon(status.value)}
                    <span className="font-medium">{status.label}</span>
                    {status.value === selectedStatus && (
                      <span className="ml-auto text-blue-600">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      {error && (
        <div className="mt-2">
          <ErrorMessage message={error} onDismiss={() => setError(null)} />
        </div>
      )}
    </div>
  );
};

export default StatusUpdate;
