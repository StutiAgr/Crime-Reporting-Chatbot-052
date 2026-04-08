import "./App.css";
import Chatbot from "./Chatbot";
import Home from "./Home";
import ComplaintTable from "./components/ComplaintTable";
import Header from "./components/Header";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ResourcesPage from "./ResourcesPage";
import AdminDashboard from "./components/AdminDashboard";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/complaints" element={<ComplaintTable />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
