import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { getStreamingChatResponse } from '../../services/geminiService';
import * as dbService from '../../services/dbService';
import type { ChatMessage } from '../../types';
import LogoIcon from '../icons/LogoIcon';
import ChatIcon from '../icons/ChatIcon';
import { Sparkles } from 'lucide-react';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await dbService.getAllChatMessages();
        if (history.length > 0) {
          setMessages(history);
        }
      } catch (error) {
        console.error("Failed to load chat history from IndexedDB", error);
      } finally {
        setIsHistoryLoading(false);
      }
    };
    loadHistory();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = async (e: FormEvent, messageText?: string) => {
    e.preventDefault();
    const currentMessage = messageText || input;
    if (!currentMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = { id: `user-${Date.now()}`, text: currentMessage, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    await dbService.addChatMessage(userMessage);

    setInput('');
    setIsLoading(true);

    const aiMessageId = `ai-${Date.now()}`;
    const aiTypingMessage: ChatMessage = { id: aiMessageId, text: '', sender: 'ai', isTyping: true };
    setMessages(prev => [...prev, aiTypingMessage]);

    let fullResponse = '';
    try {
        const stream = getStreamingChatResponse([...messages, userMessage], currentMessage);
        for await (const chunk of stream) {
            fullResponse += chunk;
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === aiMessageId ? { ...msg, text: fullResponse, isTyping: true } : msg
                )
            );
        }
    } catch(error) {
        console.error("Error in chat stream:", error);
        fullResponse = "An error occurred while fetching the response.";
    } finally {
        setIsLoading(false);
        const suggestions = ["HINT: What's the next step?", "REFINE: Explain that differently.", "SUGGEST: Show me an example."];
        const finalAiMessage: ChatMessage = { id: aiMessageId, text: fullResponse, sender: 'ai', isTyping: false, suggestions };
        setMessages(prev =>
            prev.map(msg =>
                msg.id === aiMessageId ? finalAiMessage : msg
            )
        );
        await dbService.updateChatMessage(finalAiMessage);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const fakeEvent = { preventDefault: () => {} } as FormEvent;
    handleSendMessage(fakeEvent, suggestion);
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-brand-bg backdrop-blur-md rounded-xl border border-gray-800 shadow-2xl">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-xl font-semibold text-white">Dev Assistant Chat</h2>
        <p className="text-sm text-gray-400">Your conversation is saved automatically.</p>
      </div>
      <div className="flex-1 p-6 overflow-y-auto space-y-2">
        {isHistoryLoading ? (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-purple"></div>
                <p className="ml-4 text-gray-400">Loading chat history...</p>
            </div>
        ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <ChatIcon className="w-24 h-24 mb-4"/>
                <h2 className="text-2xl font-semibold text-gray-300">Start a Conversation</h2>
                <p className="mt-2">Ask the Dev Assistant anything about your projects, builds, or deployments.</p>
            </div>
        ) : (
            messages.map((message, index) => (
              <div key={message.id}>
                <div className={`flex items-start gap-4 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                   {message.sender === 'ai' && (
                      <div className="w-10 h-10 flex-shrink-0 bg-neon-purple rounded-full flex items-center justify-center text-white">
                        <LogoIcon />
                      </div>
                    )}
                  <div className={`max-w-lg p-4 rounded-2xl ${message.sender === 'user' ? 'bg-neon-blue text-black font-medium rounded-br-none shadow-lg shadow-neon-blue/20' : 'bg-gray-700/50 text-gray-200 rounded-bl-none'}`}>
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    {message.isTyping && <span className="inline-block w-2 h-4 bg-white animate-pulse ml-2" />}
                  </div>
                   {message.sender === 'user' && (
                      <img src="https://picsum.photos/seed/user/40/40" alt="User" className="w-10 h-10 rounded-full" />
                    )}
                </div>
                {message.sender === 'ai' && message.suggestions && index === messages.length -1 && (
                  <div className="flex justify-start pl-14 pt-3 gap-2">
                    {message.suggestions.map((s, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleSuggestionClick(s)}
                        className="flex items-center gap-2 bg-gray-700/50 text-gray-300 px-3 py-1.5 rounded-lg text-sm hover:bg-neon-purple/30 transition-colors"
                      >
                        <Sparkles size={14} className="text-neon-purple" />
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))
        )}
         <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-800 bg-brand-surface/50 rounded-b-xl">
        <form onSubmit={handleSendMessage} className="flex items-center gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 bg-black/30 text-gray-200 placeholder-gray-500 border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-neon-purple transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-neon-purple text-white font-semibold py-3 px-6 rounded-lg hover:shadow-neon-glow-purple disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
