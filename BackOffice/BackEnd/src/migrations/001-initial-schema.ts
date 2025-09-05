import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Habilitar extensiones necesarias
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    // Crear enum para estados de pedido
    await queryRunner.query(`
      CREATE TYPE "public"."order_status_enum" AS ENUM('PENDIENTE', 'LISTO')
    `);

    // Crear tabla de empleados
    await queryRunner.query(`
      CREATE TABLE "employees" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "username" character varying(100) NOT NULL,
        "password" character varying(255) NOT NULL,
        "fullName" character varying(255) NOT NULL,
        "email" character varying(255) NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_employees_username" UNIQUE ("username"),
        CONSTRAINT "UQ_employees_email" UNIQUE ("email"),
        CONSTRAINT "PK_employees" PRIMARY KEY ("id")
      )
    `);

    // Crear tabla de pedidos
    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "clienteNombre" character varying(255) NOT NULL,
        "clienteTelefono" character varying(20) NOT NULL,
        "archivos" jsonb NOT NULL DEFAULT '[]',
        "estado" "public"."order_status_enum" NOT NULL DEFAULT 'PENDIENTE',
        "paid" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_orders" PRIMARY KEY ("id")
      )
    `);

    // Crear índices para mejor rendimiento
    await queryRunner.query(`
      CREATE INDEX "IDX_orders_estado" ON "orders" ("estado")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_orders_createdAt" ON "orders" ("createdAt")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_employees_username" ON "employees" ("username")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_employees_email" ON "employees" ("email")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar índices
    await queryRunner.query(`DROP INDEX "IDX_employees_email"`);
    await queryRunner.query(`DROP INDEX "IDX_employees_username"`);
    await queryRunner.query(`DROP INDEX "IDX_orders_createdAt"`);
    await queryRunner.query(`DROP INDEX "IDX_orders_estado"`);

    // Eliminar tablas
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TABLE "employees"`);

    // Eliminar enum
    await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
  }
}
