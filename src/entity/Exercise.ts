import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { WorkoutExercise } from "./WorkoutExercise";

@Entity()
export class Exercise {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        unique: true
    })
    name!: string;

    @Column({ nullable: true })
    type?: string;

    @Column({ nullable: true })
    muscle_group?: string;

    @Column({ nullable: true })
    difficulty?: string;

    @Column({ nullable: true })
    equipment?: string;

    @Column({
        nullable: true,
        type: "text"
    })
    description?: string;

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

    @OneToMany(() => WorkoutExercise, workoutExercise => workoutExercise.exercise)
    workoutExercises!: WorkoutExercise[];
}
