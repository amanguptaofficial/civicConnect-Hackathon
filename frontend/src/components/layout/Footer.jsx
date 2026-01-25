import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">CivicConnect</h3>
            <p className="text-gray-400">
              Bridging the gap between citizens and governance through meaningful civic participation.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/proposals" className="hover:text-white transition-colors">
                  Proposals
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="hover:text-white transition-colors">
                  Feedback
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-gray-400">Email: amangupta5132@gmail.com</p>
            <p className="text-gray-400">Phone: +91 7525051783</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 CivicConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
