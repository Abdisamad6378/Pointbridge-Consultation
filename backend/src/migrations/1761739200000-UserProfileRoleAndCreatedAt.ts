import type { MigrationInterface, QueryRunner } from 'typeorm';

// The "user" table was originally created by `synchronize: true`, so this
// migration is written to work both on that existing table and on an empty database.
export class UserProfileRoleAndCreatedAt1761739200000 implements MigrationInterface {
  name = 'UserProfileRoleAndCreatedAt1761739200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "organization" character varying NOT NULL DEFAULT '',
        CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
        CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "role" character varying NOT NULL DEFAULT 'user'`);
    await queryRunner.query(`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    // Existing sign-ups stored emails as typed; the app now normalises to lowercase.
    await queryRunner.query(`UPDATE "user" SET "email" = lower(trim("email")) WHERE "email" <> lower(trim("email"))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
  }
}
