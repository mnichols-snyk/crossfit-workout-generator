import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: { id: number; email: string; role: string };
}
import { Workout } from '../entity/Workout';
import { Exercise } from '../entity/Exercise';
import { WorkoutExercise } from '../entity/WorkoutExercise';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { WorkoutResult } from '../entity/WorkoutResult';
import logger from '../utils/logger';


export const createWorkout = async (req: Request, res: Response) => {
  try {
    const workoutRepository = AppDataSource.getRepository(Workout);
    const workoutExerciseRepository = AppDataSource.getRepository(WorkoutExercise);

    const userRepository = AppDataSource.getRepository(User);
    const { user_id, name, description, date: dateString, exercises } = req.body;
    const date = new Date(dateString);

    if (!user_id || !name || !description || !date) {
      return res.status(400).json({ message: 'Missing required workout fields: user_id, name, description, date' });
    }

    const user = await userRepository.findOneBy({ id: user_id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newWorkout = Object.assign(new Workout(), { user, name, description, date });
    const savedWorkout: Workout = await workoutRepository.save(newWorkout);

    if (exercises && exercises.length > 0) {
      const workoutExercisesToSave = exercises.map((ex: any) => {
        return workoutExerciseRepository.create({
          workout: { id: savedWorkout.id },
          exercise: { id: ex.exerciseId } as Exercise,
          sets: ex.sets,
          reps: ex.reps,
          duration: ex.duration,
          notes: ex.notes,
        });
      });
      await Promise.all(workoutExercisesToSave.map((workoutExercise: WorkoutExercise) => workoutExerciseRepository.save(workoutExercise)));
    }

    res.status(201).json(savedWorkout);
  } catch (error: any) {
    logger.error(`Error creating workout: ${error.message}, Stack: ${error.stack}`);
    res.status(500).json({ message: 'Error creating workout', error: error.message });
  }
};

export const getWorkouts = async (req: Request, res: Response) => {
  try {
    const workoutRepository = AppDataSource.getRepository(Workout);

    const workouts = await workoutRepository.find({
      relations: ['user', 'workoutExercises', 'workoutExercises.exercise'],
    });

    res.status(200).json(workouts);
  } catch (error: any) {
    logger.error(`Error getting workouts: ${error.message}, Stack: ${error.stack}`);
    res.status(500).json({ message: 'Error getting workouts', error: error.message });
  }
};

export const getWorkoutById = async (req: Request, res: Response) => {
  try {
    const workoutRepository = AppDataSource.getRepository(Workout);
    const { id } = req.params;

    const workout = await workoutRepository.findOne({
      where: { id: parseInt(id, 10) },
      relations: ['user', 'workoutExercises', 'workoutExercises.exercise'],
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.status(200).json(workout);
  } catch (error: any) {
    logger.error(`Error getting workout: ${error.message}, Stack: ${error.stack}`);
    res.status(500).json({ message: 'Error getting workout', error: error.message });
  }
};

export const updateWorkout = async (req: Request, res: Response) => {
  try {
    const workoutRepository = AppDataSource.getRepository(Workout);
    const workoutExerciseRepository = AppDataSource.getRepository(WorkoutExercise);
    const userRepository = AppDataSource.getRepository(User);

    const { id } = req.params;
    const { user_id, name, description, date: dateString, exercises } = req.body;

    const workoutToUpdate = await workoutRepository.findOne({ where: { id: parseInt(id, 10) } });

    if (!workoutToUpdate) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    if (user_id) {
      const user = await userRepository.findOneBy({ id: user_id });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      workoutToUpdate.user = user;
    }

    if (name) workoutToUpdate.name = name;
    if (description) workoutToUpdate.description = description;
    if (dateString) workoutToUpdate.date = new Date(dateString);

    await workoutRepository.save(workoutToUpdate);

    if (exercises !== undefined) {
      // Delete existing WorkoutExercise entities for this workout
      await workoutExerciseRepository.delete({ workout: { id: workoutToUpdate.id } });

      if (exercises.length > 0) {
        const workoutExercisesToSave = exercises.map((ex: any) => {
          return workoutExerciseRepository.create({
            workout: workoutToUpdate,
            exercise: { id: ex.exerciseId } as Exercise,
            sets: ex.sets,
            reps: ex.reps,
            duration: ex.duration,
            notes: ex.notes,
          });
        });
        await Promise.all(workoutExercisesToSave.map((workoutExercise: WorkoutExercise) => workoutExerciseRepository.save(workoutExercise)));
      }
    }

    res.status(200).json({ message: 'Workout updated successfully', workout: workoutToUpdate });
  } catch (error: any) {
    logger.error(`Error updating workout: ${error.message}, Stack: ${error.stack}`);
    res.status(500).json({ message: 'Error updating workout', error: error.message });
  }
};

export const deleteWorkout = async (req: Request, res: Response) => {
  try {
    const workoutRepository = AppDataSource.getRepository(Workout);
    const { id } = req.params;

    const workoutToDelete = await workoutRepository.findOne({ where: { id: parseInt(id, 10) } });

    if (!workoutToDelete) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    await workoutRepository.remove(workoutToDelete);

    res.status(200).json({ message: 'Workout deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting workout', error: error.message });
  }
};



export const generateWorkout = async (req: Request, res: Response) => {
  try {
    // This is a placeholder for the workout generation logic.
    // It would involve querying exercises based on criteria (type, difficulty, etc.)
    // and assembling a workout.
    const exerciseRepository = AppDataSource.getRepository(Exercise);
    const exercises = await exerciseRepository.find({ take: 5 });
    res.status(200).json({ message: 'Generated a sample workout', exercises });
  } catch (error: any) {
    res.status(500).json({ message: 'Error generating workout', error: error.message });
  }
};

export const logWorkoutResult = async (req: AuthRequest, res: Response) => {
  try {
    const { workout_id } = req.params;
    const { result_data, notes, resultValue, resultUnit } = req.body; // result_data will be a JSON object
    const user_id = req.user?.id; // Get user_id from authenticated user

    if (!user_id || !workout_id) {
      return res.status(400).json({ message: 'Missing required fields: user_id, workout_id' });
    }

    const workoutRepository = AppDataSource.getRepository(Workout);
    const workoutResultRepository = AppDataSource.getRepository(WorkoutResult);
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({ id: user_id });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Check if the workout exists and belongs to the user
    const workout = await workoutRepository.findOne({ where: { id: parseInt(workout_id), user: { id: user_id } } });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found or does not belong to the user' });
    }

    const newWorkoutResult = workoutResultRepository.create({
        workout: workout,
        user: user,
        notes: notes,
        resultValue: resultValue,
        resultUnit: resultUnit,
        performedAt: new Date(),
    });

    await workoutResultRepository.save(newWorkoutResult);

    res.status(201).json({ message: 'Workout result logged successfully', workoutResult: newWorkoutResult });
  } catch (error: any) {
    logger.error(`Error logging workout result: ${error.message}, Stack: ${error.stack}`);
    res.status(500).json({ message: 'Error logging workout result', error: error.message });
  }
};
