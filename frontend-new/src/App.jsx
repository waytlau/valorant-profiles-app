// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PlayerLookup from './pages/PlayerLookup';
import PlayerProfile from './pages/PlayerProfile';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<PlayerLookup />} />
        <Route path="/lookup" element={<PlayerLookup />} />
        <Route path="/profile/:puuid" element={<PlayerProfile />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
