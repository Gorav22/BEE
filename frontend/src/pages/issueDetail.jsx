import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api_base_url } from "../helper";

const IssueDetail = () => {
  const { issueId } = useParams();
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchIssueDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${api_base_url}/api/issues/${issueId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch issue details");
      }
      const data = await response.json();
      setIssue(data.issue);
      setComments(data.issue.comments || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssueDetails();
  }, [issueId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`${api_base_url}/api/issues/${issueId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newComment }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const data = await response.json();
      setComments([...comments, data.comment]);
      setNewComment("");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p className="text-center text-white">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!issue) {
    return <p className="text-center text-white">No issue found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">{issue.title}</h1>
      <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-6">
        <p className="text-gray-400">{issue.description}</p>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        <ul className="space-y-4">
          {comments.map((comment, index) => (
            <li key={index} className="bg-gray-800 p-4 rounded-lg shadow-md">
              <p className="text-gray-300">{comment.text}</p>
            </li>
          ))}
        </ul>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddComment();
          }}
          className="mt-4"
        >
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
            required
            className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
          />
          <button
            type="submit"
            className="mt-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add Comment
          </button>
        </form>
      </div>
    </div>
  );
};

export default IssueDetail;
