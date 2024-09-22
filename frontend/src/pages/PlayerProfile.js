// src/pages/PlayerProfile.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function PlayerProfile() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch player details
    const fetchPlayer = async () => {
      try {
        // Replace with your backend API endpoint for fetching player details
        const response = await axios.get(`http://localhost:5000/api/players/${id}`);
        setPlayer(response.data);
      } catch (err) {
        setError('Failed to fetch player details.');
      }
    };

    // Fetch player comments
    const fetchComments = async () => {
      try {
        // Replace with your backend API endpoint for fetching comments
        const response = await axios.get(`http://localhost:5000/api/players/${id}/comments`);
        setComments(response.data);
      } catch (err) {
        setError('Failed to fetch comments.');
      }
    };

    fetchPlayer();
    fetchComments();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      // Replace with your backend API endpoint for adding a comment
      const response = await axios.post(`http://localhost:5000/api/players/${id}/comments`, {
        content: newComment,
      });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (err) {
      setError('Failed to add comment.');
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="container mx-auto p-4">
        <p>Loading player details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold">Player Profile: {player.username}</h1>
      <p>Rank: {player.rank}</p>
      <p>Region: {player.region}</p>
      {/* Add more player details as needed */}

      <div className="mt-6">
        <h2 className="text-xl font-bold">Comments</h2>
        <ul className="mt-4">
          {comments.map((comment) => (
            <li key={comment.id} className="border-b py-2">
              {comment.content}
            </li>
          ))}
        </ul>

        <form onSubmit={handleAddComment} className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Leave a comment..."
            className="w-full border border-gray-300 p-2 rounded-md"
            rows="3"
            required
          ></textarea>
          <button type="submit" className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md">
            Add Comment
          </button>
        </form>
      </div>
    </div>
  );
}

export default PlayerProfile;
