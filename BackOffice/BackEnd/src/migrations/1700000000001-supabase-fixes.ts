import { MigrationInterface, QueryRunner } from 'typeorm';

export class SupabaseFixes1700000000001 implements MigrationInterface {
  name = 'SupabaseFixes1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1) Extensión para gen_random_uuid()
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

    // 2) Defaults UUID (idempotente)
    await queryRunner.query(`ALTER TABLE IF EXISTS "employees" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "orders"    ALTER COLUMN "id" SET DEFAULT gen_random_uuid();`);

    // 3) Convertir isActive -> boolean SOLO si no es boolean, casteando a texto
    await queryRunner.query(`
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'employees'
      AND column_name  = 'isActive'
      AND data_type   <> 'boolean'
  ) THEN
    EXECUTE $sql$
      ALTER TABLE "employees"
      ALTER COLUMN "isActive" TYPE boolean
      USING CASE
              WHEN ("isActive")::text IN ('1','t','true','TRUE','y','yes') THEN true
              WHEN ("isActive")::text IN ('0','f','false','FALSE','n','no') THEN false
              ELSE false
            END
    $sql$;
  END IF;
END
$$;
    `);

    // 4) Asegurar valores del enum (idempotente)
    await queryRunner.query(`
DO $$
BEGIN
  BEGIN
    ALTER TYPE "public"."order_status_enum" ADD VALUE IF NOT EXISTS 'PROCESO';
    ALTER TYPE "public"."order_status_enum" ADD VALUE IF NOT EXISTS 'FINALIZADO';
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END
$$;
    `);
  }

  public async down(): Promise<void> {
    // no-op
  }
}
