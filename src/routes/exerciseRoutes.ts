import { Router } from 'express';
import * as express from 'express';
import { validateExercise, validateUpdateExercise } from '../middleware/validationMiddleware';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware';

// Import controller functions directly
import * as exerciseController from '../controllers/exerciseController';

const router: express.Router = Router();

router.post('/', authenticateToken, authorizeRoles('admin', 'coach'), validateExercise, exerciseController.createExercise);
router.get('/', authenticateToken, exerciseController.getExercises);
router.get('/:id', authenticateToken, exerciseController.getExerciseById);
router.put('/:id', authenticateToken, validateUpdateExercise, exerciseController.updateExercise);
router.delete('/:id', authenticateToken, exerciseController.deleteExercise);

export default router;
