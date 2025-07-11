export interface Exercise {
  id?: number;
  name: string;
  description?: string;
  type?: string; // e.g., 'strength', 'cardio', 'gymnastics'
  difficulty?: string; // e.g., 'beginner', 'intermediate', 'advanced'
  created_at?: Date;
  updated_at?: Date;
}
