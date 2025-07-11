// frontend/src/components/layout/Layout.tsx
import React from 'react';
import { useAuth } from '../../context/AuthContext'; 
import { useNavigate } from 'react-router-dom'; 
import Button from '../common/Button'; 

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{
        backgroundColor: '#333',
        color: '#fff',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>CrossFit App</h1>
        <nav>
          {user && (
            <span style={{ marginRight: '20px' }}>Welcome, {user.email} ({user.role})</span>
          )}
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </nav>
      </header>
      <main style={{ flexGrow: 1, padding: '20px' }}>
        {children}
      </main>
      <footer style={{
        backgroundColor: '#eee',
        padding: '10px 20px',
        textAlign: 'center',
        fontSize: '14px',
        color: '#555',
      }}>
        {new Date().getFullYear()} CrossFit Workout Generator
      </footer>
    </div>
  );
};

export default Layout;
