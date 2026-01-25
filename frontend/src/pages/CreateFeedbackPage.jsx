import AppLayout from '../components/layout/AppLayout';
import FeedbackForm from '../components/feedback/FeedbackForm';

const CreateFeedbackPage = () => {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto py-12">
        <FeedbackForm />
      </div>
    </AppLayout>
  );
};

export default CreateFeedbackPage;
