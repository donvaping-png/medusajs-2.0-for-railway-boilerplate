import { Entity, PrimaryKey, Property, Unique } from "@mikro-orm/core"

export type MetaFieldType = "text" | "richtext" | "number" | "boolean" | "date" | "select" | "json" | "image"

@Entity({ tableName: "meta_definitions" })
@Unique({ properties: ["scope", "key"] })
export class MetaDefinition {
  @PrimaryKey({ type: "uuid", defaultRaw: "gen_random_uuid()" })
  id!: string

  @Property({ type: "text" })
  scope!: string

  @Property({ type: "text" })
  key!: string

  @Property({ type: "text", nullable: true })
  label?: string

  @Property({ type: "text" })
  type!: MetaFieldType

  @Property({ type: "boolean", default: false })
  required: boolean = false

  @Property({ type: "jsonb", nullable: true })
  options?: Record<string, any>

  @Property({ type: "jsonb", nullable: true })
  default_value?: any

  @Property({ type: "jsonb", nullable: true })
  validations?: Record<string, any>

  @Property({ type: "timestamptz", defaultRaw: "NOW()" })
  created_at: Date = new Date()

  @Property({ type: "timestamptz", defaultRaw: "NOW()", onUpdate: () => new Date() })
  updated_at: Date = new Date()
}
