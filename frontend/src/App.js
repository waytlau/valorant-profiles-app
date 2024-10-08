// frontend-new/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PlayerLookup from './pages/PlayerLookup';
import PlayerProfile from './pages/PlayerProfile';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ProtectedRoute from './components/ProtectedRoute';
import TestFirestore from './components/TestFirestore'; // Import TestFirestore

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lookup" element={<PlayerLookup />} />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <PlayerProfile />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/test-firestore" element={<TestFirestore />} /> {/* Add TestFirestore Route */}
      </Routes>
    </Router>
  );
}

export default App;
