import { Router } from 'express';
import * as express from 'express';
import { validateUser, validateUpdateUser } from '../middleware/validationMiddleware';
import { body } from 'express-validator';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware';

// Import controller functions directly
import { createUser, getUsers, getUserById, updateUser, deleteUser, resetUserPassword } from '../controllers/userController';

const router: express.Router = Router();

router.post('/', validateUser, createUser);
router.get('/', authenticateToken, authorizeRoles('admin'), getUsers);
router.get('/me', authenticateToken, getUserById);
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, validateUpdateUser, updateUser);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteUser);

router.put('/reset-password/:id', authenticateToken, authorizeRoles('admin'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
  resetUserPassword
);

export default router;


