import { MigrationInterface, QueryRunner } from "typeorm";

export class PasswordResetCodes1793302516791 implements MigrationInterface {
    name = 'PasswordResetCodes1793302516791'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "password_reset_code" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" integer NOT NULL, "codeHash" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "attempts" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_caf551f55fead4f0573395cf527" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c31d813e3a8a9aa9f9fac0663f" ON "password_reset_code"  ("userId") `);
        await queryRunner.query(`ALTER TABLE "password_reset_code" ADD CONSTRAINT "FK_c31d813e3a8a9aa9f9fac0663fd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password_reset_code" DROP CONSTRAINT "FK_c31d813e3a8a9aa9f9fac0663fd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c31d813e3a8a9aa9f9fac0663f"`);
        await queryRunner.query(`DROP TABLE "password_reset_code"`);
    }

}
