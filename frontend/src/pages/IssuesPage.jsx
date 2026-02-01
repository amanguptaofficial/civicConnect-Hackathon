import { useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import FeedbackList from '../components/feedback/FeedbackList';
import { STATUSES } from '../utils/constants';
import useAuthStore from '../store/authStore';

const IssuesPage = () => {
  const { isAuthenticated } = useAuthStore();
  const [filters, setFilters] = useState({
    category: 'concern',
    status: '',
    sentiment: '',
    search: '',
    isIssue: true,
  });

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const issueTypes = [
    { value: '', label: 'All Types' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'public_service', label: 'Public Service' },
    { value: 'safety', label: 'Safety & Security' },
    { value: 'environment', label: 'Environmental' },
    { value: 'traffic', label: 'Traffic & Transportation' },
    { value: 'noise', label: 'Noise Pollution' },
    { value: 'waste', label: 'Waste Management' },
    { value: 'other', label: 'Other' },
  ];

  const priorities = [
    { value: '', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reported Issues</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              View and track community-reported issues in your area
            </p>
          </div>
          {isAuthenticated && (
            <Link to="/report-issue" className="btn-primary flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Issue
            </Link>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search issues..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Issue Type</label>
              <select
                value={filters.issueType || ''}
                onChange={(e) => handleFilterChange('issueType', e.target.value)}
                className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              >
                {issueTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
              <select
                value={filters.priority || ''}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              >
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              >
                <option value="">All Statuses</option>
                {STATUSES.feedback.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sentiment</label>
              <select
                value={filters.sentiment}
                onChange={(e) => handleFilterChange('sentiment', e.target.value)}
                className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              >
                <option value="">All Sentiments</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
            </div>
          </div>
        </div>

        <FeedbackList filters={filters} />
      </div>
    </AppLayout>
  );
};

export default IssuesPage;
