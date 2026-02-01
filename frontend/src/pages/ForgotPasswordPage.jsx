import AppLayout from '../components/layout/AppLayout';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';

const ForgotPasswordPage = () => {
  return (
    <AppLayout>
      <div className="max-w-md mx-auto py-12">
        <ForgotPasswordForm />
      </div>
    </AppLayout>
  );
};

export default ForgotPasswordPage;
