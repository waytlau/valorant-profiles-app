// frontend-new/src/components/Comment.jsx
import React, { useState } from 'react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';

function Comment({ commentData }) {
  const { id, userId, username, comment, timestamp, likes, dislikes } = commentData;
  const [currentLikes, setCurrentLikes] = useState(likes || 0);
  const [currentDislikes, setCurrentDislikes] = useState(dislikes || 0);

  const handleLike = async () => {
    try {
      const commentRef = doc(db, 'comments', id);
      await updateDoc(commentRef, {
        likes: increment(1),
      });
      setCurrentLikes(currentLikes + 1);
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleDislike = async () => {
    try {
      const commentRef = doc(db, 'comments', id);
      await updateDoc(commentRef, {
        dislikes: increment(1),
      });
      setCurrentDislikes(currentDislikes + 1);
    } catch (error) {
      console.error('Error disliking comment:', error);
    }
  };

  return (
    <div className="border p-4 rounded mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">{username}</span>
        <span className="text-sm text-gray-500">
          {new Date(timestamp.seconds * 1000).toLocaleString()}
        </span>
      </div>
      <p className="mb-2">{comment}</p>
      <div className="flex space-x-4">
        <button onClick={handleLike} className="flex items-center text-green-500">
          👍 {currentLikes}
        </button>
        <button onClick={handleDislike} className="flex items-center text-red-500">
          👎 {currentDislikes}
        </button>
      </div>
    </div>
  );
}

export default Comment;
