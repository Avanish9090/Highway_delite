import { Navigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("login first..");
    return <Navigate to="/" replace />;
  }

  return children;
};
export default ProtectedRoute;
