import { Migration } from '@mikro-orm/migrations';

export class Migration20241105000000 extends Migration {

  async up(): Promise<void> {
    this.addSql('ALTER TABLE "product" ADD COLUMN "seo_title" TEXT NULL;');
    this.addSql('ALTER TABLE "product" ADD COLUMN "seo_description" TEXT NULL;');
    this.addSql('ALTER TABLE "product" ADD COLUMN "short_description" TEXT NULL;');
  }

  async down(): Promise<void> {
    this.addSql('ALTER TABLE "product" DROP COLUMN IF EXISTS "seo_title";');
    this.addSql('ALTER TABLE "product" DROP COLUMN IF EXISTS "seo_description";');
    this.addSql('ALTER TABLE "product" DROP COLUMN IF EXISTS "short_description";');
  }

}
