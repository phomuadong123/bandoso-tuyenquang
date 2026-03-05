import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Xin chào! Mình là iKnow Chatbot của Tỉnh đoàn Tuyên Quang. Mình có thể giúp gì cho bạn?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Thêm tin nhắn user
        const newMsgs = [...messages, { text: input, sender: 'user' }];
        setMessages(newMsgs);
        setInput('');

        // Giả lập bot trả lời
        setTimeout(() => {
            setMessages([...newMsgs, {
                text: "Cảm ơn bạn đã quan tâm. Tính năng tra cứu bằng AI đang trong quá trình thử nghiệm. Vui lòng liên hệ trực tiếp qua số HOTLINE để được hỗ trợ!",
                sender: 'bot'
            }]);
        }, 1000);
    };

    return (
        <div className="chatbot-wrapper">
            {!isOpen && (
                <button className="chatbot-toggle heartbeat-animation" onClick={() => setIsOpen(true)}>
                    <MessageCircle size={28} />
                </button>
            )}

            {isOpen && (
                <div className="chatbot-window glass-panel shadow-lg">
                    <div className="chatbot-header">
                        <div className="bot-info">
                            <div className="bot-avatar gradient-bg"><MessageCircle size={20} /></div>
                            <div>
                                <h4>iKnow Assistant</h4>
                                <span className="online-status">Đang hoạt động</span>
                            </div>
                        </div>
                        <button className="close-btn" onClick={() => setIsOpen(false)}><X size={20} /></button>
                    </div>

                    <div className="chatbot-body">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`message-row ${msg.sender === 'user' ? 'user-row' : 'bot-row'}`}>
                                <div className={`message-bubble ${msg.sender}`}>{msg.text}</div>
                            </div>
                        ))}
                    </div>

                    <div className="chatbot-footer">
                        <form onSubmit={handleSend} className="chat-form">
                            <input
                                type="text"
                                placeholder="Nhập câu hỏi của bạn..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button type="submit" className="send-btn"><Send size={18} /></button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
