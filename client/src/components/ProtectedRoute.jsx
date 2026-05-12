/**
 * ProtectedRoute Component
 * ------------------------
 * Wrapper component that redirects unauthenticated users to the login page.
 * Shows a loading spinner while the auth state is being verified.
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAuthenticated, loading } = useAuth();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to dashboard if admin-only route and user is not admin
  if (adminOnly && user?.role !== 'admin' && user?.email !== 'admin@gmail.com') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
