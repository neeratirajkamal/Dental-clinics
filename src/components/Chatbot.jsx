import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Calendar, Phone } from 'lucide-react';

export const Chatbot = ({ onBookAppointment }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Welcome to Smile Dental Clinic! How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const dentalServices = {
    'routine checkup': 'Our Routine Checkup includes comprehensive oral examination, cleaning, and preventive care. Duration: 30-45 minutes. Cost: $150.',
    'dental cleaning': 'Professional Dental Cleaning removes plaque and tartar buildup, polishing teeth for a brighter smile. Duration: 45-60 minutes. Cost: $120.',
    'root canal': 'Root Canal Treatment saves infected teeth by removing damaged pulp and sealing the tooth. Duration: 60-90 minutes. Cost: $800-$1200.',
    'teeth whitening': 'Professional Teeth Whitening brightens your smile by several shades using advanced whitening technology. Duration: 60 minutes. Cost: $400.',
    'orthodontics': 'Orthodontic Treatment includes braces, aligners, and other solutions to straighten teeth and correct bite issues. Duration: 12-24 months. Cost: $3000-$7000.',
    'services': 'We offer:\n• Routine Checkup\n• Dental Cleaning\n• Root Canal Treatment\n• Teeth Whitening\n• Orthodontics\n• Emergency Dental Care\n• Cosmetic Dentistry\n• Pediatric Dentistry',
    'hours': 'Our clinic hours:\nMonday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed',
    'contact': 'You can reach us at:\n📞 Phone: +91 6303551518\n📧 Email: info@smiledental.com\n📍 Address: 123 Dental Street, Healthcare City',
    'appointment': 'I can help you book an appointment! Please click the "Book Appointment" button below, and I\'ll guide you through the process.',
    'emergency': 'For dental emergencies, please call us immediately at 6303551518. We provide same-day emergency appointments for urgent cases.',
    'insurance': 'We accept most major dental insurance plans including Delta Dental, Cigna, Aetna, and MetLife. Please bring your insurance card to your appointment.',
    'payment': 'We accept cash, credit cards (Visa, Mastercard, Amex), and offer flexible payment plans for major treatments.'
  };

  const quickReplies = [
    { id: 1, text: 'View Services', icon: '🦷' },
    { id: 2, text: 'Book Appointment', icon: '📅' },
    { id: 3, text: 'Contact Info', icon: '📞' },
    { id: 4, text: 'Clinic Hours', icon: '🕐' }
  ];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputValue('');

    // Process bot response
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue.toLowerCase());
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: botResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  const getBotResponse = (input) => {
    // Check for service keywords
    for (const [key, value] of Object.entries(dentalServices)) {
      if (input.includes(key)) {
        return value;
      }
    }

    // Check for common greetings
    if (input.match(/\b(hi|hello|hey|good morning|good afternoon)\b/)) {
      return 'Hello! How can I help you today? You can ask me about our services, book an appointment, or get our contact information.';
    }

    // Check for booking related queries
    if (input.match(/\b(book|schedule|appointment|reserve)\b/)) {
      return 'Hello! We are from Smile Dental Clinic. Do you want to book an appointment? Click the "Book via WhatsApp" button below to start our automated booking process, or use the "Book Form" for manual entry.';
    }

    // Check for pricing queries
    if (input.match(/\b(price|cost|fee|charge|how much)\b/)) {
      return 'Our pricing varies by service:\n• Routine Checkup: $150\n• Dental Cleaning: $120\n• Root Canal: $800-$1200\n• Teeth Whitening: $400\n• Orthodontics: $3000-$7000\n\nWe accept insurance and offer payment plans!';
    }

    // Default response
    return 'I\'m here to help! You can ask me about:\n• Our dental services\n• Booking appointments\n• Clinic hours and location\n• Pricing and insurance\n• Emergency care\n\nWhat would you like to know?';
  };

  const handleQuickReply = (text) => {
    setInputValue(text);
    handleSendMessage();
  };

  const handleWhatsAppBooking = () => {
    const phoneNumber = "6303551518"; // Updated WhatsApp Business Number
    const message = encodeURIComponent("Hello! I would like to book an appointment at Smile Dental Clinic. Please guide me through the automation flow.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');

    // Also provide feedback in the chat
    const botMessage = {
      id: messages.length + 1,
      type: 'bot',
      text: 'I\'ve connected you to our WhatsApp Business automation! 📱 You can continue your booking there.',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMessage]);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button className="chatbot-fab" onClick={() => setIsOpen(true)}>
          <MessageCircle size={24} />
          <span className="fab-badge">Help</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window card">
          {/* Header */}
          <div className="chatbot-header">
            <div className="header-content">
              <div className="bot-avatar">
                <Bot size={20} />
              </div>
              <div className="header-text">
                <h3>Dental Assistant</h3>
                <span className="status">
                  <span className="status-dot"></span>
                  Online
                </span>
              </div>
            </div>
            <button className="close-chat-btn" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className="message-avatar">
                  {message.type === 'bot' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className="message-content">
                  <div className="message-bubble">
                    {message.text}
                  </div>
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="quick-replies">
            {quickReplies.map((reply) => (
              <button
                key={reply.id}
                className="quick-reply-btn"
                onClick={() => handleQuickReply(reply.text)}
              >
                <span>{reply.icon}</span>
                {reply.text}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="chatbot-actions">
            <button className="action-btn primary" onClick={onBookAppointment}>
              <Calendar size={16} />
              Book Form
            </button>
            <button className="action-btn whatsapp" onClick={handleWhatsAppBooking}>
              <MessageCircle size={16} />
              Book via WhatsApp
            </button>
          </div>

          {/* Input */}
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button className="send-btn" onClick={handleSendMessage} disabled={!inputValue.trim()}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .chatbot-fab {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 60px;
          height: 60px;
          background: var(--primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(13, 148, 136, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 1000;
          border: none;
        }

        .chatbot-fab:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 32px rgba(13, 148, 136, 0.4);
        }

        .fab-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #ef4444;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .chatbot-window {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 380px;
          height: 600px;
          display: flex;
          flex-direction: column;
          z-index: 1000;
          animation: slideUp 0.3s ease;
          overflow: hidden;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .chatbot-header {
          background: linear-gradient(135deg, var(--primary) 0%, #0a7a6f 100%);
          color: white;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 20px 20px 0 0;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .bot-avatar {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-text h3 {
          font-size: 16px;
          font-weight: 700;
          margin: 0;
        }

        .status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          opacity: 0.9;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .close-chat-btn {
          color: white;
          opacity: 0.8;
          transition: opacity 0.2s;
        }

        .close-chat-btn:hover {
          opacity: 1;
        }

        .chatbot-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .message {
          display: flex;
          gap: 8px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .message.user {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .message.bot .message-avatar {
          background: var(--primary);
          color: white;
        }

        .message.user .message-avatar {
          background: #64748b;
          color: white;
        }

        .message-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-width: 70%;
        }

        .message.user .message-content {
          align-items: flex-end;
        }

        .message-bubble {
          padding: 10px 14px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.5;
          white-space: pre-line;
        }

        .message.bot .message-bubble {
          background: white;
          color: var(--text-main);
          border-bottom-left-radius: 4px;
        }

        .message.user .message-bubble {
          background: var(--primary);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message-time {
          font-size: 10px;
          color: var(--text-muted);
          padding: 0 4px;
        }

        .quick-replies {
          display: flex;
          gap: 8px;
          padding: 12px 16px;
          overflow-x: auto;
          background: white;
          border-top: 1px solid #f1f5f9;
        }

        .quick-reply-btn {
          padding: 8px 12px;
          background: #f1f5f9;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-main);
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }

        .quick-reply-btn:hover {
          background: var(--primary);
          color: white;
          transform: translateY(-2px);
        }

        .chatbot-actions {
          display: flex;
          gap: 8px;
          padding: 12px 16px;
          background: white;
          border-top: 1px solid #f1f5f9;
        }

        .action-btn {
          flex: 1;
          padding: 10px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s;
        }

        .action-btn.primary {
          background: var(--primary);
          color: white;
        }

        .action-btn.primary:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
        }

        .action-btn.whatsapp {
          background: #25d366;
          color: white;
        }
 
        .action-btn.whatsapp:hover {
          background: #128c7e;
          transform: translateY(-2px);
        }
 
        .action-btn.secondary {
          background: #f1f5f9;
          color: var(--text-main);
        }

        .action-btn.secondary:hover {
          background: #e2e8f0;
        }

        .chatbot-input {
          display: flex;
          gap: 8px;
          padding: 16px;
          background: white;
          border-top: 1px solid #f1f5f9;
          border-radius: 0 0 20px 20px;
        }

        .chatbot-input input {
          flex: 1;
          padding: 10px 14px;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          font-size: 14px;
          outline: none;
          background: #f8fafc;
        }

        .chatbot-input input:focus {
          border-color: var(--primary);
          background: white;
        }

        .send-btn {
          width: 40px;
          height: 40px;
          background: var(--primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .send-btn:hover:not(:disabled) {
          background: var(--primary-hover);
          transform: scale(1.1);
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .chatbot-window {
            width: calc(100vw - 32px);
            height: calc(100vh - 100px);
            bottom: 16px;
            right: 16px;
          }

          .chatbot-fab {
            bottom: 16px;
            right: 16px;
          }
        }
      ` }} />
    </>
  );
};
