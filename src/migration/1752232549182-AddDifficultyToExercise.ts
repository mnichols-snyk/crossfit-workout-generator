import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDifficultyToExercise1752232549182 implements MigrationInterface {
    name = 'AddDifficultyToExercise1752232549182'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exercise" ADD "difficulty" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exercise" DROP COLUMN "difficulty"`);
    }

}
