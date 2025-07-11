import { Router } from 'express';
import * as express from 'express';
import { validateWorkout, validateUpdateWorkout, validateLogWorkoutResult } from '../middleware/validationMiddleware';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware';

// Import controller functions directly
import * as workoutController from '../controllers/workoutController';

const router: express.Router = Router();

router.post('/', authenticateToken, authorizeRoles('admin', 'coach'), validateWorkout, workoutController.createWorkout);
router.get('/', authenticateToken, workoutController.getWorkouts);
router.get('/generate', authenticateToken, workoutController.generateWorkout); // New route for generating workouts
router.get('/:id', authenticateToken, workoutController.getWorkoutById);
router.put('/:id', authenticateToken, validateUpdateWorkout, workoutController.updateWorkout);
router.delete('/:id', authenticateToken, workoutController.deleteWorkout);

router.post('/:workout_id/log-result', authenticateToken, authorizeRoles('admin', 'coach', 'user'), validateLogWorkoutResult, workoutController.logWorkoutResult);

export default router;
