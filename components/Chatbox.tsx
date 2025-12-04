import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, Loader2, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

export const Chatbox: React.FC = () => {
  const { user } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      senderId: 'ai',
      text: 'Chào bạn! Tôi là BizBot. Tôi có thể giúp gì cho việc quản lý công việc của bạn hôm nay?',
      timestamp: Date.now(),
      isRead: true,
      type: 'text'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: user?.id || 'guest',
      text: inputText,
      timestamp: Date.now(),
      isRead: false,
      type: 'text'
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setIsTyping(true);

    // Call Gemini AI
    try {
        const aiResponseText = await sendMessageToGemini(newMsg.text, []);
        
        const aiMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            senderId: 'ai',
            text: aiResponseText,
            timestamp: Date.now(),
            isRead: true,
            type: 'text'
        };
        setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
        // Fallback or error handled in service, but robust here
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700 transition-all animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-blue-600 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600">
                  <Bot size={24} />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-blue-600"></div>
              </div>
              <div>
                <h3 className="font-bold text-sm">Hỗ trợ khách hàng</h3>
                <p className="text-xs text-blue-100">Trả lời tự động 24/7</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900 space-y-4">
            {messages.map((msg) => {
              const isAi = msg.senderId === 'ai';
              return (
                <div key={msg.id} className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}>
                  {isAi && (
                     <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-slate-700 flex items-center justify-center mr-2 flex-shrink-0">
                       <Bot size={16} className="text-blue-600 dark:text-blue-400" />
                     </div>
                  )}
                  <div className={`max-w-[75%] p-3 rounded-2xl text-sm shadow-sm ${
                    isAi 
                      ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-700' 
                      : 'bg-blue-600 text-white rounded-tr-none'
                  }`}>
                    {msg.text}
                    <div className={`text-[10px] mt-1 opacity-70 ${isAi ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {isTyping && (
               <div className="flex justify-start">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-slate-700 flex items-center justify-center mr-2">
                     <Bot size={16} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                  </div>
               </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
             {/* Quick Actions (Simulated) */}
             <div className="flex gap-2 overflow-x-auto pb-2 mb-1 no-scrollbar">
                <button 
                  onClick={() => setInputText("Làm sao để tạo công việc mới?")}
                  className="whitespace-nowrap px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Tạo công việc?
                </button>
                <button 
                  onClick={() => setInputText("Xem báo cáo KPI ở đâu?")}
                  className="whitespace-nowrap px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Báo cáo KPI
                </button>
             </div>

             <div className="flex items-center gap-2">
                <button className="text-slate-400 hover:text-blue-600 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                  <ImageIcon size={20} />
                </button>
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={handleSend}
                  disabled={!inputText.trim() || isTyping}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white p-2 rounded-full transition-all shadow-md"
                >
                  {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'scale-0' : 'scale-100'} transition-transform duration-200 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center relative group`}
      >
        <MessageCircle size={28} />
        <span className="absolute right-0 top-0 w-3 h-3 bg-red-500 rounded-full"></span>
        <div className="absolute right-full mr-3 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Hỗ trợ ngay
        </div>
      </button>
    </div>
  );
};
