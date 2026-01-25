import Header from './Header';
import Footer from './Footer';
import Chatbot from '../common/Chatbot';

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default AppLayout;
