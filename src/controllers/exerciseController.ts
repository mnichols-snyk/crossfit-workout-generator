import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Exercise } from '../entity/Exercise';
import logger from '../utils/logger';

// Get all exercises
export const getExercises = async (req: Request, res: Response) => {
    try {
        const exerciseRepository = AppDataSource.getRepository(Exercise);
        const exercises = await exerciseRepository.find();
        res.status(200).json(exercises);
    } catch (error: any) {
        logger.error(`Error getting exercises: ${error.message}`);
        res.status(500).json({ message: 'Error getting exercises' });
    }
};

// Get a single exercise by ID
export const getExerciseById = async (req: Request, res: Response) => {
    try {
        const exerciseRepository = AppDataSource.getRepository(Exercise);
        const id = parseInt(req.params.id, 10);
        const exercise = await exerciseRepository.findOneBy({ id });

        if (!exercise) {
            return res.status(404).json({ message: 'Exercise not found' });
        }
        res.status(200).json(exercise);
    } catch (error: any) {
        logger.error(`Error getting exercise by ID: ${error.message}`);
        res.status(500).json({ message: 'Error getting exercise' });
    }
};

// Create a new exercise
export const createExercise = async (req: Request, res: Response) => {
    try {
        const exerciseRepository = AppDataSource.getRepository(Exercise);
        const newExercise = exerciseRepository.create(req.body);
        const savedExercise = await exerciseRepository.save(newExercise);
        res.status(201).json(savedExercise);
    } catch (error: any) {
        // Check for PostgreSQL unique violation error code '23505'
        if (error.code === '23505') {
            return res.status(409).json({ message: 'An exercise with this name already exists.' });
        }
        logger.error(`Error creating exercise: ${error.message}, Stack: ${error.stack}`);
        res.status(500).json({ message: 'Error creating exercise', error: error.message });
    }
};

// Update an existing exercise
export const updateExercise = async (req: Request, res: Response) => {
    try {
        const exerciseRepository = AppDataSource.getRepository(Exercise);
        const id = parseInt(req.params.id, 10);
        const exerciseToUpdate = await exerciseRepository.findOneBy({ id });

        if (!exerciseToUpdate) {
            return res.status(404).json({ message: 'Exercise not found' });
        }

        exerciseRepository.merge(exerciseToUpdate, req.body);
        await exerciseRepository.save(exerciseToUpdate);
        res.status(200).json({ message: 'Exercise updated successfully' });
    } catch (error: any) {
        // Also handle unique constraint on update
        if (error.code === '23505') {
            return res.status(409).json({ message: 'An exercise with this name already exists.' });
        }
        logger.error(`Error updating exercise: ${error.message}`);
        res.status(500).json({ message: 'Error updating exercise' });
    }
};

// Delete an exercise
export const deleteExercise = async (req: Request, res: Response) => {
    try {
        const exerciseRepository = AppDataSource.getRepository(Exercise);
        const id = parseInt(req.params.id, 10);
        const deleteResult = await exerciseRepository.delete(id);

        if (deleteResult.affected === 0) {
            return res.status(404).json({ message: 'Exercise not found' });
        }

        res.status(200).json({ message: 'Exercise deleted successfully' });
    } catch (error: any) {
        logger.error(`Error deleting exercise: ${error.message}`);
        res.status(500).json({ message: 'Error deleting exercise' });
    }
};