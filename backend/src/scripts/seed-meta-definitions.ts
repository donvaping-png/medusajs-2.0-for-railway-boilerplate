import { MedusaContainer } from "@medusajs/framework/types"
import MetaDefinitionService from "../services/meta-definition.service"

export default async function seedMetaDefinitions(container: MedusaContainer) {
  const metaDefinitionService = container.resolve<MetaDefinitionService>("metaDefinitionService")

  console.log("Seeding meta field definitions for categories...")

  const definitions = [
    {
      scope: "category",
      key: "seo.short_description",
      label: "Short Description",
      type: "text" as const,
      required: false,
      default_value: "",
      validations: {
        maxLength: 500,
      },
    },
    {
      scope: "category",
      key: "seo.meta_title",
      label: "Meta Title",
      type: "text" as const,
      required: false,
      default_value: "",
      validations: {
        maxLength: 70,
      },
    },
    {
      scope: "category",
      key: "seo.meta_description",
      label: "Meta Description",
      type: "text" as const,
      required: false,
      default_value: "",
      validations: {
        maxLength: 160,
      },
    },
  ]

  for (const def of definitions) {
    try {
      await metaDefinitionService.createOrUpdate(def)
      console.log(`✓ Created/Updated definition: ${def.key}`)
    } catch (error) {
      console.error(`✗ Failed to create definition ${def.key}:`, error.message)
    }
  }

  console.log("Meta field definitions seeded successfully!")
}
