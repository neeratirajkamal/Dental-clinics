import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, History, MessageCircle, X, Clock } from 'lucide-react';

export const MessagingSystem = ({ messages, role, onSendMessage, onMarkRead, onClose }) => {
    const [activeTab, setActiveTab] = useState('active');
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    const filteredMessages = messages.filter(m => m.role === role);
    const activeMessages = filteredMessages.filter(m => !m.archived);
    const pastHistory = filteredMessages.filter(m => m.archived);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });

        // Mark unread messages as read when viewed
        const unread = filteredMessages.filter(m => !m.read);
        if (unread.length > 0) {
            unread.forEach(m => onMarkRead(m.id));
        }
    }, [messages, activeTab, filteredMessages, onMarkRead]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        // User message
        onSendMessage({
            role: role,
            type: 'user',
            text: inputValue,
            timestamp: new Date(),
            archived: false,
            read: true
        });

        setInputValue('');

        // Simulate Clinic Response
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            onSendMessage({
                role: role,
                type: 'info',
                text: `Thanks for your message! Our team will get back to you shortly.`,
                timestamp: new Date(),
                archived: false,
                read: false
            });
        }, 2000);
    };

    return (
        <div className="messaging-system card glass animate-pop">
            <div className="messaging-header">
                <div className="header-left">
                    <MessageCircle size={20} className="text-primary" />
                    <h3>Hospitality Inbox</h3>
                </div>
                <div className="header-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
                        onClick={() => setActiveTab('active')}
                    >
                        Active
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        History
                    </button>
                </div>
                <button className="close-btn" onClick={onClose}><X size={18} /></button>
            </div>

            <div className="messaging-body">
                <div className="message-list">
                    {(activeTab === 'active' ? activeMessages : pastHistory).map((msg) => (
                        <div key={msg.id} className={`msg-item ${msg.type === 'user' ? 'own' : ''}`}>
                            <div className="msg-avatar">
                                {msg.type === 'user' ? <User size={14} /> : <Bot size={14} />}
                            </div>
                            <div className="msg-content">
                                <div className="msg-bubble">{msg.text}</div>
                                <span className="msg-time">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="msg-item typing">
                            <div className="msg-avatar"><Bot size={14} /></div>
                            <div className="typing-indicator">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>
            </div>

            {activeTab === 'active' && (
                <div className="messaging-footer">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button className="send-btn" onClick={handleSend} disabled={!inputValue.trim()}>
                        <Send size={18} />
                    </button>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
        .messaging-system {
          position: fixed;
          bottom: 90px;
          right: 24px;
          width: 400px;
          height: 550px;
          display: flex;
          flex-direction: column;
          z-index: 9999;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: 1px solid var(--glass-border);
        }

        .messaging-header {
          padding: 16px 20px;
          background: white;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-left { display: flex; align-items: center; gap: 10px; }
        .header-left h3 { font-size: 16px; font-weight: 750; color: var(--text-main); }

        .header-tabs { display: flex; background: #f8fafc; padding: 4px; border-radius: 10px; gap: 4px; }
        .tab-btn { padding: 6px 12px; font-size: 12px; font-weight: 700; color: var(--text-muted); border-radius: 8px; transition: all 0.2s; }
        .tab-btn.active { background: white; color: var(--primary); box-shadow: var(--shadow-sm); }

        .messaging-body { flex: 1; overflow-y: auto; padding: 20px; background: #fdfdfe; }
        .message-list { display: flex; flex-direction: column; gap: 16px; }

        .msg-item { display: flex; gap: 10px; max-width: 85%; }
        .msg-item.own { align-self: flex-end; flex-direction: row-reverse; }

        .msg-avatar { width: 28px; height: 28px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--text-muted); }
        .msg-item.own .msg-avatar { background: var(--primary); color: white; }

        .msg-bubble { padding: 10px 14px; border-radius: 16px; font-size: 14px; line-height: 1.5; background: white; border: 1px solid #f1f5f9; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
        .msg-item.own .msg-bubble { background: var(--primary); color: white; border: none; }

        .msg-time { font-size: 10px; color: var(--text-muted); margin-top: 4px; display: block; }
        .msg-item.own .msg-time { text-align: right; }

        .messaging-footer { padding: 16px; background: white; border-top: 1px solid #f1f5f9; display: flex; gap: 10px; }
        .messaging-footer input { flex: 1; border: 1px solid #e2e8f0; border-radius: 20px; padding: 10px 16px; font-size: 14px; outline: none; background: #f8fafc; }
        .messaging-footer input:focus { border-color: var(--primary); background: white; }

        .send-btn { width: 40px; height: 40px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .send-btn:hover:not(:disabled) { transform: scale(1.1); background: var(--primary-hover); }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .typing-indicator { display: flex; gap: 4px; padding: 12px 16px; background: white; border-radius: 16px; border: 1px solid #f1f5f9; }
        .typing-indicator span { width: 6px; height: 6px; background: var(--text-muted); border-radius: 50%; animation: typing 1.4s infinite; opacity: 0.4; }
        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); opacity: 1; } }

        @media (max-width: 480px) {
          .messaging-system { width: calc(100vw - 32px); right: 16px; bottom: 80px; height: 500px; }
        }
      ` }} />
        </div>
    );
};
