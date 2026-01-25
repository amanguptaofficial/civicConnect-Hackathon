import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppLayout from '../components/layout/AppLayout';
import { IoPlay, IoEye } from 'react-icons/io5';

const HomePage = () => {
  return (
    <AppLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
              Report issues.<br />
              Track progress.<br />
              Drive change.
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Empowering communities to solve civic issues in real-time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors shadow-lg hover:shadow-xl"
              >
                <IoPlay className="w-5 h-5" />
                Start Reporting Issues
              </Link>
              
              <Link
                to="/proposals"
                className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 px-8 py-4 rounded-lg text-lg font-medium transition-colors shadow-lg hover:shadow-xl"
              >
                <IoEye className="w-5 h-5" />
                See Report Feed
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default HomePage;
