import { MigrationInterface, QueryRunner } from "typeorm";

export class ContentTables1793277298941 implements MigrationInterface {
    name = 'ContentTables1793277298941'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contact_message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "email" character varying(255) NOT NULL, "org" character varying(120), "subject" character varying(150) NOT NULL, "message" text NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'new', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1476ca9a6265a586f618ea918fd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "testimonial" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "role" character varying(150) NOT NULL, "quote" text NOT NULL, "image" text, "approved" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e1aee1c726db2d336480c69f7cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "site_image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying(100) NOT NULL, "label" character varying(150) NOT NULL, "url" text NOT NULL, "category" character varying(50) NOT NULL DEFAULT 'other', "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f4567fa38097244a30f61875073" UNIQUE ("key"), CONSTRAINT "PK_2cf835416ef9aef58ba08c3f3f1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "team_member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "role" character varying(150) NOT NULL, "bio" text NOT NULL DEFAULT '', "image" text NOT NULL DEFAULT '', "sortOrder" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_649680684d72a20d279641469c5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "client_logo" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(150) NOT NULL, "logo" text, "sortOrder" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_536a6f844b5dfbfd1c5f92e2112" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "client_logo"`);
        await queryRunner.query(`DROP TABLE "team_member"`);
        await queryRunner.query(`DROP TABLE "site_image"`);
        await queryRunner.query(`DROP TABLE "testimonial"`);
        await queryRunner.query(`DROP TABLE "contact_message"`);
    }

}
