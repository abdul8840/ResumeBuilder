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

// Auth Pages (eager load — small)
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// Lazy loaded pages
const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage.jsx"));
const ResumesPage = lazy(() => import("./pages/resume/ResumesPage.jsx"));
const ResumeBuilderPage = lazy(() => import("./pages/resume/ResumeBuilderPage.jsx"));
const ResumePreviewPage = lazy(() => import("./pages/resume/ResumePreviewPage.jsx"));
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage.jsx"));
const AnalyticsPage = lazy(() => import("./pages/analytics/AnalyticsPage.jsx"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <Loader variant="dots" message="Loading page..." />
  </div>
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
      {/* Root redirect */}
      <Route
        path="/"
        element={
          isAuthenticated
            ? <Navigate to="/dashboard" replace />
            : <Navigate to="/login" replace />
        }
      />

      {/* ── Guest routes ───────────────────────────── */}
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
      <Route path="/reset-password/:token" element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />

      {/* ── Protected routes with sidebar layout ──── */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={<PageLoader />}>
              <DashboardPage />
            </Suspense>
          }
        />
        <Route
          path="/resumes"
          element={
            <Suspense fallback={<PageLoader />}>
              <ResumesPage />
            </Suspense>
          }
        />
        <Route
          path="/analytics"
          element={
            <Suspense fallback={<PageLoader />}>
              <AnalyticsPage />
            </Suspense>
          }
        />
        <Route
          path="/profile"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProfilePage />
            </Suspense>
          }
        />
      </Route>

      {/* ── Full-screen routes (no sidebar) ────────── */}
      <Route
        path="/resumes/new"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <ResumeBuilderPage />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/resumes/:id/edit"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <ResumeBuilderPage />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/resumes/:id/preview"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <ResumePreviewPage />
            </Suspense>
          </ProtectedRoute>
        }
      />

      {/* ── 404 ────────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;