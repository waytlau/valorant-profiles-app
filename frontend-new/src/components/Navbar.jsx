// frontend-new/src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase'; // Corrected relative path
import { useAuthState } from 'react-firebase-hooks/auth';

function Navbar() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">
          Valorant Profiles
        </Link>
        <div>
          <Link to="/lookup" className="text-gray-300 hover:text-white mx-2">
            Player Lookup
          </Link>
          {loading && <span className="text-gray-300 mx-2">Loading...</span>}
          {error && <span className="text-red-500 mx-2">Error: {error.message}</span>}
          {user ? (
            <>
              <span className="text-gray-300 mx-2">
                {user.displayName || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white mx-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white mx-2">
                Login
              </Link>
              <Link to="/signup" className="text-gray-300 hover:text-white mx-2">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
