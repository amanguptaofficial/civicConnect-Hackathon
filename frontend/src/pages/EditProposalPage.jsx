import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import ProposalForm from '../components/proposals/ProposalForm';
import { proposalsService } from '../services/proposals.service';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const EditProposalPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProposal();
  }, [id]);

  const fetchProposal = async () => {
    try {
      setLoading(true);
      const response = await proposalsService.getProposal(id);
      setProposal(response.data);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load proposal');
    } finally {
      setLoading(false);
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

  if (error || !proposal) {
    return (
      <AppLayout>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <ErrorMessage message={error || 'Proposal not found'} />
          <button onClick={() => navigate('/proposals')} className="btn-primary mt-4">
            Back to Proposals
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProposalForm proposal={proposal} />
      </div>
    </AppLayout>
  );
};

export default EditProposalPage;
