import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import { ToastProvider } from './contexts/ToastContext';
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
import GoogleCallback from './pages/GoogleCallback';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ReportIssuePage from './pages/ReportIssuePage';
import IssuesPage from './pages/IssuesPage';

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
  console.log(user)
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
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/proposals" element={<ProposalsPage />} />
          <Route path="/issues" element={<IssuesPage />} />
          <Route path="/admin/signin" element={<AdminSigninPage />} />
          <Route
            path="/report-issue"
            element={
              <PrivateRoute>
                <ReportIssuePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/proposals/:id"
            element={
              <PrivateRoute>
                <ProposalDetailPage />
              </PrivateRoute>
            }
          />
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
          <Route
            path="/feedback"
            element={
              <PrivateRoute>
                <FeedbackPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/feedback/:id"
            element={
              <PrivateRoute>
                <FeedbackDetailPage />
              </PrivateRoute>
            }
          />
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
            path="/profile"
            element={
                <ProfilePage />
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
                <EditProfilePage />
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
          <Route
            path="/map"
            element={
              <PrivateRoute>
                <MapViewPage />
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
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
