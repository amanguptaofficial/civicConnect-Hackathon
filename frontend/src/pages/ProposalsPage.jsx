import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import ProposalList from '../components/proposals/ProposalList';
import { CATEGORIES, STATUSES, PRIORITIES, TIME_FILTERS } from '../utils/constants';
import useAuthStore from '../store/authStore';

const ProposalsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    priority: '',
    search: '',
    timeFilter: '',
  });
  const [searchInput, setSearchInput] = useState('');
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput }));
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchInput]);

  const handleFilterChange = (key, value) => {
    if (key === 'search') {
      setSearchInput(value);
    } else {
      setFilters({ ...filters, [key]: value });
    }
  };

  const handleCreateClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate('/proposals/create');
    } else {
      navigate('/login');
    }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Policy Proposals</h1>
          <button onClick={handleCreateClick} className="btn-primary">
            Create Proposal
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search proposals..."
                value={searchInput}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
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
                {STATUSES.proposal.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              >
                <option value="">All Priorities</option>
                {PRIORITIES.map((pri) => (
                  <option key={pri.value} value={pri.value}>
                    {pri.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time Period</label>
              <select
                value={filters.timeFilter}
                onChange={(e) => handleFilterChange('timeFilter', e.target.value)}
                className="input-field bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              >
                {TIME_FILTERS.map((time) => (
                  <option key={time.value} value={time.value}>
                    {time.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <ProposalList filters={filters} />
      </div>
    </AppLayout>
  );
};

export default ProposalsPage;
