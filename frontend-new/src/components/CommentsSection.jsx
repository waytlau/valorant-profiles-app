// src/components/CommentsSection.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; // Ensure Firebase is correctly configured
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

function CommentsSection({ playerPUUID }) {
  const [user] = useAuthState(auth);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const commentsRef = collection(db, 'comments');
    const q = query(
      commentsRef,
      where('playerPUUID', '==', playerPUUID),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [playerPUUID]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addDoc(collection(db, 'comments'), {
        playerPUUID,
        userId: user.uid,
        username: user.displayName || user.email,
        comment: newComment.trim(),
        timestamp: serverTimestamp(),
      });
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleAddComment} className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-2 border rounded mb-2"
            rows="4"
          ></textarea>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Post Comment
          </button>
        </form>
      ) : (
        <p className="text-gray-500">Please log in to post a comment.</p>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="mb-4 border-b pb-2">
            <p className="font-semibold">{comment.username}</p>
            <p>{comment.comment}</p>
            <p className="text-gray-500 text-sm">
              {comment.timestamp?.toDate().toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <p>No comments yet.</p>
      )}
    </div>
  );
}

export default CommentsSection;
