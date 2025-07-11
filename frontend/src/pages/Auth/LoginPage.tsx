// frontend/src/pages/Auth/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button'; // Assuming correct path
import { useAuth } from '../../context/AuthContext'; // Import useAuth

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // State for error messages
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from AuthContext

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    try {
      await login(email, password);
      // If login is successful, useAuth context will handle navigation via PrivateRoute
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
      }}>
        <h2 style={{ marginBottom: '30px', color: '#333' }}>Login</h2>
        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
          <div style={{ marginBottom: '20px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: 'calc(100% - 20px)',
                padding: '12px 10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '16px',
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '30px' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: 'calc(100% - 20px)',
                padding: '12px 10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '16px',
              }}
              required
            />
          </div>
          <Button type="submit" variant="primary" style={{ width: '100%', padding: '12px' }}>
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
