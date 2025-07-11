// frontend/src/pages/Admin/components/UserManagementTable.tsx
import React, { useState, useEffect } from 'react';
import Table from '@/components/common/Table.tsx'; 
import Button from '@/components/common/Button.tsx'; 
import Modal from '@/components/common/Modal.tsx';   
import UserForm from './UserForm.tsx'; // Import UserForm
import api from '@/services/api'; // Import the API instance

interface User {
  id: string;
  email: string;
  role: 'admin' | 'coach' | 'user';
}

const UserManagementTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        console.log('API Response for /users:', response.data);
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  const handleAddUser = () => {
    setEditingUser(null); 
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm(`Are you sure you want to delete user with ID: ${userId}?`)) {
      console.log('Deleting user:', userId);
      // In a real app, you'd make an API call here
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleUserSubmit = async (user: { id?: string; email: string; role: 'admin' | 'coach' | 'user' }) => {
    try {
      if (user.id) {
        // Update existing user
        await api.put(`/users/${user.id}`, { email: user.email, role: user.role });
        console.log('User updated successfully:', user);
      } else {
        // Create new user (registration)
        // Note: Password is not handled here, as UserForm doesn't have a password field.
        // For a real app, you'd need a separate flow for adding new users with passwords.
        await api.post('/auth/register', { email: user.email, role: user.role });
        console.log('User added successfully:', user);
      }
      handleCloseModal();
      // Refresh the user list after successful operation
      // Re-fetch users by calling fetchUsers again
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Error submitting user:', err);
      setError('Failed to save user.');
    }
  };

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' },
    {
      key: 'actions',
      header: 'Actions',
      render: (user: User) => (
        <>
          <Button variant="secondary" onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleEditUser(user); }}>Edit</Button>
          <Button variant="danger" onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleDeleteUser(user.id); }} style={{ marginLeft: '5px' }}>Delete</Button>
        </>
      ),
    },
  ];

  const handleRowClick = (user: User) => {
    console.log('Row clicked:', user);
    handleEditUser(user);
  };

  return (
    <div>
      <h3>Manage Users</h3>
      <Table data={users} columns={columns} onRowClick={handleRowClick} />
      <Button onClick={handleAddUser} style={{ marginTop: '10px' }}>Add New User</Button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? 'Edit User' : 'Add New User'}
      >
        <UserForm
          initialUser={editingUser || undefined}
          onSubmit={handleUserSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default UserManagementTable;
