import { useState, useEffect, useCallback, useRef } from 'react';
import { feedbackService } from '../../services/feedback.service';
import FeedbackCard from './FeedbackCard';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import Pagination from '../common/Pagination';
import { useNavigate } from 'react-router-dom';

const FeedbackList = ({ filters = {} }) => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const navigate = useNavigate();
  const filtersRef = useRef(null);
  const pageRef = useRef(null);
  const isInitialMount = useRef(true);

  const fetchFeedback = useCallback(async (currentFilters, currentPage) => {
    try {
      setLoading(true);
      const response = await feedbackService.getFeedback({
        page: currentPage,
        limit: 10,
        ...currentFilters,
      });
      setFeedback(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to fetch feedback:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const filtersString = JSON.stringify(filters);
    const shouldFetch = 
      isInitialMount.current || 
      filtersRef.current !== filtersString || 
      pageRef.current !== pagination.page;
    
    if (shouldFetch) {
      filtersRef.current = filtersString;
      pageRef.current = pagination.page;
      isInitialMount.current = false;
      fetchFeedback(filters, pagination.page);
    }
  }, [filters, pagination.page, fetchFeedback]);

  const handleFeedbackClick = (id) => {
    navigate(`/feedback/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (feedback.length === 0) {
    return (
      <EmptyState
        title="No feedback found"
        message="Be the first to provide feedback!"
        actionLabel="Create Feedback"
        onAction={() => navigate('/feedback/create')}
      />
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feedback.map((item) => (
          <FeedbackCard key={item._id} feedback={item} onClick={handleFeedbackClick} />
        ))}
      </div>
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={(page) => {
            setPagination((prev) => ({ ...prev, page }));
          }}
        />
      )}
    </div>
  );
};

export default FeedbackList;
