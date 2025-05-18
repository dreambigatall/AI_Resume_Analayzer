// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout'; // We'll create this next
import HomePage from './pages/HomePage'; // Placeholder
import LoginPage from './pages/LoginPage'; // We'll create this
import SignupPage from './pages/SignupPage'; // We'll create this
import JobsListPage from './pages/JobsListPage'; // Placeholder
import JobDetailPage from './pages/JobDetailPage'; // Placeholder
import CreateJobPage from './pages/CreateJobPage'; // Placeholder
import ProtectedRoute from './components/ProtectedRoute'; // We'll create this
import { useAuth } from './contexts/AuthContext';

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        {/* You can use a shadcn spinner here later if you add one */}
        Loading application...
      </div>
    );
  }

  return (
    <Router>
      <Layout> {/* Apply the layout to all routes */}
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/jobs" element={<ProtectedRoute><JobsListPage /></ProtectedRoute>} />
          <Route path="/jobs/new" element={<ProtectedRoute><CreateJobPage /></ProtectedRoute>} />
          <Route path="/jobs/:jobId" element={<ProtectedRoute><JobDetailPage /></ProtectedRoute>} />

          {/* Fallback or Not Found (optional) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;