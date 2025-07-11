// frontend/src/pages/Admin/components/UserForm.tsx
import React, { useState, useEffect } from 'react';
import Button from '@/components/common/Button.tsx'; // Adjust path as needed

interface UserFormProps {
  initialUser?: { id?: string; email: string; role: 'admin' | 'coach' | 'user' };
  onSubmit: (user: { id?: string; email: string; role: 'admin' | 'coach' | 'user' }) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ initialUser, onSubmit, onCancel }) => {

  const [email, setEmail] = useState(initialUser?.email || '');
  const [role, setRole] = useState<'admin' | 'coach' | 'user'>(initialUser?.role || 'user');

  useEffect(() => {
    if (initialUser) {
      setEmail(initialUser.email);
      setRole(initialUser.role);
    } else {
      setEmail('');
      setRole('user');
    }
  }, [initialUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ id: initialUser?.id, email, role });
  };

  const inputStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  };

  const labelStyle: React.CSSProperties = {
    marginBottom: '5px',
    display: 'block',
    fontWeight: 'bold',
  };

  const formGroupStyle: React.CSSProperties = {
    marginBottom: '15px',
  };

  return (
    <form onSubmit={handleSubmit}>

      <div style={formGroupStyle}>
        <label htmlFor="email" style={labelStyle}>Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
      </div>
      <div style={formGroupStyle}>
        <label htmlFor="role" style={labelStyle}>Role:</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as 'admin' | 'coach' | 'user')}
          required
          style={inputStyle}
        >
          <option value="user">User</option>
          <option value="coach">Coach</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary">{initialUser ? 'Save Changes' : 'Add User'}</Button>
      </div>
    </form>
  );
};

export default UserForm;
