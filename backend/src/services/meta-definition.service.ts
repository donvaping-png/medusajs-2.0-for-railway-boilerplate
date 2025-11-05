import { EntityManager } from "@mikro-orm/postgresql"
import { MetaDefinition } from "../models/meta-definition"

type CreateOrUpdateDefinitionInput = {
  scope: string
  key: string
  label?: string
  type: "text" | "richtext" | "number" | "boolean" | "date" | "select" | "json" | "image"
  required?: boolean
  options?: Record<string, any>
  default_value?: any
  validations?: Record<string, any>
}

type InjectedDependencies = {
  manager: EntityManager
}

export default class MetaDefinitionService {
  protected readonly manager_: EntityManager

  constructor({ manager }: InjectedDependencies) {
    this.manager_ = manager
  }

  async createOrUpdate(input: CreateOrUpdateDefinitionInput): Promise<MetaDefinition> {
    const manager = this.manager_

    const existing = await manager.findOne(MetaDefinition, {
      scope: input.scope,
      key: input.key,
    })

    if (existing) {
      manager.assign(existing, {
        label: input.label,
        type: input.type,
        required: input.required ?? false,
        options: input.options,
        default_value: input.default_value,
        validations: input.validations,
      })
      await manager.flush()
      return existing
    }

    const definition = manager.create(MetaDefinition, {
      scope: input.scope,
      key: input.key,
      label: input.label,
      type: input.type,
      required: input.required ?? false,
      options: input.options,
      default_value: input.default_value,
      validations: input.validations,
    })

    await manager.persistAndFlush(definition)
    return definition
  }

  async list(scope: string): Promise<MetaDefinition[]> {
    const manager = this.manager_
    return await manager.find(MetaDefinition, { scope })
  }

  async remove(scope: string, key: string): Promise<void> {
    const manager = this.manager_
    const definition = await manager.findOne(MetaDefinition, { scope, key })
    
    if (definition) {
      await manager.removeAndFlush(definition)
    }
  }

  async findByKey(scope: string, key: string): Promise<MetaDefinition | null> {
    const manager = this.manager_
    return await manager.findOne(MetaDefinition, { scope, key })
  }
}
