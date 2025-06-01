import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Dashboard from './pages/Dashboard';
import Campaign from './components/campaign';

import { useState, useEffect } from "react";
import ProtectedRoute from "./components/protectedRoute";
import './App.css';
import SegmentCampaign from "./components/segmentCampaign";
import Auth from "./pages/Auth";
import { UserProvider } from "./contexts/UserContext";
function App() {
  const [user, setUser] = useState<false| []|null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/auth/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => setUser(false));
  }, []);

  return (
      <Router>
        <Routes>
          <Route
            path="/auth"
            element={<Auth />}
          />
          
          <Route
            path="/"
            element={
              <ProtectedRoute user={user}>
                <Dashboard user={user} />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/campaign/:segmentId"
            element={
              <ProtectedRoute user={user}>
                <Campaign />
              </ProtectedRoute>
            }
          />
          <Route
            path="/segment"
            element={
              <ProtectedRoute user={user}>
                <SegmentCampaign />
              </ProtectedRoute>
            }
          /> */}
        </Routes>
      </Router>
  
  );
}

export default App;
