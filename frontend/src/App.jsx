import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProposalsPage from './pages/ProposalsPage';
import ProposalDetailPage from './pages/ProposalDetailPage';
import CreateProposalPage from './pages/CreateProposalPage';
import EditProposalPage from './pages/EditProposalPage';
import FeedbackPage from './pages/FeedbackPage';
import FeedbackDetailPage from './pages/FeedbackDetailPage';
import CreateFeedbackPage from './pages/CreateFeedbackPage';
import EditFeedbackPage from './pages/EditFeedbackPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import AnalyticsPage from './pages/AnalyticsPage';
import MapViewPage from './pages/MapViewPage';
import GovernmentDashboardPage from './pages/GovernmentDashboardPage';
import AdminPage from './pages/AdminPage';
import AdminSigninPage from './pages/AdminSigninPage';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PolicymakerRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (user?.role !== 'policymaker' && user?.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/signin" element={<AdminSigninPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/government"
          element={
            <PolicymakerRoute>
              <GovernmentDashboardPage />
            </PolicymakerRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route path="/proposals" element={<ProposalsPage />} />
        <Route path="/proposals/:id" element={<ProposalDetailPage />} />
        <Route
          path="/proposals/create"
          element={
            <PrivateRoute>
              <CreateProposalPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/proposals/:id/edit"
          element={
            <PrivateRoute>
              <EditProposalPage />
            </PrivateRoute>
          }
        />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/feedback/:id" element={<FeedbackDetailPage />} />
        <Route
          path="/feedback/create"
          element={
            <PrivateRoute>
              <CreateFeedbackPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/feedback/:id/edit"
          element={
            <PrivateRoute>
              <EditFeedbackPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <PrivateRoute>
              <EditProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <PolicymakerRoute>
              <AnalyticsPage />
            </PolicymakerRoute>
          }
        />
        <Route path="/map" element={<MapViewPage />} />
      </Routes>
    </Router>
  );
}

export default App;
