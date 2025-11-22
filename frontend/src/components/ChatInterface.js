import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './ChatInterface.css';

const ChatInterface = ({ medicalRecords, viewType, onSendMessage }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || !medicalRecords || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Build chat history for API call
      const chatHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await onSendMessage(
        medicalRecords,
        inputValue.trim(),
        chatHistory,
        viewType
      );

      const assistantMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: response.timestamp,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: `Error: ${error.message}`,
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const suggestedQuestions = viewType === 'patient'
    ? [
        'What should I know about my medications?',
        'When is my next appointment?',
        'Are there any test results I should be aware of?',
        'What do my recent lab results mean?',
      ]
    : [
        'Summarize the patient\'s current medication regimen',
        'What are the abnormal lab values?',
        'List all upcoming procedures',
        'Are there any potential drug interactions?',
      ];

  const handleSuggestedQuestion = (question) => {
    setInputValue(question);
    inputRef.current?.focus();
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <div className="chat-title">
          <h3>💬 Ask Questions About Your Records</h3>
          <p className="chat-subtitle">
            {viewType === 'patient'
              ? 'Get answers about your health in simple terms'
              : 'Query patient medical records efficiently'}
          </p>
        </div>
        {messages.length > 0 && (
          <button className="clear-chat-btn" onClick={clearChat}>
            Clear Chat
          </button>
        )}
      </div>

      {messages.length === 0 && (
        <div className="suggested-questions">
          <p className="suggested-title">Suggested questions:</p>
          <div className="suggestions-grid">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                className="suggestion-chip"
                onClick={() => handleSuggestedQuestion(question)}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.role} ${message.isError ? 'error' : ''}`}
          >
            <div className="message-avatar">
              {message.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className="message-content">
              <div className="message-text">
                {message.role === 'assistant' ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  message.content
                )}
              </div>
              <div className="message-timestamp">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant loading">
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
      </div>

      <div className="chat-input-container">
        {!medicalRecords && (
          <div className="chat-disabled-overlay">
            <p>Please upload medical records to start chatting</p>
          </div>
        )}
        <textarea
          ref={inputRef}
          className="chat-input"
          placeholder={
            medicalRecords
              ? 'Type your question here... (Press Enter to send, Shift+Enter for new line)'
              : 'Upload medical records first...'
          }
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!medicalRecords || isLoading}
          rows={3}
        />
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!inputValue.trim() || !medicalRecords || isLoading}
        >
          {isLoading ? '⏳' : '➤'} Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
