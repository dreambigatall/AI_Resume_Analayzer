// src/components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
import { useAuth } from '../contexts/AuthContext';
interface ProtectedRouteProps {
  children?: React.ReactNode; // Allow children to be passed directly for single route protection
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { session, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // You can return a global loading spinner component here
    return <div className="flex items-center justify-center h-screen">Loading session...</div>;
  }

  if (!session) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to so we can send them along after they login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />; // Render children or Outlet for nested routes
};

export default ProtectedRoute;