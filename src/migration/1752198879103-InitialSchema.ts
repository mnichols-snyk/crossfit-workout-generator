import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1752198879103 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL NOT NULL,
                "email" character varying NOT NULL UNIQUE,
                "password" character varying NOT NULL,
                "username" character varying NOT NULL UNIQUE,
                "role" character varying NOT NULL DEFAULT 'user',
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            );
        `);

        await queryRunner.query(`
            CREATE TABLE "exercise" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "description" character varying,
                "type" character varying,
                "muscle_group" character varying,
                "equipment" character varying,
                CONSTRAINT "PK_c7e60058727a20c705031b262d4" PRIMARY KEY ("id")
            );
        `);

        await queryRunner.query(`
            CREATE TABLE "workout" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "description" character varying,
                "date" TIMESTAMP NOT NULL,
                "user_id" integer NOT NULL,
                CONSTRAINT "PK_d3004037599059f201633919e11" PRIMARY KEY ("id")
            );
        `);

        await queryRunner.query(`
            CREATE TABLE "workout_exercise" (
                "id" SERIAL NOT NULL,
                "workout_id" integer NOT NULL,
                "exercise_id" integer NOT NULL,
                "sets" integer,
                "reps" integer,
                "duration" integer,
                "notes" character varying,
                CONSTRAINT "PK_1f8a2a5b7c7b8c7b8c7b8c7b8c7" PRIMARY KEY ("id")
            );
        `);

        await queryRunner.query(`
            CREATE TABLE "workout_result" (
                "id" SERIAL NOT NULL,
                "workout_id" integer NOT NULL,
                "user_id" integer NOT NULL,
                "notes" character varying,
                "resultValue" character varying,
                "resultUnit" character varying,
                "performedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_c7e60058727a20c705031b262d5" PRIMARY KEY ("id")
            );
        `);

        await queryRunner.query(`
            ALTER TABLE "workout" ADD CONSTRAINT "FK_workout_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
        `);

        await queryRunner.query(`
            ALTER TABLE "workout_exercise" ADD CONSTRAINT "FK_workoutexercise_workout" FOREIGN KEY ("workout_id") REFERENCES "workout"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
        `);

        await queryRunner.query(`
            ALTER TABLE "workout_exercise" ADD CONSTRAINT "FK_workoutexercise_exercise" FOREIGN KEY ("exercise_id") REFERENCES "exercise"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
        `);

        await queryRunner.query(`
            ALTER TABLE "workout_result" ADD CONSTRAINT "FK_workoutresult_workout" FOREIGN KEY ("workout_id") REFERENCES "workout"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
        `);

        await queryRunner.query(`
            ALTER TABLE "workout_result" ADD CONSTRAINT "FK_workoutresult_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workout_result" DROP CONSTRAINT "FK_workoutresult_user";`);
        await queryRunner.query(`ALTER TABLE "workout_result" DROP CONSTRAINT "FK_workoutresult_workout";`);
        await queryRunner.query(`ALTER TABLE "workout_exercise" DROP CONSTRAINT "FK_workoutexercise_exercise";`);
        await queryRunner.query(`ALTER TABLE "workout_exercise" DROP CONSTRAINT "FK_workoutexercise_workout";`);
        await queryRunner.query(`ALTER TABLE "workout" DROP CONSTRAINT "FK_workout_user";`);
        await queryRunner.query(`DROP TABLE "workout_result";`);
        await queryRunner.query(`DROP TABLE "workout_exercise";`);
        await queryRunner.query(`DROP TABLE "workout";`);
        await queryRunner.query(`DROP TABLE "exercise";`);
        await queryRunner.query(`DROP TABLE "user";`);
    }

}
