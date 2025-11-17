/**
 * Script para crear metafields del configurador de pegatinas
 * Ejecutar con: npm run seed:product-metafields
 */

import { MedusaContainer } from "@medusajs/framework/types"
import { EntityManager } from "@mikro-orm/postgresql"
import { MetaDefinition } from "../models/meta-definition"

export default async function seedProductConfiguratorMetafields(
  container: MedusaContainer
) {
  const manager = container.resolve<EntityManager>("manager")

  console.log("🎨 Creando metafields para configurador de pegatinas...")

  const definitions = [
    // 1. Tipo de producto
    {
      scope: "product",
      key: "product_type",
      label: "Tipo de Producto",
      type: "select" as const,
      required: false,
      options: {
        enum: ["custom_sticker", "standard"],
      },
      default_value: "standard",
    },

    // 2. Formas disponibles
    {
      scope: "product",
      key: "config.shapes",
      label: "Formas Disponibles",
      type: "json" as const,
      required: false,
      default_value: ["contorneado", "cuadrado", "circular", "esquinas_redondeadas"],
      validations: {
        description: 'Array de strings: ["contorneado", "cuadrado", "circular", "esquinas_redondeadas"]',
      },
    },

    // 3. Materiales
    {
      scope: "product",
      key: "config.materials",
      label: "Materiales",
      type: "json" as const,
      required: false,
      default_value: [
        {
          id: "vinilo",
          name: "Vinilo",
          priceMultiplier: 1.0,
        },
      ],
      validations: {
        description: 'Array de objetos: [{"id": "vinilo", "name": "Vinilo", "priceMultiplier": 1.0}]',
      },
    },

    // 4. Tamaños
    {
      scope: "product",
      key: "config.sizes",
      label: "Tamaños Disponibles",
      type: "json" as const,
      required: false,
      default_value: [
        { label: "5x5 cm", width: 5, height: 5 },
        { label: "10x10 cm", width: 10, height: 10 },
      ],
      validations: {
        description: 'Array de objetos: [{"label": "5x5 cm", "width": 5, "height": 5}]',
      },
    },

    // 5. Cantidades y precios
    {
      scope: "product",
      key: "config.quantities",
      label: "Cantidades y Precios",
      type: "json" as const,
      required: false,
      default_value: [
        { qty: 50, basePrice: 25.0 },
        { qty: 100, basePrice: 45.0 },
      ],
      validations: {
        description: 'Array de objetos: [{"qty": 50, "basePrice": 25.00}]',
      },
    },

    // 6. Acabados (opcional)
    {
      scope: "product",
      key: "config.finishes",
      label: "Acabados Disponibles",
      type: "json" as const,
      required: false,
      default_value: null,
      validations: {
        description: 'Array de objetos: [{"id": "mate", "name": "Mate"}] o null para no mostrar',
      },
    },

    // 7. Permitir tamaño personalizado
    {
      scope: "product",
      key: "config.allowCustomSize",
      label: "Permitir Tamaño Personalizado",
      type: "boolean" as const,
      required: false,
      default_value: false,
    },

    // 8. Cantidad mínima
    {
      scope: "product",
      key: "config.minQuantity",
      label: "Cantidad Mínima",
      type: "number" as const,
      required: false,
      default_value: 10,
      validations: {
        minimum: 1,
      },
    },

    // 9. Ancho máximo (para tamaño personalizado)
    {
      scope: "product",
      key: "config.maxWidth",
      label: "Ancho Máximo (cm)",
      type: "number" as const,
      required: false,
      default_value: null,
      validations: {
        minimum: 1,
      },
    },

    // 10. Alto máximo (para tamaño personalizado)
    {
      scope: "product",
      key: "config.maxHeight",
      label: "Alto Máximo (cm)",
      type: "number" as const,
      required: false,
      default_value: null,
      validations: {
        minimum: 1,
      },
    },
  ]

  let created = 0
  let updated = 0
  let errors = 0

  for (const def of definitions) {
    try {
      const existing = await manager.findOne(MetaDefinition, {
        scope: def.scope,
        key: def.key,
      })

      if (existing) {
        // Actualizar
        Object.assign(existing, def)
        await manager.persistAndFlush(existing)
        console.log(`✓ Actualizado: ${def.key}`)
        updated++
      } else {
        // Crear
        const metaDef = manager.create(MetaDefinition, def)
        await manager.persistAndFlush(metaDef)
        console.log(`✓ Creado: ${def.key}`)
        created++
      }
    } catch (error) {
      console.error(`✗ Error con ${def.key}:`, error.message)
      errors++
    }
  }

  console.log("\n" + "=".repeat(60))
  console.log("✨ Proceso completado:")
  console.log(`   - Creados: ${created}`)
  console.log(`   - Actualizados: ${updated}`)
  console.log(`   - Errores: ${errors}`)
  console.log(`   - Total: ${definitions.length}`)
  console.log("=".repeat(60) + "\n")

  console.log("📝 Próximos pasos:")
  console.log("   1. Ve al Admin de Medusa")
  console.log("   2. Edita un producto")
  console.log("   3. Verás los nuevos campos de metadata")
  console.log("   4. Configura las opciones del configurador")
  console.log("   5. ¡Listo!")
}
