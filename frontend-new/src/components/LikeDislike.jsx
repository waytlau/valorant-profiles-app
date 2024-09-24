// frontend-new/src/components/LikeDislike.jsx
import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, increment, deleteField } from 'firebase/firestore';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function LikeDislike({ playerId }) {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState(null); // 'like', 'dislike', or null
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const playerRef = doc(db, 'players', playerId);
        const playerSnap = await getDoc(playerRef);
        if (playerSnap.exists()) {
          const data = playerSnap.data();
          setLikes(data.likes || 0);
          setDislikes(data.dislikes || 0);
          if (user && data.userReactions && data.userReactions[user.uid]) {
            setUserReaction(data.userReactions[user.uid]);
          }
        }
      } catch (error) {
        console.error('Error fetching reactions:', error);
      }
    };

    fetchReactions();
  }, [playerId, user]);

  const handleLike = async () => {
    if (!user) {
      alert('You must be logged in to react.');
      return;
    }

    const playerRef = doc(db, 'players', playerId);
    const userId = user.uid;

    try {
      const playerSnap = await getDoc(playerRef);
      if (playerSnap.exists()) {
        const data = playerSnap.data();
        const userReactions = data.userReactions || {};

        if (userReaction === 'like') {
          // Remove like
          await updateDoc(playerRef, {
            likes: increment(-1),
            [`userReactions.${userId}`]: deleteField(),
          });
          setLikes(likes - 1);
          setUserReaction(null);
        } else {
          const updates = {
            likes: increment(1),
            [`userReactions.${userId}`]: 'like',
          };
          if (userReaction === 'dislike') {
            updates.dislikes = increment(-1);
          }
          await updateDoc(playerRef, updates);
          setLikes(likes + 1);
          if (userReaction === 'dislike') {
            setDislikes(dislikes - 1);
          }
          setUserReaction('like');
        }
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleDislike = async () => {
    if (!user) {
      alert('You must be logged in to react.');
      return;
    }

    const playerRef = doc(db, 'players', playerId);
    const userId = user.uid;

    try {
      const playerSnap = await getDoc(playerRef);
      if (playerSnap.exists()) {
        const data = playerSnap.data();
        const userReactions = data.userReactions || {};

        if (userReaction === 'dislike') {
          // Remove dislike
          await updateDoc(playerRef, {
            dislikes: increment(-1),
            [`userReactions.${userId}`]: deleteField(),
          });
          setDislikes(dislikes - 1);
          setUserReaction(null);
        } else {
          const updates = {
            dislikes: increment(1),
            [`userReactions.${userId}`]: 'dislike',
          };
          if (userReaction === 'like') {
            updates.likes = increment(-1);
          }
          await updateDoc(playerRef, updates);
          setDislikes(dislikes + 1);
          if (userReaction === 'like') {
            setLikes(likes - 1);
          }
          setUserReaction('dislike');
        }
      }
    } catch (error) {
      console.error('Error updating dislike:', error);
    }
  };

  return (
    <div className="flex space-x-4 mt-4">
      <button
        onClick={handleLike}
        className={`flex items-center ${userReaction === 'like' ? 'text-blue-500' : 'text-gray-500'}`}
      >
        👍 {likes}
      </button>
      <button
        onClick={handleDislike}
        className={`flex items-center ${userReaction === 'dislike' ? 'text-red-500' : 'text-gray-500'}`}
      >
        👎 {dislikes}
      </button>
    </div>
  );
}

export default LikeDislike;
