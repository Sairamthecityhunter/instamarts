import React, { useState, useEffect, useRef } from 'react';
import { FiMessageCircle, FiX, FiSend, FiHeadphones } from 'react-icons/fi';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

interface LiveChatProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const LiveChat: React.FC<LiveChatProps> = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! Welcome to Instamart support. How can I help you with your India-to-USA order today?',
      sender: 'agent',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAutomatedResponse(newMessage),
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const getAutomatedResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
      return 'Our international shipping from India to USA typically takes 7-15 business days. All customs duties and taxes are included in your checkout total. Would you like me to check the status of a specific order?';
    }
    
    if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
      return 'We offer a 30-day return policy for most items. For returns, please provide your order number and I\'ll help you start the return process. Damaged items are eligible for full refunds including shipping costs.';
    }
    
    if (lowerMessage.includes('payment') || lowerMessage.includes('card')) {
      return 'We accept all major credit cards through our secure Stripe payment system. Your payment is processed in USD and includes all applicable taxes and duties. Is there a specific payment issue I can help with?';
    }
    
    if (lowerMessage.includes('track') || lowerMessage.includes('order')) {
      return 'I can help you track your order! Please provide your order number (starts with ORD) and I\'ll give you the latest status and tracking information.';
    }
    
    if (lowerMessage.includes('customs') || lowerMessage.includes('duty')) {
      return 'All customs duties, import fees, and US sales tax are calculated and included in your total at checkout. You won\'t have any surprise fees when your package arrives. The total you see is what you pay!';
    }
    
    return 'Thank you for contacting Instamart support! I\'m here to help with any questions about your Indian grocery orders. For complex issues, I can connect you with a human agent. What specific information do you need?';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className="fixed z-50 bg-blue-600 text-white p-3 sm:p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors touch-manipulation
          bottom-[max(1rem,env(safe-area-inset-bottom,0px))]
          right-[max(1rem,env(safe-area-inset-right,0px))]"
        aria-label="Open chat"
      >
        <FiMessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div
      className="fixed z-50 bg-white rounded-lg shadow-xl border flex flex-col
        inset-x-4 sm:inset-x-auto sm:left-auto
        bottom-[max(1rem,env(safe-area-inset-bottom,0px))]
        right-[max(1rem,env(safe-area-inset-right,0px))]
        w-auto sm:w-80
        max-w-[calc(100vw-2rem)] sm:max-w-[20rem]
        h-[min(24rem,calc(100dvh-6rem))] sm:h-96
        max-h-[85dvh]"
    >
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiHeadphones className="w-5 h-5" />
          <div>
            <h3 className="font-semibold">Instamart Support</h3>
            <p className="text-xs text-blue-100">Usually replies instantly</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="text-blue-100 hover:text-white"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-3 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSend className="w-4 h-4" />
          </button>
        </div>
        
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500">
            🇮🇳➡️🇺🇸 International support available 24/7
          </p>
        </div>
      </div>
    </div>
  );
};
