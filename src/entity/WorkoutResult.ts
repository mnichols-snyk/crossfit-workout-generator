import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { Workout } from "./Workout";

@Entity()
export class WorkoutResult {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "text",
        nullable: true
    })
    notes?: string;

    @Column({
        type: "real", // For numerical results like time, weight, reps
        nullable: true
    })
    resultValue?: number;

    @Column({
        nullable: true
    })
    resultUnit?: string; // e.g., "minutes", "kg", "reps"

    @ManyToOne(() => User, user => user.workoutResults)
    user!: User;

    @ManyToOne(() => Workout, workout => workout.workoutResults)
    workout!: Workout;

    @Column({
        type: "timestamp",
        default: () => "NOW()"
    })
    performedAt!: Date;

    @Column({
        type: "timestamp",
        default: () => "NOW()",
        onUpdate: "NOW()"
    })
    updatedAt!: Date;
}
