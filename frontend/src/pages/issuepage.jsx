import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from './issue';

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const response = await axios.get('http://localhost:3000/getPosts');
    setPosts(response.data.posts);
  };

  const createPost = async () => {
    const response = await axios.post('http://localhost:3000/createPost', {
      userId: localStorage.getItem('userId'),
      title,
      content
    });
    if (response.data.success) {
      fetchPosts();
      setTitle('');
      setContent('');
    }
  };


  const commentPost = async (postId, comment) => {
    await axios.post('http://localhost:3000/commentPost', {
      userId: localStorage.getItem('userId'),
      postId,
      content: comment
    });
    fetchPosts();
  };


  const deletePost = async (postId) => {
    await axios.post('http://localhost:3000/deletePost', {
      userId: localStorage.getItem('userId'),
      postId
    });
    fetchPosts();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>
      <div className="mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="border text-black p-2 w-full mb-2"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          className="border text-black p-2 w-full mb-2"
        ></textarea>
        <button onClick={createPost} className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Post
        </button>
      </div>
      {posts.map(post => (
        <Post
          key={post._id}
          post={post}
          onComment={commentPost}
          onDelete={deletePost}
        />
      ))}
    </div>
  );
};

export default PostsPage;
