const ErrorMessage = ({ message, onDismiss, type = 'error' }) => {
  const bgColors = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div className={`${bgColors[type]} border rounded-lg p-4 flex items-center justify-between`}>
      <span>{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="ml-4 text-lg font-bold">
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
