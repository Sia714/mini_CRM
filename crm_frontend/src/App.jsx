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
import AddNewCustomer from "./components/addNewCustomer";
import AddNewOrder from "./components/addNewOrder";
import ViewSegments from "./components/viewSegments";
import Profile from "./components/profile";
function App() {
  const [user, setUser] = useState();
  const API_BASE = import.meta.env.VITE_API_BASE;


  useEffect(() => {
    fetch(`${API_BASE}/auth/me`, {
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
   

    {/* Protected Dashboard Route */}
    <Route
      path="/"
      element={
        // <ProtectedRoute user={user}>
          <Dashboard  />
        // </ProtectedRoute>
      }
    >
      <Route index element={<SegmentCampaign />} />
      <Route path="dashboard" element={<SegmentCampaign />} />
      <Route path="add-customer" element={<AddNewCustomer />} />
      <Route path="add-order" element={<AddNewOrder />} />
      <Route path="view-segment" element={<ViewSegments />} />
      <Route path="campaign" element={<Campaign />} />
      <Route path="campaign/:segmentId" element={<Campaign/>} />
      <Route path="profile" element={<Profile/ >}/>

    </Route>
  </Routes>
</Router>

  );
}

export default App;
