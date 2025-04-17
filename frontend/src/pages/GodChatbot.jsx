import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {marked} from 'marked';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  // Initialize the GoogleGenerativeAI client
  const genAI = new GoogleGenerativeAI('AIzaSyCF0O9-BVUDD_vzkiRND3LWfnZfIzg62E8');
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    // Add user message to the chat
    setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
    setInput('');

    try {
      // Send the message to the generative AI model
      const response = await model.generateContent([input]);

      // Add bot response to the chat
      setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: marked.parse(response.response.text()) }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: 'Sorry, I encountered an error.' }]);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-8 bg-gray-800 shadow-lg rounded-xl overflow-hidden text-white">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-center">Chatbot Assistant</h1>
      </div>
      <div className="h-96 p-4 overflow-y-auto border-b border-gray-700">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 mb-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-900 text-right' : 'bg-gray-700 text-left'}`}
          >
            <strong className={`block ${msg.sender === 'user' ? 'text-blue-300' : 'text-gray-300'}`}>
              {msg.sender === 'user' ? 'You' : 'Bot'}
            </strong>
            {msg.sender==='user' &&(
            <p className={`mt-1 ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-200'}`}>{msg.text}</p>
            )}
            {msg.sender!='user' &&(
            <p className={`mt-1 ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-200'}`} dangerouslySetInnerHTML={{'__html':msg.text}}></p>
            )}
            </div>
        ))}
      </div>
      <div className="p-4 flex flex-col space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
        />
        <div className="flex items-center space-x-4">
          
          <button
            onClick={handleSendMessage}
            className="flex-shrink-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
