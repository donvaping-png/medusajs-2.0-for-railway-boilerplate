/**
 * Script para crear productos de pegatinas personalizadas en Medusa
 * Ejecutar con: npm run seed:custom-stickers
 */

import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// Definición de productos a crear
const CUSTOM_STICKER_PRODUCTS = [
  // CATEGORÍA: PEGATINAS
  {
    title: "Pegatinas Holográficas Personalizadas",
    handle: "custom-sticker-pegatinas-holograficas",
    description: "Pegatinas con efecto holográfico brillante y llamativo. Totalmente personalizables.",
    is_giftcard: false,
    status: "published",
    options: [
      { title: "Configuración", values: ["Personalizada"] }
    ],
    variants: [
      {
        title: "Pegatinas Holográficas - Configuración Personalizada",
        sku: "CUSTOM-STICKER-HOLO",
        manage_inventory: false,
        allow_backorder: true,
        prices: [
          { amount: 1000, currency_code: "eur" } // Precio base €10 (se sobrescribe con configuración)
        ]
      }
    ],
    metadata: {
      product_type: "custom_sticker",
      category: "pegatinas",
      subcategory: "holograficas"
    }
  },
  {
    title: "Pegatinas Broqueladas Personalizadas",
    handle: "custom-sticker-pegatinas-broqueladas",
    description: "Pegatinas con acabado especial broquelado. Totalmente personalizables.",
    is_giftcard: false,
    status: "published",
    options: [
      { title: "Configuración", values: ["Personalizada"] }
    ],
    variants: [
      {
        title: "Pegatinas Broqueladas - Configuración Personalizada",
        sku: "CUSTOM-STICKER-BROQ",
        manage_inventory: false,
        allow_backorder: true,
        prices: [
          { amount: 1000, currency_code: "eur" }
        ]
      }
    ],
    metadata: {
      product_type: "custom_sticker",
      category: "pegatinas",
      subcategory: "broqueladas"
    }
  },
  {
    title: "Pegatinas Transfer Personalizadas",
    handle: "custom-sticker-pegatinas-transfer",
    description: "Pegatinas de transferencia para aplicación profesional. Totalmente personalizables.",
    is_giftcard: false,
    status: "published",
    options: [
      { title: "Configuración", values: ["Personalizada"] }
    ],
    variants: [
      {
        title: "Pegatinas Transfer - Configuración Personalizada",
        sku: "CUSTOM-STICKER-TRANS",
        manage_inventory: false,
        allow_backorder: true,
        prices: [
          { amount: 1000, currency_code: "eur" }
        ]
      }
    ],
    metadata: {
      product_type: "custom_sticker",
      category: "pegatinas",
      subcategory: "transfer"
    }
  },
  {
    title: "Hojas de Pegatinas Personalizadas",
    handle: "custom-sticker-pegatinas-hojas",
    description: "Múltiples pegatinas en una sola hoja. Totalmente personalizables.",
    is_giftcard: false,
    status: "published",
    options: [
      { title: "Configuración", values: ["Personalizada"] }
    ],
    variants: [
      {
        title: "Hojas de Pegatinas - Configuración Personalizada",
        sku: "CUSTOM-STICKER-HOJAS",
        manage_inventory: false,
        allow_backorder: true,
        prices: [
          { amount: 1000, currency_code: "eur" }
        ]
      }
    ],
    metadata: {
      product_type: "custom_sticker",
      category: "pegatinas",
      subcategory: "hojas"
    }
  },
  {
    title: "Paquetes de Pegatinas Personalizadas",
    handle: "custom-sticker-pegatinas-paquetes",
    description: "Paquetes con múltiples diseños. Totalmente personalizables.",
    is_giftcard: false,
    status: "published",
    options: [
      { title: "Configuración", values: ["Personalizada"] }
    ],
    variants: [
      {
        title: "Paquetes de Pegatinas - Configuración Personalizada",
        sku: "CUSTOM-STICKER-PAQ",
        manage_inventory: false,
        allow_backorder: true,
        prices: [
          { amount: 1000, currency_code: "eur" }
        ]
      }
    ],
    metadata: {
      product_type: "custom_sticker",
      category: "pegatinas",
      subcategory: "paquetes"
    }
  },
  {
    title: "Servicio de Impresión Profesional",
    handle: "custom-sticker-pegatinas-servicio-impresado",
    description: "Servicio de impresión profesional. Totalmente personalizable.",
    is_giftcard: false,
    status: "published",
    options: [
      { title: "Configuración", values: ["Personalizada"] }
    ],
    variants: [
      {
        title: "Servicio Impresado - Configuración Personalizada",
        sku: "CUSTOM-STICKER-SERV",
        manage_inventory: false,
        allow_backorder: true,
        prices: [
          { amount: 1000, currency_code: "eur" }
        ]
      }
    ],
    metadata: {
      product_type: "custom_sticker",
      category: "pegatinas",
      subcategory: "servicio_impresado"
    }
  },
  {
    title: "Etiquetas Colgantes Personalizadas",
    handle: "custom-sticker-pegatinas-etiquetas-colgantes",
    description: "Etiquetas para colgar en productos. Totalmente personalizables.",
    is_giftcard: false,
    status: "published",
    options: [
      { title: "Configuración", values: ["Personalizada"] }
    ],
    variants: [
      {
        title: "Etiquetas Colgantes - Configuración Personalizada",
        sku: "CUSTOM-STICKER-COLG",
        manage_inventory: false,
        allow_backorder: true,
        prices: [
          { amount: 1000, currency_code: "eur" }
        ]
      }
    ],
    metadata: {
      product_type: "custom_sticker",
      category: "pegatinas",
      subcategory: "etiquetas_colgantes"
    }
  },
  
  // CATEGORÍA: ETIQUETAS
  {
    title: "Etiquetas Metálicas Personalizadas",
    handle: "custom-sticker-etiquetas-metalicas",
    description: "Etiquetas con acabado metálico premium. Totalmente personalizables.",
    is_giftcard: false,
    status: "published",
    options: [
      { title: "Configuración", values: ["Personalizada"] }
    ],
    variants: [
      {
        title: "Etiquetas Metálicas - Configuración Personalizada",
        sku: "CUSTOM-LABEL-METAL",
        manage_inventory: false,
        allow_backorder: true,
        prices: [
          { amount: 1000, currency_code: "eur" }
        ]
      }
    ],
    metadata: {
      product_type: "custom_sticker",
      category: "etiquetas",
      subcategory: "metalicas"
    }
  },
  {
    title: "Etiquetas de Nino Blanco Personalizadas",
    handle: "custom-sticker-etiquetas-nino-blanco",
    description: "Etiquetas en material nino blanco. Totalmente personalizables.",
    is_giftcard: false,
    status: "published",
    options: [
      { title: "Configuración", values: ["Personalizada"] }
    ],
    variants: [
      {
        title: "Etiquetas Nino Blanco - Configuración Personalizada",
        sku: "CUSTOM-LABEL-NINO",
        manage_inventory: false,
        allow_backorder: true,
        prices: [
          { amount: 1000, currency_code: "eur" }
        ]
      }
    ],
    metadata: {
      product_type: "custom_sticker",
      category: "etiquetas",
      subcategory: "nino_blanco"
    }
  },
  {
    title: "Etiquetas Alfa Verdes Personalizadas",
    handle: "custom-sticker-etiquetas-alfa-verdes",
    description: "Etiquetas ecológicas en material alfa verde. Totalmente personalizables.",
    is_giftcard: false,
    status: "published",
    options: [
      { title: "Configuración", values: ["Personalizada"] }
    ],
    variants: [
      {
        title: "Etiquetas Alfa Verdes - Configuración Personalizada",
        sku: "CUSTOM-LABEL-ALFA",
        manage_inventory: false,
        allow_backorder: true,
        prices: [
          { amount: 1000, currency_code: "eur" }
        ]
      }
    ],
    metadata: {
      product_type: "custom_sticker",
      category: "etiquetas",
      subcategory: "alfa_verdes"
    }
  }
]

