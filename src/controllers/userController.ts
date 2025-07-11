import { Request, Response } from 'express';
import { User } from '../entity/User';
import { AppDataSource } from '../data-source';
import bcrypt from 'bcryptjs';

const saltRounds = 10; // You can store this in an environment variable

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, saltRounds);
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const newUser: User = req.body;
    if (newUser.password) {
      newUser.password = await hashPassword(newUser.password);
    }
    const savedUser = await userRepository.save(newUser);
    res.status(201).json(savedUser);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();
    // For security, do not return passwords
    const usersWithoutPasswords = users.map(({ password, ...rest }) => rest);
    res.status(200).json(usersWithoutPasswords);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    let userIdToFetch = req.params.id;

    // If the route is /users/me, use the authenticated user's ID
    if (req.path === '/me' && req.user && req.user.id) {
      userIdToFetch = req.user.id.toString(); // Ensure it's a string for comparison with req.params.id
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: parseInt(userIdToFetch) });
    if (user) {
      // For security, do not return password
      const { password, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(User);
    const updatedUser: Partial<User> = req.body;
    if (updatedUser.password) {
      updatedUser.password = await hashPassword(updatedUser.password);
    }
    const result = await userRepository.update(id, updatedUser);
    if (result.affected && result.affected > 0) {
      res.status(200).json({ message: 'User updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(User);
    const result = await userRepository.delete(id);
    if (result.affected && result.affected > 0) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

// Helper function to compare passwords (for future authentication)
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const resetUserPassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: parseInt(id) });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = await hashPassword(newPassword);
    await userRepository.save(user);

    res.status(200).json({ message: 'User password reset successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error resetting user password', error: error.message });
  }
};
