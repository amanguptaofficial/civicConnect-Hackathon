import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import useAuthStore from '../store/authStore';
import ProposalList from '../components/proposals/ProposalList';

const DashboardPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'policymaker' || user?.role === 'admin') {
      navigate('/government');
    }
  }, [user, navigate]);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Here's what's happening with your civic engagement</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link to="/proposals" className="card hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Browse Proposals</h3>
            <p className="text-gray-600 dark:text-gray-300">Explore policy proposals from the community</p>
          </Link>
          <Link to="/proposals/create" className="card hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Create Proposal</h3>
            <p className="text-gray-600 dark:text-gray-300">Share your ideas for better governance</p>
          </Link>
          <Link to="/feedback/create" className="card hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Provide Feedback</h3>
            <p className="text-gray-600 dark:text-gray-300">Voice your concerns and suggestions</p>
          </Link>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Recent Proposals</h2>
          <ProposalList />
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
