import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { authService } from '../services/auth.service';
import { proposalsService } from '../services/proposals.service';
import { feedbackService } from '../services/feedback.service';
import ProposalCard from '../components/proposals/ProposalCard';
import FeedbackCard from '../components/feedback/FeedbackCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import useAuthStore from '../store/authStore';

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const [profileUser, setProfileUser] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('proposals');

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  useEffect(() => {
    if (profileUser) {
      if (activeTab === 'proposals') {
        fetchProposals();
      } else {
        fetchFeedback();
      }
    }
  }, [profileUser, activeTab]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      if (userId === 'me' || userId === currentUser?.id || !userId) {
        const response = await authService.getMe();
        setProfileUser(response.data);
      } else {
        const response = await authService.getMe();
        setProfileUser(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchProposals = async () => {
    try {
      const targetUserId = profileUser?._id || profileUser?.id || userId;
      if (targetUserId) {
        const response = await proposalsService.getProposals({ authorId: targetUserId });
        setProposals(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch proposals:', error);
      setProposals([]);
    }
  };

  const fetchFeedback = async () => {
    try {
      const targetUserId = profileUser?._id || profileUser?.id || userId;
      if (targetUserId) {
        const response = await feedbackService.getFeedback({ userId: targetUserId });
        setFeedback(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch feedback:', error);
      setFeedback([]);
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

  if (error || !profileUser) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ErrorMessage message={error || 'Profile not found'} />
        </div>
      </AppLayout>
    );
  }

  const isOwnProfile = 
    currentUser?.id === profileUser?._id || 
    currentUser?.id === profileUser?.id ||
    currentUser?._id === profileUser?._id ||
    currentUser?._id === profileUser?.id ||
    userId === 'me' || 
    !userId ||
    userId === currentUser?.id ||
    userId === currentUser?._id;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card mb-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {(profileUser.firstName?.[0] || 'U')}{(profileUser.lastName?.[0] || '')}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {profileUser.firstName || ''} {profileUser.lastName || ''}
              </h1>
              <p className="text-gray-600 mb-2">{profileUser.email || ''}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                {profileUser.role && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full capitalize">
                    {profileUser.role}
                  </span>
                )}
                {profileUser.city && profileUser.state && (
                  <span>{profileUser.city}, {profileUser.state}</span>
                )}
              </div>
            </div>
            {isOwnProfile && (
              <Link to="/profile/edit" className="btn-outline">
                Edit Profile
              </Link>
            )}
          </div>
        </div>

        <div className="card">
          <div className="border-b mb-6">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('proposals')}
                className={`pb-4 px-4 font-medium transition-colors ${
                  activeTab === 'proposals'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Proposals ({proposals.length})
              </button>
              <button
                onClick={() => setActiveTab('feedback')}
                className={`pb-4 px-4 font-medium transition-colors ${
                  activeTab === 'feedback'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Feedback ({feedback.length})
              </button>
            </div>
          </div>

          <div>
            {activeTab === 'proposals' ? (
              <div>
                {proposals.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No proposals yet</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {proposals.map((proposal) => (
                      <ProposalCard
                        key={proposal._id}
                        proposal={proposal}
                        onClick={(id) => navigate(`/proposals/${id}`)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {feedback.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No feedback yet</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {feedback.map((item) => (
                      <FeedbackCard
                        key={item._id}
                        feedback={item}
                        onClick={(id) => navigate(`/feedback/${id}`)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
