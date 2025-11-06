import { Migration } from '@mikro-orm/migrations';

export class Migration20251106135610 extends Migration {
  async up(): Promise<void> {
    // Crear tabla bundle
    this.addSql(`
      CREATE TABLE IF NOT EXISTS "bundle" (
        "id" text NOT NULL,
        "title" text NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz NULL,
        CONSTRAINT "bundle_pkey" PRIMARY KEY ("id")
      );
    `);

    // Crear índice para deleted_at
    this.addSql(`
      CREATE INDEX IF NOT EXISTS "IDX_bundle_deleted_at" 
      ON "bundle" ("deleted_at") 
      WHERE "deleted_at" IS NOT NULL;
    `);

    // Crear tabla bundle_item
    this.addSql(`
      CREATE TABLE IF NOT EXISTS "bundle_item" (
        "id" text NOT NULL,
        "quantity" integer NOT NULL DEFAULT 1,
        "bundle_id" text NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz NULL,
        CONSTRAINT "bundle_item_pkey" PRIMARY KEY ("id")
      );
    `);

    // Agregar foreign key de bundle_item a bundle
    this.addSql(`
      ALTER TABLE "bundle_item" 
      ADD CONSTRAINT "bundle_item_bundle_id_foreign" 
      FOREIGN KEY ("bundle_id") 
      REFERENCES "bundle" ("id") 
      ON UPDATE CASCADE 
      ON DELETE CASCADE;
    `);

    // Crear índices para bundle_item
    this.addSql(`
      CREATE INDEX IF NOT EXISTS "IDX_bundle_item_bundle_id" 
      ON "bundle_item" ("bundle_id");
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS "IDX_bundle_item_deleted_at" 
      ON "bundle_item" ("deleted_at") 
      WHERE "deleted_at" IS NOT NULL;
    `);

    // Crear tabla de link bundle <> product
    this.addSql(`
      CREATE TABLE IF NOT EXISTS "link_bundle_product" (
        "id" text NOT NULL,
        "bundle_id" text NOT NULL,
        "product_id" text NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz NULL,
        CONSTRAINT "link_bundle_product_pkey" PRIMARY KEY ("id")
      );
    `);

    // Crear índices para link bundle <> product
    this.addSql(`
      CREATE INDEX IF NOT EXISTS "IDX_link_bundle_product_bundle_id" 
      ON "link_bundle_product" ("bundle_id");
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS "IDX_link_bundle_product_product_id" 
      ON "link_bundle_product" ("product_id");
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS "IDX_link_bundle_product_deleted_at" 
      ON "link_bundle_product" ("deleted_at") 
      WHERE "deleted_at" IS NOT NULL;
    `);

    // Crear unique constraint para evitar duplicados
    this.addSql(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_link_bundle_product_unique" 
      ON "link_bundle_product" ("bundle_id", "product_id") 
      WHERE "deleted_at" IS NULL;
    `);

    // Crear tabla de link bundle_item <> product
    this.addSql(`
      CREATE TABLE IF NOT EXISTS "link_bundle_item_product" (
        "id" text NOT NULL,
        "bundle_item_id" text NOT NULL,
        "product_id" text NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz NULL,
        CONSTRAINT "link_bundle_item_product_pkey" PRIMARY KEY ("id")
      );
    `);

    // Crear índices para link bundle_item <> product
    this.addSql(`
      CREATE INDEX IF NOT EXISTS "IDX_link_bundle_item_product_bundle_item_id" 
      ON "link_bundle_item_product" ("bundle_item_id");
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS "IDX_link_bundle_item_product_product_id" 
      ON "link_bundle_item_product" ("product_id");
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS "IDX_link_bundle_item_product_deleted_at" 
      ON "link_bundle_item_product" ("deleted_at") 
      WHERE "deleted_at" IS NOT NULL;
    `);

    // Crear unique constraint para evitar duplicados
    this.addSql(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_link_bundle_item_product_unique" 
      ON "link_bundle_item_product" ("bundle_item_id", "product_id") 
      WHERE "deleted_at" IS NULL;
    `);
  }

  async down(): Promise<void> {
    // Eliminar tablas en orden inverso
    this.addSql('DROP TABLE IF EXISTS "link_bundle_item_product" CASCADE;');
    this.addSql('DROP TABLE IF EXISTS "link_bundle_product" CASCADE;');
    this.addSql('DROP TABLE IF EXISTS "bundle_item" CASCADE;');
    this.addSql('DROP TABLE IF EXISTS "bundle" CASCADE;');
  }
}
