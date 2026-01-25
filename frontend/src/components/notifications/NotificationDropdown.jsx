import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { notificationsService } from '../../services/notifications.service';

const NotificationDropdown = ({ notifications, isOpen, onClose, onNotificationClick, onMarkAllRead }) => {
  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await notificationsService.markAsRead(notification._id);
      if (onNotificationClick) onNotificationClick();
      if (onMarkAllRead) onMarkAllRead();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">Notifications</h3>
        {notifications.length > 0 && (
          <button
            onClick={async () => {
              await notificationsService.markAllAsRead();
              if (onMarkAllRead) onMarkAllRead();
            }}
            className="text-sm text-primary hover:underline"
          >
            Mark all read
          </button>
        )}
      </div>
      {notifications.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No notifications</div>
      ) : (
        <div>
          {notifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() => handleNotificationClick(notification)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                !notification.isRead ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-sm">{notification.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-primary rounded-full ml-2"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="p-4 border-t text-center">
        <Link to="/notifications" className="text-sm text-primary hover:underline">
          View all notifications
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;
