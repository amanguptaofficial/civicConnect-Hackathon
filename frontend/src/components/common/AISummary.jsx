import { useState } from 'react';
import { IoSparkles } from 'react-icons/io5';
import { aiService } from '../../services/ai.service';
import LoadingSpinner from './LoadingSpinner';

const AISummary = ({ text, onSummaryGenerated }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateSummary = async () => {
    if (!text || text.length < 20) {
      setError('Text must be at least 20 characters');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await aiService.generateSummary(text);
      setSummary(response.data.summary);
      if (onSummaryGenerated) {
        onSummaryGenerated(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  if (!text) return null;

  return (
    <div className="mt-4">
      {!summary && (
        <button
          type="button"
          onClick={generateSummary}
          disabled={loading || text.length < 20}
          className="flex items-center gap-2 text-sm text-primary hover:underline disabled:opacity-50"
        >
          {loading ? (
            <>
              <LoadingSpinner size="small" />
              <span>Generating AI Summary...</span>
            </>
          ) : (
            <>
              <IoSparkles className="w-4 h-4" />
              <span>Generate AI Summary</span>
            </>
          )}
        </button>
      )}
      {summary && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-primary p-4 rounded-lg mt-2">
          <div className="flex items-start gap-2 mb-2">
            <IoSparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">AI Summary</h4>
              <p className="text-gray-700 text-sm">{summary}</p>
            </div>
          </div>
        </div>
      )}
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
};

export default AISummary;
