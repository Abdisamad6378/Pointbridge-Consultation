import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAvatars1793279356971 implements MigrationInterface {
    name = 'UserAvatars1793279356971'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_avatar" ("userId" integer NOT NULL, "data" bytea NOT NULL, "mimeType" character varying(20) NOT NULL, CONSTRAINT "PK_bcc94c717ab29b1bfb17f28bfa2" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "avatarUpdatedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user_avatar" ADD CONSTRAINT "FK_bcc94c717ab29b1bfb17f28bfa2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_avatar" DROP CONSTRAINT "FK_bcc94c717ab29b1bfb17f28bfa2"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatarUpdatedAt"`);
        await queryRunner.query(`DROP TABLE "user_avatar"`);
    }

}
