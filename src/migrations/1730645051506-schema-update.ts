import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1730645051506 implements MigrationInterface {
    name = 'SchemaUpdate1730645051506'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "portfolio_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(255) NOT NULL, "description" text NOT NULL, "portfolio_item_url" character varying(255) NOT NULL, "portfolioId" uuid, CONSTRAINT "PK_b880e6da04bde98e3f87796b102" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "portfolio" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6936bb92ca4b7cda0ff28794e48" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "portfolioId" uuid`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "UQ_fc8b03d6c74181e7b1f563775c1" UNIQUE ("portfolioId")`);
        await queryRunner.query(`ALTER TABLE "portfolio_item" ADD CONSTRAINT "FK_029146ff7a1648d7acd08730a54" FOREIGN KEY ("portfolioId") REFERENCES "portfolio"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_fc8b03d6c74181e7b1f563775c1" FOREIGN KEY ("portfolioId") REFERENCES "portfolio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_fc8b03d6c74181e7b1f563775c1"`);
        await queryRunner.query(`ALTER TABLE "portfolio_item" DROP CONSTRAINT "FK_029146ff7a1648d7acd08730a54"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "UQ_fc8b03d6c74181e7b1f563775c1"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "portfolioId"`);
        await queryRunner.query(`DROP TABLE "portfolio"`);
        await queryRunner.query(`DROP TABLE "portfolio_item"`);
    }

}
