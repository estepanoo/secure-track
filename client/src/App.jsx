import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserDashboard from "./pages-user/DashBoard";
import LuggageTracking from "./pages-user/LuggageTracking";
import Profile from "./pages-user/Profile";
import AssocLuggage from "./pages-user/AssocLuggage";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserDashboard />} />
        <Route path="/tracking" element={<LuggageTracking />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/luggage" element={<AssocLuggage />} />
      </Routes>

      <Routes>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
