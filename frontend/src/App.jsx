import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";
import Footer from "./components/Footer";
import BoardPage from "./pages/BoardPage";
import RequestDetailsPage from "./pages/RequestDetailsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SubmitRequestPage from "./pages/SubmitRequestPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loadingUser } = useAuth();

  if (loadingUser) return <main className="page">Loading...</main>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}

function AdminRoute({ children }) {
  const { isAdmin, loadingUser } = useAuth();

  if (loadingUser) return <main className="page">Loading...</main>;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
}

function AppRoutes() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<BoardPage />} />
        <Route path="/requests/:id" element={<RequestDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/submit"
          element={
            <ProtectedRoute>
              <SubmitRequestPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}