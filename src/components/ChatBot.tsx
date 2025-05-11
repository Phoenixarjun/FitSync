'use client';
import React, { useState } from 'react';
import axios from 'axios';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Hello! I\'m your fitness assistant. How can I help you today?', isUser: false }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const formatBotMessage = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-bold text-indigo-300 mt-2 first:mt-0">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.startsWith('• ')) {
        return <p key={i} className="flex"><span className="mr-2">•</span>{line.substring(2)}</p>;
      }
      if (line.startsWith('👍 ')) {
        return <p key={i} className="text-green-400 flex items-center"><span className="mr-2">✓</span>{line.substring(2)}</p>;
      }
      if (line.startsWith('👎 ')) {
        return <p key={i} className="text-red-400 flex items-center"><span className="mr-2">✗</span>{line.substring(2)}</p>;
      }
      if (line.startsWith('*') && line.endsWith('*')) {
        return <p key={i} className="text-gray-400 italic">{line.replace(/\*/g, '')}</p>;
      }
      if (line.trim() === '') {
        return <br key={i} />;
      }
      return <p key={i}>{line}</p>;
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '' || isLoading) return;

    const newUserMessage = {
      id: messages.length + 1,
      text: inputValue,
      isUser: true
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await axios.post("/api/chatbot", {
        input: inputValue
      });

      const botResponse = {
        id: messages.length + 2,
        text: response.data.answer,
        isUser: false
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      const errorMessage = axios.isAxiosError(error) 
        ? error.response?.data?.error || error.message
        : 'Failed to get response from chatbot';
      
      const errorResponse = {
        id: messages.length + 2,
        text: `Sorry, I encountered an error: ${errorMessage}`,
        isUser: false
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={toggleChat}
          className="bg-indigo-600 text-white rounded-full p-3 shadow-lg hover:bg-indigo-700 transition-all duration-300"
          aria-label="Open chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      ) : (
        <div className="w-96 h-[500px] bg-gray-900 rounded-lg shadow-xl flex flex-col border border-gray-700 overflow-hidden">
          {/* Chat header */}
          <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="bg-white rounded-full p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-white font-semibold">Fitness Assistant</h3>
            </div>
            <button
              onClick={toggleChat}
              className="text-gray-400 hover:text-white"
              aria-label="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Messages container */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isUser
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-gray-700 text-gray-100 rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {!message.isUser && (
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-500 flex items-center justify-center mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">
                        {message.isUser ? message.text : formatBotMessage(message.text)}
                      </div>
                      {message.isUser && (
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-800" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className={`text-xs mt-1 ${message.isUser ? 'text-indigo-200' : 'text-gray-400'}`}>
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-gray-100 px-4 py-2 rounded-lg rounded-tl-none max-w-xs">
                    <div className="flex space-x-2 items-center">
                      <div className="animate-pulse flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Thinking...
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input area */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about fitness or nutrition..."
                className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;