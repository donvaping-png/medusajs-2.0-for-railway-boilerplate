import { Entity, PrimaryKey, Property, ManyToOne, Unique } from "@mikro-orm/core"
import { MetaDefinition } from "./meta-definition"

@Entity({ tableName: "meta_values" })
@Unique({ properties: ["scope", "scope_id", "def"] })
export class MetaValue {
  @PrimaryKey({ type: "uuid", defaultRaw: "gen_random_uuid()" })
  id!: string

  @Property({ type: "text" })
  scope!: string

  @Property({ type: "text" })
  scope_id!: string

  @ManyToOne(() => MetaDefinition, { fieldName: "def_id" })
  def!: MetaDefinition

  @Property({ type: "jsonb", nullable: true })
  value?: any

  @Property({ type: "timestamptz", defaultRaw: "NOW()" })
  created_at: Date = new Date()

  @Property({ type: "timestamptz", defaultRaw: "NOW()", onUpdate: () => new Date() })
  updated_at: Date = new Date()
}
