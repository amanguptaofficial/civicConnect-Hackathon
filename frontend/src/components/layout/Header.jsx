import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { IoNotificationsOutline, IoMenu, IoClose, IoMoon } from 'react-icons/io5';
import { HiSun } from 'react-icons/hi';
import useAuthStore from '../../store/authStore';
import useThemeStore from '../../store/themeStore';
import NotificationDropdown from '../notifications/NotificationDropdown';
import { notificationsService } from '../../services/notifications.service';
import { useEffect } from 'react';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
      fetchNotifications();
    }
  }, [isAuthenticated]);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationsService.getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await notificationsService.getNotifications({ limit: 5 });
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary dark:text-blue-400">CivicConnect</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/proposals" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors font-medium">
              Active Policies
            </Link>
            <Link to="/feedback/create" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors font-medium">
              Report Issue
            </Link>
            {user?.role === 'policymaker' || user?.role === 'admin' ? (
              <>
                <Link to="/government" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors font-medium">
                  Government Portal
                </Link>
                <Link to="/analytics" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors font-medium">
                  Analytics
                </Link>
              </>
            ) : null}
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors font-medium">
                Admin Panel
              </Link>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <HiSun className="w-6 h-6" /> : <IoMoon className="w-6 h-6" />}
            </button>
            {isAuthenticated ? (
              <>
                <div className="relative">
                  <button
                    onClick={() => setNotificationOpen(!notificationOpen)}
                    className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors"
                  >
                    <IoNotificationsOutline className="w-6 h-6" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  {notificationOpen && (
                    <NotificationDropdown
                      notifications={notifications}
                      isOpen={notificationOpen}
                      onClose={() => setNotificationOpen(false)}
                      onNotificationClick={fetchNotifications}
                      onMarkAllRead={fetchUnreadCount}
                    />
                  )}
                </div>
                <Link
                  to={user?.id ? `/profile/${user.id}` : '/profile/me'}
                  className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors"
                >
                  {user?.firstName} {user?.lastName}
                </Link>
                <button onClick={handleLogout} className="btn-outline">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <IoClose className="w-6 h-6" /> : <IoMenu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-4">
              <Link to="/proposals" className="text-gray-700 hover:text-primary font-medium">
                Active Policies
              </Link>
              <Link to="/feedback/create" className="text-gray-700 hover:text-primary font-medium">
                Report Issue
              </Link>
              {isAuthenticated && (user?.role === 'policymaker' || user?.role === 'admin') && (
                <>
                  <Link to="/government" className="text-gray-700 hover:text-primary font-medium">
                    Government Portal
                  </Link>
                  <Link to="/analytics" className="text-gray-700 hover:text-primary font-medium">
                    Analytics
                  </Link>
                </>
              )}
              {isAuthenticated ? (
                <>
                  <Link to={`/profile/${user?.id}`} className="text-gray-700 hover:text-primary font-medium">
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="text-left text-gray-700 hover:text-primary font-medium">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-primary font-medium">
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary w-full text-center">
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
