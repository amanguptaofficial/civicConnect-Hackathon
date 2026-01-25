import { useState, useEffect, useCallback, useRef } from 'react';
import { proposalsService } from '../../services/proposals.service';
import ProposalCard from './ProposalCard';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import Pagination from '../common/Pagination';
import { useNavigate } from 'react-router-dom';

const ProposalList = ({ filters = {} }) => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const navigate = useNavigate();
  const filtersRef = useRef(null);
  const pageRef = useRef(null);
  const isInitialMount = useRef(true);

  const fetchProposals = useCallback(async (currentFilters, currentPage) => {
    try {
      setLoading(true);
      const response = await proposalsService.getProposals({
        page: currentPage,
        limit: 10,
        ...currentFilters,
      });
      setProposals(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to fetch proposals:', error);
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
      fetchProposals(filters, pagination.page);
    }
  }, [filters, pagination.page, fetchProposals]);

  const handleProposalClick = (id) => {
    navigate(`/proposals/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <EmptyState
        title="No proposals found"
        message="Be the first to create a proposal!"
        actionLabel="Create Proposal"
        onAction={() => navigate('/proposals/create')}
      />
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proposals.map((proposal) => (
          <ProposalCard 
            key={proposal._id} 
            proposal={proposal} 
            onClick={handleProposalClick}
            onStatusUpdate={() => fetchProposals(filters, pagination.page)}
          />
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

export default ProposalList;
