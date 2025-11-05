import { EntityManager } from "@mikro-orm/postgresql"
import { MetaValue } from "../models/meta-value"
import { MetaDefinition } from "../models/meta-definition"
import Ajv from "ajv"
import addFormats from "ajv-formats"

const ajv = new Ajv({ allErrors: true })
addFormats(ajv)

type InjectedDependencies = {
  manager: EntityManager
}

export default class MetaValueService {
  protected readonly manager_: EntityManager

  constructor({ manager }: InjectedDependencies) {
    this.manager_ = manager
  }
  private validateValue(definition: MetaDefinition, value: any): { valid: boolean; errors?: string[] } {
    let schema: any = {}

    switch (definition.type) {
      case "text":
      case "richtext":
      case "image":
        schema = { type: "string" }
        if (definition.validations?.maxLength) {
          schema.maxLength = definition.validations.maxLength
        }
        if (definition.validations?.minLength) {
          schema.minLength = definition.validations.minLength
        }
        break
      case "number":
        schema = { type: "number" }
        if (definition.validations?.minimum !== undefined) {
          schema.minimum = definition.validations.minimum
        }
        if (definition.validations?.maximum !== undefined) {
          schema.maximum = definition.validations.maximum
        }
        break
      case "boolean":
        schema = { type: "boolean" }
        break
      case "date":
        schema = { type: "string", format: "date-time" }
        break
      case "select":
        schema = { type: "string" }
        if (definition.options?.enum) {
          schema.enum = definition.options.enum
        }
        break
      case "json":
        // Allow any valid JSON
        schema = {}
        break
    }

    const validate = ajv.compile(schema)
    const valid = validate(value)

    if (!valid && validate.errors) {
      return {
        valid: false,
        errors: validate.errors.map(err => `${err.instancePath} ${err.message}`),
      }
    }

    return { valid: true }
  }

  async getByCategoryId(categoryId: string): Promise<Record<string, any>> {
    const manager = this.manager_
    const scope = "category"

    const definitions = await manager.find(MetaDefinition, { scope })
    const values = await manager.find(MetaValue, { scope, scope_id: categoryId }, { populate: ["def"] })

    const result: Record<string, any> = {}

    for (const def of definitions) {
      const metaValue = values.find(v => v.def.id === def.id)
      result[def.key] = metaValue?.value ?? def.default_value ?? null
    }

    return result
  }

  async bulkUpsertCategory(
    categoryId: string,
    payload: Record<string, any>
  ): Promise<Record<string, any>> {
    const manager = this.manager_
    const scope = "category"

    // Validate payload is a plain object
    if (typeof payload !== "object" || Array.isArray(payload) || payload === null) {
      throw new Error("Payload must be a plain object")
    }

    const definitions = await manager.find(MetaDefinition, { scope })
    const errors: Record<string, string[]> = {}

    // Validate all values
    for (const [key, value] of Object.entries(payload)) {
      const def = definitions.find(d => d.key === key)
      if (!def) {
        errors[key] = [`Meta field '${key}' is not defined for scope '${scope}'`]
        continue
      }

      const validation = this.validateValue(def, value)
      if (!validation.valid) {
        errors[key] = validation.errors || ["Validation failed"]
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new Error(JSON.stringify({ message: "Validation failed", errors }))
    }

    // Upsert values
    for (const [key, value] of Object.entries(payload)) {
      const def = definitions.find(d => d.key === key)!

      const existing = await manager.findOne(MetaValue, {
        scope,
        scope_id: categoryId,
        def: def.id,
      })

      if (existing) {
        existing.value = value
      } else {
        const metaValue = manager.create(MetaValue, {
          scope,
          scope_id: categoryId,
          def,
          value,
        })
        manager.persist(metaValue)
      }
    }

    await manager.flush()

    return await this.getByCategoryId(categoryId)
  }

  async initDefaultsForNewCategory(categoryId: string): Promise<void> {
    const manager = this.manager_
    const scope = "category"

    const definitions = await manager.find(MetaDefinition, { scope })

    for (const def of definitions) {
      if (def.default_value !== undefined && def.default_value !== null) {
        const metaValue = manager.create(MetaValue, {
          scope,
          scope_id: categoryId,
          def,
          value: def.default_value,
        })
        manager.persist(metaValue)
      }
    }

    await manager.flush()
  }
}
