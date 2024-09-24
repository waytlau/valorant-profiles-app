// frontend-new/src/pages/PlayerProfile.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { fetchSummonerByName, fetchLeagueEntries, fetchMatchDetails } from '../api/riotApi';
import { auth } from '../firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import Comment from "../components/Comment";
import LikeDislike from "../components/LikeDislike";


function PlayerProfile() {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const region = queryParams.get('region') || 'na1'; // Default to 'na1' if not specified

  const [leagueEntries, setLeagueEntries] = useState([]);
  const [matches, setMatches] = useState([]); // State for matches
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [user, loadingAuth, errorAuth] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch league entries (mock data)
        const leagueData = await fetchLeagueEntries(id, region);
        setLeagueEntries(leagueData);

        // Fetch recent matches (mock data)
        const recentMatchIds = ['matchId1', 'matchId2']; // Example match IDs
        const matchPromises = recentMatchIds.map((matchId) => fetchMatchDetails(matchId, region));
        const matchData = await Promise.all(matchPromises);
        setMatches(matchData);

        // Fetch comments
        const commentsRef = collection(db, 'comments');
        const q = query(commentsRef, where('playerId', '==', id));
        const querySnapshot = await getDocs(q);
        const commentsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(commentsList);
      } catch (err) {
        setError('Failed to fetch player data. Please try again.');
        console.error(err);
      }
      setLoading(false);
    };

    getData();
  }, [id, region]);

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

  if (loading || loadingAuth) return <div className="p-4">Loading...</div>;
  if (error || errorAuth) return <div className="p-4 text-red-500">{error || errorAuth.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Player Profile</h2>
      
      {/* Display Player Information */}
      {leagueEntries.length > 0 ? (
        <div className="mb-4">
          <h3 className="text-xl font-semibold">League Entries:</h3>
          <ul>
            {leagueEntries.map((entry) => (
              <li key={entry.leagueId} className="mb-2 p-2 border rounded">
                <p><strong>Queue Type:</strong> {entry.queueType}</p>
                <p><strong>Tier:</strong> {entry.tier} {entry.rank}</p>
                <p><strong>LP:</strong> {entry.leaguePoints}</p>
                <p><strong>Wins:</strong> {entry.wins}</p>
                <p><strong>Losses:</strong> {entry.losses}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No league entries found.</p>
      )}

      {/* Recent Matches */}
      <h3 className="text-xl font-semibold mt-8 mb-4">Recent Matches:</h3>
      {matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((match) => (
            <div key={match.matchId} className="p-4 border rounded">
              <p><strong>Match ID:</strong> {match.matchId}</p>
              <p><strong>Map:</strong> {match.map}</p>
              <p><strong>Duration:</strong> {match.duration}</p>
              <p><strong>Players:</strong></p>
              <ul className="list-disc list-inside">
                {match.players.map((player) => (
                  <li key={player.puuid}>
                    {player.character} - {player.kills}K/{player.deaths}D/{player.assists}A
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p>No recent matches found.</p>
      )}

      {/* Like/Dislike Section */}
      <LikeDislike playerId={id} />

      {/* Comments Section */}
      <h3 className="text-xl font-semibold mt-8 mb-4">Comments:</h3>
      <div>
        {comments.length > 0 ? (
          comments.map(comment => (
            <Comment key={comment.id} commentData={comment} />
          ))
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
      </div>

      {/* Add New Comment Form */}
      <form onSubmit={handleAddComment} className="mt-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Leave a comment..."
          className="w-full p-2 border rounded mb-2"
          rows="4"
          required
        ></textarea>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit Comment
        </button>
      </form>
    </div>
  );
}

export default PlayerProfile;
