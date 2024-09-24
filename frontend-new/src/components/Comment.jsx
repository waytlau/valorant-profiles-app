// frontend-new/src/components/Comment.jsx
import React from 'react';
import { useState } from 'react';
import { doc, updateDoc, increment, deleteField } from 'firebase/firestore';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function Comment({ commentData }) {
  const { id, username, comment, timestamp, likes, dislikes, userId } = commentData;
  const [user] = useAuthState(auth);
  const [likeCount, setLikeCount] = useState(likes || 0);
  const [dislikeCount, setDislikeCount] = useState(dislikes || 0);
  const [userReaction, setUserReaction] = useState(null); // 'like', 'dislike', or null

  // Check if the current user has reacted to this comment
  React.useEffect(() => {
    if (user && commentData.userReactions && commentData.userReactions[user.uid]) {
      setUserReaction(commentData.userReactions[user.uid]);
    }
  }, [user, commentData.userReactions]);

  const handleLike = async () => {
    if (!user) {
      alert('You must be logged in to react.');
      return;
    }

    const commentRef = doc(db, 'comments', id);
    const userId = user.uid;

    try {
      if (userReaction === 'like') {
        // Remove like
        await updateDoc(commentRef, {
          likes: increment(-1),
          [`userReactions.${userId}`]: deleteField(),
        });
        setLikeCount(likeCount - 1);
        setUserReaction(null);
      } else {
        const updates = {
          likes: increment(1),
          [`userReactions.${userId}`]: 'like',
        };
        if (userReaction === 'dislike') {
          updates.dislikes = increment(-1);
        }
        await updateDoc(commentRef, updates);
        setLikeCount(likeCount + 1);
        if (userReaction === 'dislike') {
          setDislikeCount(dislikeCount - 1);
        }
        setUserReaction('like');
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

    const commentRef = doc(db, 'comments', id);
    const userId = user.uid;

    try {
      if (userReaction === 'dislike') {
        // Remove dislike
        await updateDoc(commentRef, {
          dislikes: increment(-1),
          [`userReactions.${userId}`]: deleteField(),
        });
        setDislikeCount(dislikeCount - 1);
        setUserReaction(null);
      } else {
        const updates = {
          dislikes: increment(1),
          [`userReactions.${userId}`]: 'dislike',
        };
        if (userReaction === 'like') {
          updates.likes = increment(-1);
        }
        await updateDoc(commentRef, updates);
        setDislikeCount(dislikeCount + 1);
        if (userReaction === 'like') {
          setLikeCount(likeCount - 1);
        }
        setUserReaction('dislike');
      }
    } catch (error) {
      console.error('Error updating dislike:', error);
    }
  };

  return (
    <div className="border p-4 rounded mb-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <span className="font-semibold">{username}</span>
          <span className="text-gray-500 text-sm ml-2">
            {timestamp?.toDate().toLocaleString() || 'Just now'}
          </span>
        </div>
        {user && user.uid === userId && (
          <button
            onClick={async () => {
              if (window.confirm('Are you sure you want to delete this comment?')) {
                try {
                  await deleteDoc(doc(db, 'comments', id));
                } catch (error) {
                  console.error('Error deleting comment:', error);
                }
              }
            }}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        )}
      </div>
      <p className="mb-2">{comment}</p>
      <div className="flex space-x-4">
        <button
          onClick={handleLike}
          className={`flex items-center ${userReaction === 'like' ? 'text-blue-500' : 'text-gray-500'}`}
        >
          👍 {likeCount}
        </button>
        <button
          onClick={handleDislike}
          className={`flex items-center ${userReaction === 'dislike' ? 'text-red-500' : 'text-gray-500'}`}
        >
          👎 {dislikeCount}
        </button>
      </div>
    </div>
  );
}

export default Comment;
