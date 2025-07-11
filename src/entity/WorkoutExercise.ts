import { Entity, PrimaryColumn, ManyToOne, Column } from "typeorm";
import { Workout } from "./Workout";
import { Exercise } from "./Exercise";

@Entity()
export class WorkoutExercise {

    @PrimaryColumn()
    workoutId!: number;

    @PrimaryColumn()
    exerciseId!: number;

    @ManyToOne(() => Workout, workout => workout.workoutExercises)
    workout!: Workout;

    @ManyToOne(() => Exercise, exercise => exercise.workoutExercises)
    exercise!: Exercise;

    @Column({ nullable: true })
    sets?: number;

    @Column({ nullable: true })
    reps?: number;

    @Column({ type: "real", nullable: true })
    duration?: number;

    @Column({ nullable: true })
    notes?: string;
}
