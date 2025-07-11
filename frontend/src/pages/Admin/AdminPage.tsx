// frontend/src/pages/Admin/AdminPage.tsx
import React, { useState } from 'react';
import { AxiosError } from 'axios';
import UserManagementTable from './components/UserManagementTable.tsx';
import userService from '../../services/userService'; // Import userService

const AdminPage: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  // TODO: This password reset function is for development purposes only.
  // Before going live, replace this with a secure password reset mechanism
  // that sends a login link to the user's email address.
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const id = parseInt(userId);
    if (isNaN(id) || userId.trim() === '') {
      setMessage('Error: User ID must be a valid number.');
      return;
    }

    try {
      await userService.resetUserPassword(id, newPassword);
      setMessage('Password reset successfully!');
      setUserId('');
      setNewPassword('');
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      setMessage(`Error resetting password: ${(axiosError.response?.data as { message?: string })?.message || axiosError.message}`);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Welcome to the Admin page. Here you can manage users and other administrative tasks.</p>
      <UserManagementTable />

      <h3>Temporary Password Reset (Admin Only)</h3>
      <form onSubmit={handlePasswordReset}>
        <div>
          <label htmlFor="userId">User ID:</label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId((e.target as HTMLInputElement).value)}

          />
        </div>
        <div>
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword((e.target as HTMLInputElement).value)}

          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminPage;
