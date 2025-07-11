import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Workout } from "./Workout";
import { WorkoutResult } from "./WorkoutResult";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        unique: true,
        nullable: false
    })
    email!: string;

    @Column()
    password!: string;

    @Column({
        type: "varchar",
        default: "user"
    })
    role!: string;

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

    @OneToMany(() => Workout, workout => workout.user)
    workouts!: Workout[];

    @OneToMany(() => WorkoutResult, workoutResult => workoutResult.user)
    workoutResults!: WorkoutResult[];
}
