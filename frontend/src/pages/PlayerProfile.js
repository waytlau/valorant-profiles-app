// src/pages/PlayerProfile.js
// frontend-new/src/pages/PlayerProfile.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { fetchLeagueEntries, fetchMatchDetails } from '../api/riotApi';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import Comment from '../components/Comment';


function PlayerProfile() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const [user, loadingAuth, errorAuth] = useAuthState(auth);
  

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
        const commentsRef = collection(db, 'comments');
        const q = query(commentsRef, where('playerId', '==', id));
        const querySnapshot = await getDocs(q);
        const commentsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(commentsList);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchPlayer();
    fetchComments();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!user) {
      alert('You must be logged in to comment.');
      return;
    }
    try {
      await addDoc(collection(db, 'comments'), {
        playerId: id,
        userId: user.uid,
        username: user.displayName || user.email,
        comment: newComment,
        timestamp: serverTimestamp(),
        likes: 0,
        dislikes: 0,
      });
      setNewComment('');
      // Refresh comments
      const commentsRef = collection(db, 'comments');
      const q = query(commentsRef, where('playerId', '==', id));
      const querySnapshot = await getDocs(q);
      const commentsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentsList);
    } catch (error) {
      console.error('Error adding comment:', error);
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
        <div>
      {comments.length > 0 ? (
        comments.map(comment => (
          <Comment key={comment.id} commentData={comment} />
        ))
      ) : (
        <p>No comments yet. Be the first to comment!</p>
      )}
    </div>
      <form onSubmit={handleAddComment} className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Leave a comment..."
            className="w-full border border-gray-300 p-2 rounded-md"
            rows="4"
            required
          ></textarea>
          <button type="submit" className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md">
            Submit Comment
          </button>
        </form>
      </div>
    </div>
  );
}

export default PlayerProfile;
