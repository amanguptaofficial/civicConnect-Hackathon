import AppLayout from '../components/layout/AppLayout';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <AppLayout>
      <div className="max-w-md mx-auto py-12">
        <RegisterForm />
      </div>
    </AppLayout>
  );
};

export default RegisterPage;
