import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Post = ({ post, onLike, onComment, onEdit, onDelete }) => {
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');

  useEffect(() => {
    setLiked(post.likes.includes(localStorage.getItem('userId')));
  }, [post]);

  const handleLike = () => {
    onLike(post._id);
    setLiked(true);
  };

  const handleComment = () => {
    onComment(post._id, comment);
    setComment('');
  };

  const handleEdit = () => {
    onEdit(post._id, post.title, post.content);
  };

  const handleDelete = () => {
    onDelete(post._id);
  };

  return (
    <div className="border p-4 mb-4">
      <h2 className="text-xl font-bold">{post.title}</h2>
      <p>{post.content}</p>
      <div className="mt-2">
        <button onClick={handleComment} className="bg-green-500 text-white px-2 py-1 rounded ml-2">
          Comment
        </button>
        
        <button onClick={handleDelete} className="bg-red-500 text-white px-2 py-1 rounded ml-2">
          Delete
        </button>
      </div>
      <div className="mt-4">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment"
          className="border text-black p-2 w-full"
        />
      </div>
      <div className="mt-4">
        {post.comments.map(comment => (
          <div key={comment._id} className="border p-2 mb-2">
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Post;
