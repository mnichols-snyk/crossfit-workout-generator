import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Exercise } from "./entity/Exercise";
import { Workout } from "./entity/Workout";
import { WorkoutResult } from "./entity/WorkoutResult";
import { WorkoutExercise } from "./entity/WorkoutExercise";

export const AppDataSource = new DataSource(require('../ormconfig.json'));
