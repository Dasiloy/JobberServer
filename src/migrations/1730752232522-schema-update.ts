import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1730752232522 implements MigrationInterface {
    name = 'SchemaUpdate1730752232522'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "portfolio_item" DROP CONSTRAINT "FK_029146ff7a1648d7acd08730a54"`);
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_7643a722ca45fb721be1c63dc0c"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_30e98e8746699fb9af235410aff"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id_verified"`);
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "REL_7643a722ca45fb721be1c63dc0"`);
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP COLUMN "session_id"`);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "expired_at"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "REL_30e98e8746699fb9af235410af"`);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "session" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "UQ_3d2f174ef04fb312fdebd0ddc53" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "session" ADD "refreshTokenId" uuid`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "UQ_45d318cea84597d3cfc5be32230" UNIQUE ("refreshTokenId")`);
        await queryRunner.query(`ALTER TYPE "public"."job_profession_enum" RENAME TO "job_profession_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."job_profession_enum" AS ENUM('marketer', 'ux designer', 'accountant', 'app developer', 'product manager', 'software engineer', 'graphics designer')`);
        await queryRunner.query(`ALTER TABLE "job" ALTER COLUMN "profession" TYPE "public"."job_profession_enum" USING "profession"::"text"::"public"."job_profession_enum"`);
        await queryRunner.query(`DROP TYPE "public"."job_profession_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."profile_job_profession_enum" RENAME TO "profile_job_profession_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."profile_job_profession_enum" AS ENUM('marketer', 'ux designer', 'accountant', 'app developer', 'product manager', 'software engineer', 'graphics designer')`);
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "job_profession" TYPE "public"."profile_job_profession_enum" USING "job_profession"::"text"::"public"."profile_job_profession_enum"`);
        await queryRunner.query(`DROP TYPE "public"."profile_job_profession_enum_old"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "resume_url"`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "resume_url" text`);
        await queryRunner.query(`ALTER TABLE "portfolio_item" ADD CONSTRAINT "FK_029146ff7a1648d7acd08730a54" FOREIGN KEY ("portfolioId") REFERENCES "portfolio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_45d318cea84597d3cfc5be32230" FOREIGN KEY ("refreshTokenId") REFERENCES "refresh_token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_45d318cea84597d3cfc5be32230"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`);
        await queryRunner.query(`ALTER TABLE "portfolio_item" DROP CONSTRAINT "FK_029146ff7a1648d7acd08730a54"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "resume_url"`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "resume_url" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."profile_job_profession_enum_old" AS ENUM('marketer', 'ux_designer', 'accountant', 'app_developer', 'product manager', 'software engineer', 'graphics designer')`);
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "job_profession" TYPE "public"."profile_job_profession_enum_old" USING "job_profession"::"text"::"public"."profile_job_profession_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."profile_job_profession_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."profile_job_profession_enum_old" RENAME TO "profile_job_profession_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."job_profession_enum_old" AS ENUM('marketer', 'ux_designer', 'accountant', 'app_developer', 'product manager', 'software engineer', 'graphics designer')`);
        await queryRunner.query(`ALTER TABLE "job" ALTER COLUMN "profession" TYPE "public"."job_profession_enum_old" USING "profession"::"text"::"public"."job_profession_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."job_profession_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."job_profession_enum_old" RENAME TO "job_profession_enum"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "UQ_45d318cea84597d3cfc5be32230"`);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "refreshTokenId"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "UQ_3d2f174ef04fb312fdebd0ddc53"`);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "session" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "REL_30e98e8746699fb9af235410af" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "session" ADD "expired_at" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD "session_id" uuid`);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD CONSTRAINT "REL_7643a722ca45fb721be1c63dc0" UNIQUE ("session_id")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "id_verified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_30e98e8746699fb9af235410aff" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_7643a722ca45fb721be1c63dc0c" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "portfolio_item" ADD CONSTRAINT "FK_029146ff7a1648d7acd08730a54" FOREIGN KEY ("portfolioId") REFERENCES "portfolio"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
