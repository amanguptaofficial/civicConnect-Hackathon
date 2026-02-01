import AppLayout from '../components/layout/AppLayout';
import IssueForm from '../components/feedback/IssueForm';

const ReportIssuePage = () => {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto py-12">
        <IssueForm />
      </div>
    </AppLayout>
  );
};

export default ReportIssuePage;
