// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
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
          <Link to="/login" className="text-gray-300 hover:text-white mx-2">
            Login
          </Link>
          <Link to="/register" className="text-gray-300 hover:text-white mx-2">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
