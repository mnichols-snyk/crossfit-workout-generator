import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoginPage from './pages/Auth/LoginPage';
import AdminPage from './pages/Admin/AdminPage';
import CoachPage from './pages/Coach/CoachPage';
import UserPage from './pages/User/UserPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';



const App: React.FC = () => {
  // PrivateRoute component to protect routes
  const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return <div>Loading...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/*" element={<PrivateRoute><Layout><AdminPage /></Layout></PrivateRoute>} />
          <Route path="/coach/*" element={<PrivateRoute><Layout><CoachPage /></Layout></PrivateRoute>} />
          <Route path="/user/*" element={<PrivateRoute><Layout><UserPage /></Layout></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;


