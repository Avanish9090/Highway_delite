import "./App.css";
import { Route, Routes } from "react-router-dom";
import Sign from "./components/Sign";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Sign />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
