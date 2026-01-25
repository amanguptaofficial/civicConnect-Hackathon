import { useState, useRef, useEffect } from 'react';
import { IoChatbubbleEllipses, IoClose, IoMic, IoMicOff, IoPaperPlane, IoVolumeHigh } from 'react-icons/io5';
import { aiService } from '../../services/ai.service';
import LoadingSpinner from './LoadingSpinner';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm CivicAssist, your AI-powered civic engagement assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { text: 'How do I report a civic issue?', action: () => handleQuickAction('How do I report a civic issue?') },
    { text: 'Take me to the dashboard', action: () => window.location.href = '/dashboard' },
    { text: 'How to create a new proposal?', action: () => handleQuickAction('How to create a new proposal?') },
    { text: 'Show me the proposals feed', action: () => window.location.href = '/proposals' },
  ];

  const handleQuickAction = (text) => {
    setInput(text);
    handleSend(text);
  };

  const handleSend = async (text = input) => {
    if (!text.trim() || loading) return;

    const userMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await aiService.generateSummary(text);
      let assistantResponse = '';

      if (text.toLowerCase().includes('report') || text.toLowerCase().includes('issue')) {
        assistantResponse = "To report a civic issue:\n\n1. Click on 'Create Proposal' or go to /proposals/create\n2. Fill in the title and description\n3. Select a category (Education, Healthcare, Infrastructure, etc.)\n4. Add location on map (optional)\n5. Upload images (optional)\n6. Submit your proposal\n\nYour proposal will be reviewed by government officials!";
      } else if (text.toLowerCase().includes('proposal') || text.toLowerCase().includes('create')) {
        assistantResponse = "To create a proposal:\n\n1. Navigate to the 'Proposals' page\n2. Click 'Create Proposal' button\n3. Fill in all required fields\n4. Use AI summary feature for better categorization\n5. Add location and images for better context\n6. Submit and track your proposal status";
      } else if (text.toLowerCase().includes('dashboard')) {
        assistantResponse = "I'll take you to your dashboard where you can see your proposals, feedback, and engagement stats!";
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else if (text.toLowerCase().includes('feed') || text.toLowerCase().includes('proposals')) {
        assistantResponse = "I'll show you all active proposals where you can vote, comment, and engage with your community!";
        setTimeout(() => {
          window.location.href = '/proposals';
        }, 1000);
      } else {
        assistantResponse = response.data?.summary || "I can help you with:\n\n• Reporting civic issues\n• Creating proposals\n• Navigating the platform\n• Understanding features\n\nTry asking me about reporting issues or creating proposals!";
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: assistantResponse }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm here to help! You can:\n\n• Report civic issues\n• Create proposals\n• View proposals and feedback\n• Track your submissions\n\nWhat would you like to do?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all flex items-center justify-center z-50"
        aria-label="Open chatbot"
      >
        <IoChatbubbleEllipses className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <IoChatbubbleEllipses className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">CivicAssist</h3>
            <p className="text-xs opacity-90">AI Assistant</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="w-8 h-8 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
        >
          <IoClose className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2">
              <LoadingSpinner size="small" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 mb-2">Or try one of these prompts:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.action}
                className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-50 transition-colors"
              >
                {action.text}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask CivicAssist anything..."
            className="flex-1 input-field text-sm py-2"
            disabled={loading}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="w-10 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            <IoPaperPlane className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
