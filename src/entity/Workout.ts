import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Exercise } from "./Exercise";
import { WorkoutResult } from "./WorkoutResult";
import { WorkoutExercise } from "./WorkoutExercise";

@Entity()
export class Workout {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({
        type: "text",
        nullable: true
    })
    description?: string;

    @Column({
        type: "date",
        nullable: true
    })
    date?: Date;

    @ManyToOne(() => User, user => user.workouts)
    user!: User;

    @Column({
        type: "timestamp",
        default: () => "NOW()"
    })
    createdAt!: Date;

    @Column({
        type: "timestamp",
        default: () => "NOW()",
        onUpdate: "NOW()"
    })
    updatedAt!: Date;

    @OneToMany(() => WorkoutResult, workoutResult => workoutResult.workout)
    workoutResults!: WorkoutResult[];

    // You might want to add a many-to-many relationship with Exercise if a workout has multiple exercises
    // @ManyToMany(() => Exercise)
    // @JoinTable()
    @OneToMany(() => WorkoutExercise, workoutExercise => workoutExercise.workout)
    workoutExercises!: WorkoutExercise[];
}
