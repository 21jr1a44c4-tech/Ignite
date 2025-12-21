import React, { useState, useRef, useEffect } from 'react';
import './WinWireChat.css';

const WinWireChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [userRole, setUserRole] = useState('EMPLOYEE');
  const messagesEndRef = useRef(null);

  // Get backend URL from environment or use relative path for production
  const BACKEND_URL = process.env.REACT_APP_API_URL || '/api';

  // Get user role from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.role) {
          setUserRole(user.role);
          console.log('Chatbot User Role:', user.role);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      // Prepare conversation history (only keep last 10 messages)
      const conversationHistory = messages
        .slice(-10)
        .map((msg) => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
        }));

      // Send message to backend - use correct backend URL
      const apiUrl = `${BACKEND_URL}/chatbot/message`;
      console.log('Calling chatbot API:', apiUrl);
      console.log('User Role:', userRole);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          userRole: userRole,
          conversationHistory: conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get response: ${response.status}`);
      }

      const data = await response.json();

      // Add bot response to chat
      const botMessage = {
        id: Date.now() + 1,
        text: data.response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);

      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="winwire-chat-container">
      <button
        className="chat-toggle-btn"
        onClick={() => setShowChat(!showChat)}
        title="Toggle Chat"
      >
        💬
      </button>

      {showChat && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>WinWire Assistant</h3>
            <div className="chat-actions">
              <button
                className="clear-btn"
                onClick={handleClearChat}
                title="Clear chat history"
              >
                🗑️
              </button>
              <button
                className="close-btn"
                onClick={() => setShowChat(false)}
                title="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="empty-state">
                <p>👋 Hi! I'm the WinWire Assistant.</p>
                <p>Ask me anything about WinWire company!</p>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message ${msg.sender} ${
                      msg.isError ? 'error' : ''
                    }`}
                  >
                    <div className="message-avatar">
                      {msg.sender === 'user' ? '👤' : '🤖'}
                    </div>
                    <div className="message-content">
                      <p>{msg.text}</p>
                      <span className="timestamp">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="message bot">
                    <div className="message-avatar">🤖</div>
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <form className="input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about WinWire..."
              disabled={loading}
              className="message-input"
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="send-btn"
            >
              {loading ? '...' : '➤'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default WinWireChat;
