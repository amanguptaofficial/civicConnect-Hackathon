import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { analyticsService } from '../services/analytics.service';
import { proposalsService } from '../services/proposals.service';
import { feedbackService } from '../services/feedback.service';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import useAuthStore from '../store/authStore';
import { 
  IoDocumentText, 
  IoCheckmarkCircle, 
  IoTrendingUp, 
  IoPeople,
  IoLocationOutline,
  IoThumbsUp,
  IoTime,
  IoEye,
  IoCreate,
  IoBarChart,
  IoMap,
  IoNotifications
} from 'react-icons/io5';
import { formatDistanceToNow } from 'date-fns';

const GovernmentDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [trendingProposals, setTrendingProposals] = useState([]);
  const [recentProposals, setRecentProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role !== 'policymaker' && user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, proposalsRes] = await Promise.all([
        analyticsService.getDashboardData().catch(() => ({ data: {} })),
        proposalsService.getProposals({ limit: 10, sort: '-upvotes' }).catch(() => ({ data: [] })),
      ]);

      setStats(analyticsRes.data);
      const trending = proposalsRes.data || [];
      setTrendingProposals(trending.slice(0, 5));
      
      const recentRes = await proposalsService.getProposals({ limit: 5, sort: '-createdAt' }).catch(() => ({ data: [] }));
      setRecentProposals(recentRes.data || []);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load dashboard');
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
    return (
      <AppLayout>
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="large" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <ErrorMessage message={error} />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Government Dashboard</h1>
          <p className="text-gray-600">Monitor citizen engagement and manage policy proposals</p>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 mb-8 text-white">
          <h2 className="text-3xl font-bold mb-3">Your Voice Matters</h2>
          <p className="text-lg mb-6 opacity-90">
            Review citizen proposals, track engagement, and make data-driven policy decisions
          </p>
          <div className="flex gap-4">
            <Link
              to="/proposals"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              View All Proposals
            </Link>
            <Link
              to="/analytics"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              View Analytics
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <IoDocumentText className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.totalProposals || 0}
            </h3>
            <p className="text-gray-600 text-sm">Active Proposals</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <IoCheckmarkCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.approvedProposals || 0}
            </h3>
            <p className="text-gray-600 text-sm">Issues Resolved</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <IoTrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.totalVotes || 0}
            </h3>
            <p className="text-gray-600 text-sm">Citizen Votes</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <IoPeople className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.pendingProposals || 0}
            </h3>
            <p className="text-gray-600 text-sm">Pending Reviews</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <IoTrendingUp className="w-6 h-6 text-blue-600" />
                Trending Proposals
              </h2>
              <Link
                to="/proposals?sort=votes"
                className="text-blue-600 hover:underline text-sm"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {trendingProposals.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No trending proposals yet</p>
              ) : (
                trendingProposals.map((proposal, index) => (
                  <div
                    key={proposal._id}
                    onClick={() => navigate(`/proposals/${proposal._id}`)}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 flex-1">
                        {index + 1}. {proposal.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(proposal.status)}`}>
                        {proposal.status === 'pending' ? 'Pending' :
                         proposal.status === 'under_review' ? 'Under Review' :
                         proposal.status === 'approved' ? 'Approved' :
                         proposal.status === 'rejected' ? 'Rejected' :
                         proposal.status === 'implemented' ? 'Implemented' : proposal.status}
                      </span>
                    </div>
                    {proposal.location?.address && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <IoLocationOutline className="w-4 h-4" />
                        <span>{proposal.location.address}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <IoThumbsUp className="w-4 h-4" />
                        {proposal.upvotes || 0} votes
                      </span>
                      <span className="flex items-center gap-1">
                        <IoTime className="w-4 h-4" />
                        {formatDistanceToNow(new Date(proposal.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <IoTime className="w-6 h-6 text-blue-600" />
                Recent Proposals
              </h2>
              <Link
                to="/proposals?sort=recent"
                className="text-blue-600 hover:underline text-sm"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentProposals.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No recent proposals</p>
              ) : (
                recentProposals.map((proposal) => (
                  <div
                    key={proposal._id}
                    onClick={() => navigate(`/proposals/${proposal._id}`)}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 flex-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {proposal.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ml-2 ${getStatusColor(proposal.status)}`}>
                        {proposal.status === 'pending' ? 'Pending' :
                         proposal.status === 'under_review' ? 'Under Review' :
                         proposal.status === 'approved' ? 'Approved' :
                         proposal.status === 'rejected' ? 'Rejected' :
                         proposal.status === 'implemented' ? 'Implemented' : proposal.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                      {proposal.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>By {proposal.authorId?.firstName} {proposal.authorId?.lastName}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(proposal.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/analytics"
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow group"
          >
            <div className="bg-blue-100 p-4 rounded-lg w-fit mb-4 group-hover:bg-blue-200 transition-colors">
              <IoBarChart className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics Dashboard</h3>
            <p className="text-gray-600 text-sm">
              View detailed analytics, trends, and insights
            </p>
          </Link>

          <Link
            to="/map"
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow group"
          >
            <div className="bg-green-100 p-4 rounded-lg w-fit mb-4 group-hover:bg-green-200 transition-colors">
              <IoMap className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Map View</h3>
            <p className="text-gray-600 text-sm">
              See all proposals and issues on an interactive map
            </p>
          </Link>

          <Link
            to="/proposals?status=pending"
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow group"
          >
            <div className="bg-yellow-100 p-4 rounded-lg w-fit mb-4 group-hover:bg-yellow-200 transition-colors">
              <IoNotifications className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Pending Reviews</h3>
            <p className="text-gray-600 text-sm">
              Review and respond to pending proposals
            </p>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
};

export default GovernmentDashboardPage;
