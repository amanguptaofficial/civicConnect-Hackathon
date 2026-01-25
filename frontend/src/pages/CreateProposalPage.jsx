import AppLayout from '../components/layout/AppLayout';
import ProposalForm from '../components/proposals/ProposalForm';

const CreateProposalPage = () => {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProposalForm />
      </div>
    </AppLayout>
  );
};

export default CreateProposalPage;
