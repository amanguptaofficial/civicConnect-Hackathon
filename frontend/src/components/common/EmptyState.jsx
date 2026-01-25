const EmptyState = ({ title, message, icon: Icon, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {Icon && <Icon className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />}
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">{title}</h3>
      {message && <p className="text-gray-500 dark:text-gray-400 mb-4">{message}</p>}
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary">
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
