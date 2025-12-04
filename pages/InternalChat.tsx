
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Hash, Send, User, MoreVertical, Phone, Video, Info } from 'lucide-react';

export const InternalChat: React.FC = () => {
  const { user, users, channels, groupMessages, sendGroupMessage } = useApp();
  const [activeChannelId, setActiveChannelId] = useState<string>(channels[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeChannel = channels.find(c => c.id === activeChannelId);
  const channelMessages = groupMessages.filter(m => m.channelId === activeChannelId).sort((a,b) => a.timestamp - b.timestamp);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [channelMessages, activeChannelId]);

  const handleSend = () => {
      if(!inputText.trim()) return;
      sendGroupMessage(activeChannelId, inputText);
      setInputText('');
  };

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      
      {/* Sidebar: Channels */}
      <div className="w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="font-bold text-slate-800 dark:text-white">Kênh thảo luận</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-6">
              
              {/* Public Channels */}
              <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase px-3 mb-2">Dự án & Nhóm</h3>
                  <div className="space-y-1">
                      {channels.map(channel => (
                          <button
                            key={channel.id}
                            onClick={() => setActiveChannelId(channel.id)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                                activeChannelId === channel.id 
                                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium' 
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                              <Hash size={16} className="opacity-70" />
                              <span className="truncate">{channel.name}</span>
                          </button>
                      ))}
                  </div>
              </div>

              {/* Direct Messages (Mock) */}
              <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase px-3 mb-2">Tin nhắn trực tiếp</h3>
                  <div className="space-y-1">
                      {users.filter(u => u.id !== user?.id).map(u => (
                          <button
                            key={u.id}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                              <div className="relative">
                                  <img src={u.avatar} className="w-6 h-6 rounded-full" alt=""/>
                                  {u.isOnline && <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white dark:border-slate-900"></div>}
                              </div>
                              <span className="truncate">{u.name}</span>
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-800">
          
          {/* Header */}
          <div className="h-16 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 bg-white dark:bg-slate-800">
              <div className="flex items-center gap-2">
                  <Hash size={24} className="text-slate-400" />
                  <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">{activeChannel?.name}</h3>
                      <p className="text-xs text-slate-500">
                        {activeChannel?.projectId ? 'Thảo luận dự án' : 'Kênh chung'}
                      </p>
                  </div>
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                  <button className="hover:text-blue-600 transition-colors"><Phone size={20}/></button>
                  <button className="hover:text-blue-600 transition-colors"><Video size={20}/></button>
                  <button className="hover:text-blue-600 transition-colors"><Info size={20}/></button>
              </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
              {channelMessages.length > 0 ? channelMessages.map((msg, index) => {
                  const isMe = msg.senderId === user?.id;
                  const sender = users.find(u => u.id === msg.senderId);
                  const showAvatar = index === 0 || channelMessages[index - 1].senderId !== msg.senderId;

                  return (
                      <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                          {showAvatar ? (
                             <img src={sender?.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                             <div className="w-10"></div>
                          )}
                          <div className={`max-w-[70%] space-y-1 ${isMe ? 'items-end flex flex-col' : ''}`}>
                              {showAvatar && !isMe && <span className="text-xs font-bold text-slate-600 dark:text-slate-300 ml-1">{sender?.name}</span>}
                              <div className={`px-4 py-2 rounded-2xl text-sm ${
                                  isMe 
                                  ? 'bg-blue-600 text-white rounded-tr-none' 
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none'
                              }`}>
                                  {msg.text}
                              </div>
                              <span className="text-[10px] text-slate-400 px-1">
                                  {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                          </div>
                      </div>
                  );
              }) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400">
                      <Hash size={48} className="opacity-20 mb-2" />
                      <p>Chưa có tin nhắn nào trong kênh này.</p>
                      <p className="text-sm">Hãy bắt đầu cuộc trò chuyện!</p>
                  </div>
              )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl flex items-center px-4 py-2 gap-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                  <button className="text-slate-400 hover:text-blue-600 p-1">
                      <MoreVertical size={20} className="rotate-90"/>
                  </button>
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={`Nhập tin nhắn tới #${activeChannel?.name}...`}
                    className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-white placeholder-slate-400"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!inputText.trim()}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                      <Send size={18} />
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
};
