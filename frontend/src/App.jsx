import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchCurrentUser,
  selectIsAuthenticated,
  selectAccessToken,
} from "./features/auth/authSlice.js";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import GuestRoute from "./components/auth/GuestRoute.jsx";
import DashboardLayout from "./components/layout/DashboardLayout.jsx";
import Loader from "./components/common/Loader.jsx";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// Lazy-loaded pages
const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage.jsx"));
const ResumesPage = lazy(() => import("./pages/resume/ResumesPage.jsx"));
const ResumeBuilderPage = lazy(() => import("./pages/resume/ResumeBuilderPage.jsx"));

const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<Loader fullScreen message="Loading..." />}>
    {children}
  </Suspense>
);

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const accessToken = useSelector(selectAccessToken);

  useEffect(() => {
    if (accessToken && isAuthenticated) {
      dispatch(fetchCurrentUser());
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
      } />

      {/* Guest routes */}
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
      <Route path="/reset-password/:token" element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />

      {/* Protected routes with layout */}
      <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<SuspenseWrapper><DashboardPage /></SuspenseWrapper>} />
        <Route path="resumes" element={<SuspenseWrapper><ResumesPage /></SuspenseWrapper>} />
        <Route path="analytics" element={<SuspenseWrapper><Loader variant="dots" message="Analytics coming in Step 4..." /></SuspenseWrapper>} />
        <Route path="profile" element={<SuspenseWrapper><Loader variant="dots" message="Profile coming in Step 4..." /></SuspenseWrapper>} />
      </Route>

      {/* Resume builder — no sidebar layout */}
      <Route path="/resumes/:id/edit" element={
        <ProtectedRoute>
          <SuspenseWrapper><ResumeBuilderPage /></SuspenseWrapper>
        </ProtectedRoute>
      } />
      <Route path="/resumes/new" element={
        <ProtectedRoute>
          <SuspenseWrapper><ResumeBuilderPage /></SuspenseWrapper>
        </ProtectedRoute>
      } />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;