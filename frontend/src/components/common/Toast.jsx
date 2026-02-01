import { useEffect, useState } from 'react';

const Toast = ({ message, type = 'info', duration = 60000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        if (onClose) onClose();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    const baseStyles = 'fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 z-50';
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-500 text-white`;
      case 'error':
        return `${baseStyles} bg-red-500 text-white`;
      case 'warning':
        return `${baseStyles} bg-yellow-500 text-white`;
      default:
        return `${baseStyles} bg-blue-500 text-white`;
    }
  };

  if (!isVisible && !message) return null;

  return (
    <div className={`${getToastStyles()} ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className="flex items-center justify-between">
        <span className="font-medium">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => {
              if (onClose) onClose();
            }, 300);
          }}
          className="ml-4 text-white hover:text-gray-200 focus:outline-none"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
