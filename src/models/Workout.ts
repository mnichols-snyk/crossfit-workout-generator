export interface Workout {
  id?: number;
  user_id: number;
  name: string;
  description?: string;
  date: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface WorkoutExercise {
  id?: number;
  workout_id: number;
  exercise_id: number;
  sets?: number;
  reps?: number;
  duration?: string;
  notes?: string;
}
