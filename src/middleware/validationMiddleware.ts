import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger'; // Import the logger

export const validateUser = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('password_hash')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateUpdateUser = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Invalid email format'),
  body('password_hash')
    .optional()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['admin', 'coach', 'user']).withMessage('Invalid role specified'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateExercise = [
  body('name')
    .trim()
    .notEmpty().withMessage('Exercise name is required'),
  body('description')
    .trim()
    .notEmpty().withMessage('Exercise description is required'),
  body('type')
    .trim()
    .notEmpty().withMessage('Exercise type is required'),
  body('difficulty')
    .trim()
    .notEmpty().withMessage('Exercise difficulty is required'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateUpdateExercise = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Exercise name cannot be empty'),
  body('description')
    .optional()
    .trim()
    .notEmpty().withMessage('Exercise description cannot be empty'),
  body('type')
    .optional()
    .trim()
    .notEmpty().withMessage('Exercise type cannot be empty'),
  body('difficulty')
    .optional()
    .trim()
    .notEmpty().withMessage('Exercise difficulty cannot be empty'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateLogWorkoutResult = [
  param('workout_id').isInt().withMessage('Workout ID must be an integer'),
  body('result_data')
    .isObject().withMessage('Result data must be an object')
    .custom((value: object) => Object.keys(value).length > 0).withMessage('Result data cannot be an empty object'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validation Errors for logWorkoutResult:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateWorkout = [
  body('user_id')
    .isInt().withMessage('User ID must be an integer')
    .notEmpty().withMessage('User ID is required'),
  body('name')
    .trim()
    .notEmpty().withMessage('Workout name is required'),
  body('description')
    .trim()
    .notEmpty().withMessage('Workout description is required'),
  body('date')
    .isISO8601().withMessage('Date must be a valid ISO 8601 date string (YYYY-MM-DD)'),
  body('exercises')
    .optional()
    .isArray().withMessage('Exercises must be an array')
    .custom((exercises: any[]) => {
      for (const ex of exercises) {
        if (!ex.exercise_id || !Number.isInteger(ex.exercise_id)) {
          throw new Error('Each exercise in the array must have an integer exercise_id');
        }
        if (ex.sets !== undefined && !Number.isInteger(ex.sets)) {
          throw new Error('Sets must be an integer');
        }
        if (ex.reps !== undefined && !Number.isInteger(ex.reps)) {
          throw new Error('Reps must be an integer');
        }
        if (ex.duration !== undefined && !Number.isInteger(ex.duration)) {
          throw new Error('Duration must be an integer');
        }
      }
      return true;
    }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateUpdateWorkout = [
  body('user_id')
    .optional()
    .isInt().withMessage('User ID must be an integer'),
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Workout name cannot be empty'),
  body('description')
    .optional()
    .trim()
    .notEmpty().withMessage('Workout description cannot be empty'),
  body('date')
    .optional()
    .isISO8601().withMessage('Date must be a valid ISO 8601 date string (YYYY-MM-DD)'),
  body('exercises')
    .optional()
    .isArray().withMessage('Exercises must be an array')
    .custom((exercises: any[]) => {
      for (const ex of exercises) {
        if (!ex.exercise_id || !Number.isInteger(ex.exercise_id)) {
          throw new Error('Each exercise in the array must have an integer exercise_id');
        }
        if (ex.sets !== undefined && !Number.isInteger(ex.sets)) {
          throw new Error('Sets must be an integer');
        }
        if (ex.reps !== undefined && !Number.isInteger(ex.reps)) {
          throw new Error('Reps must be an integer');
        }
        if (ex.duration !== undefined && !Number.isInteger(ex.duration)) {
          throw new Error('Duration must be an integer');
        }
      }
      return true;
    }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
