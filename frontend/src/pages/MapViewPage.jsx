import AppLayout from '../components/layout/AppLayout';
import { useState, useEffect } from 'react';
import { proposalsService } from '../services/proposals.service';
import MapView from '../components/common/MapView';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { CATEGORIES } from '../utils/constants';

const MapViewPage = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchProposals();
  }, [category]);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const response = await proposalsService.getProposals({
        limit: 100,
        category: category || undefined,
      });
      setProposals(response.data);
    } catch (error) {
      console.error('Failed to fetch proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Proposals Map View</h1>
          <p className="text-gray-600">Explore proposals by location on the map</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field max-w-xs"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <div className="card">
            <MapView items={proposals} height="600px" />
            <div className="mt-4 text-sm text-gray-600">
              Showing {proposals.filter((p) => p.location?.coordinates && p.location.coordinates[0] !== 0).length} proposals with locations
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default MapViewPage;
