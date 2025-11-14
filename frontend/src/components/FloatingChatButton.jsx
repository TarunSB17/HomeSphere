import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import axios from '../utils/axios';

const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'agent', text: "Hi! I'm here to help you find your dream home. What are you looking for?", time: 'Just now' }
  ]);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = message.trim();
    if (!text || sending) return;
    setMessage('');
    setMessages((prev) => [...prev, { role: 'user', text, time: 'Just now' }]);
    try {
      setSending(true);
      const { data } = await axios.post('/agent/chat', { message: text });
      const reply = data?.reply || 'Sorry, I had trouble responding.';
      setMessages((prev) => [...prev, { role: 'agent', text: reply, time: 'Just now' }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'agent', text: 'Network error. Please try again.', time: 'Just now' }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96"
          >
            <div className="backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-glass-lg overflow-hidden border border-white/20 dark:border-gray-700/20">
              {/* Header */}
              <div className="bg-gradient-primary p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Chat with Agent</h3>
                    <p className="text-white/80 text-xs">We're online now!</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="h-64 overflow-y-auto p-4 space-y-3">
                {messages.map((m, idx) => (
                  <div key={idx} className={`flex items-start space-x-2 ${m.role === 'user' ? 'justify-end' : ''}`}>
                    {m.role === 'agent' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">A</span>
                      </div>
                    )}
                    <div className={`${m.role === 'agent' ? 'bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-none' : 'bg-primary-600 text-white rounded-2xl rounded-tr-none'} px-4 py-2 max-w-[70%]`}>
                      <p className={`text-sm ${m.role === 'agent' ? 'text-gray-700 dark:text-gray-200' : 'text-white'}`}>{m.text}</p>
                      <span className={`text-xs ${m.role === 'agent' ? 'text-gray-500 dark:text-gray-400' : 'text-white/80'}`}>{m.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 border-none outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="submit"
                    disabled={!message.trim() || sending}
                    className="w-10 h-10 rounded-xl bg-gradient-primary text-white flex items-center justify-center hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-primary text-white shadow-glass-lg flex items-center justify-center hover:shadow-2xl transition-shadow duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: isOpen
            ? '0 8px 32px 0 rgba(31, 38, 135, 0.25)'
            : '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </motion.div>

        {/* Notification Badge */}
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold"
          >
            1
          </motion.div>
        )}
      </motion.button>
    </>
  );
};

export default FloatingChatButton;
