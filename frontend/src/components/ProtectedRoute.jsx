import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  console.log('Protected Route Token:', token);

  const isAuthenticated = token && token.trim() !== '' && token !== 'null' && token !== 'undefined';

  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login...');
    return <Navigate to="/admin/login" replace />;
  }

  // If token exists, allow access to the protected component
  return children;
};

export default ProtectedRoute;
