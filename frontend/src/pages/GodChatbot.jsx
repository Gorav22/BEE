import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const GodChatbot = () => {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('prompt', prompt);

    try {
      const res = await axios.post('http://127.0.0.1:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResponse(res.data.response);
      setCopySuccess(''); // Reset copy success message
    } catch (error) {
      console.error(error);
      setResponse('Error processing the request. Please try again.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response).then(() => {
      setCopySuccess('Copied!');

      // Clear the "Copied!" message after 5 seconds
      setTimeout(() => {
        setCopySuccess('');
      }, 500);
    }).catch(err => {
      setCopySuccess('Failed to copy!',err);
    });
  };
  
  const [isGridLayout, setIsGridLayout] = useState(false);

  return (
    <>
    <Navbar isGridLayout={isGridLayout} setIsGridLayout={setIsGridLayout} />
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4 text-center">Code Helper Chatbot</h1>
      <form onSubmit={handleSubmit} className="mb-4 space-y-4">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
        />
        <input
          type="text"
          value={prompt}
          onChange={handlePromptChange}
          placeholder="Enter your prompt"
          className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
          required
        />
        <button 
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Analyze
        </button>
      </form>
      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg max-w-full overflow-x-auto max-h-96 overflow-y-auto">
          <pre className="whitespace-pre-wrap text-black break-words">{response} || <img src=""/></pre>
          <button 
            onClick={handleCopy} 
            className="mt-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Copy
          </button>
          {copySuccess && <span className="ml-2 text-green-500">{copySuccess}</span>}
        </div>
      )}
    </div>
    </>
  );
};

export default GodChatbot;