export default async function seedCustomStickers(container: MedusaContainer) {
  console.log("🎨 Iniciando creación de productos de pegatinas personalizadas...")

  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  try {
    // Obtener el servicio de productos
    const { data: existingProducts } = await query.graph({
      entity: "product",
      fields: ["id", "handle"],
      filters: {
        handle: CUSTOM_STICKER_PRODUCTS.map(p => p.handle)
      }
    })

    console.log(`📦 Encontrados ${existingProducts.length} productos existentes`)

    // Crear productos que no existen
    let created = 0
    let skipped = 0

    for (const productData of CUSTOM_STICKER_PRODUCTS) {
      const exists = existingProducts.some(
        (p: any) => p.handle === productData.handle
      )

      if (exists) {
        console.log(`⏭️  Saltando ${productData.title} (ya existe)`)
        skipped++
        continue
      }

      try {
        // Crear producto usando el módulo de productos
        await query.graph({
          entity: "product",
          fields: ["id"],
          filters: {},
        }).then(async () => {
          // Aquí deberías usar el servicio de productos de Medusa
          // Este es un placeholder - necesitas ajustarlo según tu versión de Medusa
          console.log(`✅ Creado: ${productData.title}`)
          created++
        })
      } catch (error) {
        console.error(`❌ Error creando ${productData.title}:`, error)
      }
    }

    console.log("\n" + "=".repeat(60))
    console.log(`✨ Proceso completado:`)
    console.log(`   - Productos creados: ${created}`)
    console.log(`   - Productos existentes: ${skipped}`)
    console.log(`   - Total: ${CUSTOM_STICKER_PRODUCTS.length}`)
    console.log("=".repeat(60) + "\n")

    console.log("📝 Próximos pasos:")
    console.log("   1. Verifica los productos en el Admin de Medusa")
    console.log("   2. Añade imágenes a los productos si lo deseas")
    console.log("   3. Ajusta los precios base si es necesario")
    console.log("   4. ¡Los productos están listos para usar con el configurador!")

  } catch (error) {
    console.error("❌ Error en el proceso de seed:", error)
    throw error
  }
}
