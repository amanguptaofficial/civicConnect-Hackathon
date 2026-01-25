import AppLayout from '../components/layout/AppLayout';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <AppLayout>
      <div className="max-w-md mx-auto py-12">
        <LoginForm />
      </div>
    </AppLayout>
  );
};

export default LoginPage;
