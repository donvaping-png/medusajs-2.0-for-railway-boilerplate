/**
 * Configuración central de categorías y subcategorías de pegatinas
 * Este archivo define toda la estructura de productos configurables
 */

export interface StickerType {
  id: string
  name: string
  description?: string
}

export interface StickerShape {
  id: string
  name: string
  description?: string
}

export interface StickerMaterial {
  id: string
  name: string
  description?: string
  priceMultiplier?: number
}

export interface StickerFinish {
  id: string
  name: string
  description?: string
}

export interface PresetSize {
  label: string
  width: number
  height: number
}

export interface SubcategoryConfig {
  id: string
  name: string
  slug: string
  description: string
  image?: string
  allowedTypes: StickerType[]
  allowedShapes: StickerShape[]
  allowedMaterials: StickerMaterial[]
  allowedFinishes: StickerFinish[]
  presetSizes: PresetSize[]
  allowCustomSize: boolean
  quantitySteps: number[]
  minQuantity: number
  maxWidth?: number
  maxHeight?: number
}

export interface CategoryConfig {
  id: string
  name: string
  slug: string
  description: string
  subcategories: Record<string, SubcategoryConfig>
}

// Tipos comunes reutilizables
const COMMON_TYPES: StickerType[] = [
  { id: "hojas", name: "Hojas de Pegatinas" },
  { id: "etiquetas_colgantes", name: "Pegatinas de Etiquetas Colgantes" },
  { id: "nojas", name: "Pegatinas de Nojas" },
]

const COMMON_SHAPES: StickerShape[] = [
  { id: "contorneada", name: "Contorneada", description: "Sigue el contorno del diseño" },
  { id: "cuadrada", name: "Cuadrada", description: "Forma cuadrada clásica" },
  { id: "circular", name: "Circular", description: "Forma redonda" },
  { id: "esquinas_redondeadas", name: "Esquinas Redondeadas", description: "Cuadrada con bordes suaves" },
]

const COMMON_FINISHES: StickerFinish[] = [
  { id: "lustroso", name: "Lustroso", description: "Acabado brillante con más reflejo" },
  { id: "satinado", name: "Satinado", description: "Acabado mate elegante" },
]

const COMMON_PRESET_SIZES: PresetSize[] = [
  { label: "4x4 cm", width: 4, height: 4 },
  { label: "5x5 cm", width: 5, height: 5 },
  { label: "7x7 cm", width: 7, height: 7 },
  { label: "10x10 cm", width: 10, height: 10 },
  { label: "15x15 cm", width: 15, height: 15 },
]

const COMMON_QUANTITY_STEPS = [10, 25, 50, 100, 250, 500, 1000]

// Configuración de categorías principales
export const STICKER_CATEGORIES: Record<string, CategoryConfig> = {
  pegatinas: {
    id: "pegatinas",
    name: "Pegatinas",
    slug: "pegatinas",
    description: "Pegatinas personalizadas de alta calidad para cualquier uso",
    subcategories: {
      holograficas: {
        id: "holograficas",
        name: "Pegatinas Holográficas",
        slug: "holograficas",
        description: "Pegatinas con efecto holográfico brillante y llamativo",
        allowedTypes: COMMON_TYPES,
        allowedShapes: COMMON_SHAPES,
        allowedMaterials: [
          { id: "holografico", name: "Holográfico", description: "Material con efecto arcoíris", priceMultiplier: 1.5 },
        ],
        allowedFinishes: COMMON_FINISHES,
        presetSizes: COMMON_PRESET_SIZES,
        allowCustomSize: true,
        quantitySteps: COMMON_QUANTITY_STEPS,
        minQuantity: 10,
        maxWidth: 50,
        maxHeight: 50,
      },
      broqueladas: {
        id: "broqueladas",
        name: "Pegatinas Broqueladas",
        slug: "broqueladas",
        description: "Pegatinas con acabado especial broquelado",
        allowedTypes: COMMON_TYPES,
        allowedShapes: COMMON_SHAPES,
        allowedMaterials: [
          { id: "vinilo_broquelado", name: "Vinilo Broquelado", description: "Vinilo con textura especial", priceMultiplier: 1.3 },
        ],
        allowedFinishes: COMMON_FINISHES,
        presetSizes: COMMON_PRESET_SIZES,
        allowCustomSize: true,
        quantitySteps: COMMON_QUANTITY_STEPS,
        minQuantity: 10,
        maxWidth: 50,
        maxHeight: 50,
      },
      transfer: {
        id: "transfer",
        name: "Pegatinas Transfer",
        slug: "transfer",
        description: "Pegatinas de transferencia para aplicación profesional",
        allowedTypes: COMMON_TYPES,
        allowedShapes: COMMON_SHAPES,
        allowedMaterials: [
          { id: "vinilo_transfer", name: "Vinilo Transfer", description: "Para aplicación con transfer", priceMultiplier: 1.2 },
        ],
        allowedFinishes: COMMON_FINISHES,
        presetSizes: COMMON_PRESET_SIZES,
        allowCustomSize: true,
        quantitySteps: COMMON_QUANTITY_STEPS,
        minQuantity: 10,
        maxWidth: 50,
        maxHeight: 50,
      },
      hojas: {
        id: "hojas",
        name: "Hojas de Pegatinas",
        slug: "hojas",
        description: "Múltiples pegatinas en una sola hoja",
        allowedTypes: [
          { id: "hoja_a4", name: "Hoja A4" },
          { id: "hoja_a5", name: "Hoja A5" },
        ],
        allowedShapes: COMMON_SHAPES,
        allowedMaterials: [
          { id: "vinilo_blanco", name: "Vinilo Blanco", priceMultiplier: 1.0 },
          { id: "vinilo_transparente", name: "Vinilo Transparente", priceMultiplier: 1.1 },
        ],
        allowedFinishes: COMMON_FINISHES,
        presetSizes: [
          { label: "A4 (21x29.7 cm)", width: 21, height: 29.7 },
          { label: "A5 (14.8x21 cm)", width: 14.8, height: 21 },
        ],
        allowCustomSize: false,
        quantitySteps: [10, 25, 50, 100, 250],
        minQuantity: 10,
      },
      paquetes: {
        id: "paquetes",
        name: "Paquetes de Pegatinas",
        slug: "paquetes",
        description: "Paquetes con múltiples diseños",
        allowedTypes: [
          { id: "paquete_mixto", name: "Paquete Mixto" },
          { id: "paquete_tematico", name: "Paquete Temático" },
        ],
        allowedShapes: COMMON_SHAPES,
        allowedMaterials: [
          { id: "vinilo_blanco", name: "Vinilo Blanco", priceMultiplier: 1.0 },
        ],
        allowedFinishes: COMMON_FINISHES,
        presetSizes: COMMON_PRESET_SIZES,
        allowCustomSize: true,
        quantitySteps: [25, 50, 100, 250, 500],
        minQuantity: 25,
        maxWidth: 30,
        maxHeight: 30,
      },
      servicio_impresado: {
        id: "servicio_impresado",
        name: "C-Servicio Impresado",
        slug: "servicio-impresado",
        description: "Servicio de impresión profesional",
        allowedTypes: COMMON_TYPES,
        allowedShapes: COMMON_SHAPES,
        allowedMaterials: [
          { id: "vinilo_premium", name: "Vinilo Premium", priceMultiplier: 1.4 },
        ],
        allowedFinishes: COMMON_FINISHES,
        presetSizes: COMMON_PRESET_SIZES,
        allowCustomSize: true,
        quantitySteps: COMMON_QUANTITY_STEPS,
        minQuantity: 10,
        maxWidth: 100,
        maxHeight: 100,
      },
      etiquetas_colgantes: {
        id: "etiquetas_colgantes",
        name: "Etiquetas Colgantes",
        slug: "etiquetas-colgantes",
        description: "Etiquetas para colgar en productos",
        allowedTypes: [
          { id: "etiqueta_perforada", name: "Etiqueta Perforada" },
          { id: "etiqueta_con_cuerda", name: "Etiqueta con Cuerda" },
        ],
        allowedShapes: [
          { id: "rectangular", name: "Rectangular" },
          { id: "circular", name: "Circular" },
          { id: "personalizada", name: "Personalizada" },
        ],
        allowedMaterials: [
          { id: "carton", name: "Cartón", priceMultiplier: 1.0 },
          { id: "carton_plastificado", name: "Cartón Plastificado", priceMultiplier: 1.2 },
        ],
        allowedFinishes: COMMON_FINISHES,
        presetSizes: [
          { label: "5x9 cm", width: 5, height: 9 },
          { label: "7x12 cm", width: 7, height: 12 },
          { label: "9x15 cm", width: 9, height: 15 },
        ],
        allowCustomSize: true,
        quantitySteps: [50, 100, 250, 500, 1000],
        minQuantity: 50,
        maxWidth: 20,
        maxHeight: 30,
      },
    },
  },
  etiquetas: {
    id: "etiquetas",
    name: "Etiquetas",
    slug: "etiquetas",
    description: "Etiquetas adhesivas para productos y embalajes",
    subcategories: {
      metalicas: {
        id: "metalicas",
        name: "Etiquetas Metálicas",
        slug: "metalicas",
        description: "Etiquetas con acabado metálico premium",
        allowedTypes: [
          { id: "etiqueta_producto", name: "Etiqueta de Producto" },
          { id: "etiqueta_marca", name: "Etiqueta de Marca" },
        ],
        allowedShapes: COMMON_SHAPES,
        allowedMaterials: [
          { id: "metalizado_plata", name: "Metalizado Plata", priceMultiplier: 1.6 },
          { id: "metalizado_oro", name: "Metalizado Oro", priceMultiplier: 1.7 },
        ],
        allowedFinishes: [
          { id: "brillante", name: "Brillante", description: "Acabado metálico brillante" },
          { id: "mate", name: "Mate", description: "Acabado metálico mate" },
        ],
        presetSizes: [
          { label: "3x3 cm", width: 3, height: 3 },
          { label: "5x5 cm", width: 5, height: 5 },
          { label: "7x7 cm", width: 7, height: 7 },
        ],
        allowCustomSize: true,
        quantitySteps: [50, 100, 250, 500, 1000],
        minQuantity: 50,
        maxWidth: 20,
        maxHeight: 20,
      },
      nino_blanco: {
        id: "nino_blanco",
        name: "Etiquetas de Nino Blanco",
        slug: "nino-blanco",
        description: "Etiquetas en material nino blanco",
        allowedTypes: [
          { id: "etiqueta_producto", name: "Etiqueta de Producto" },
        ],
        allowedShapes: COMMON_SHAPES,
        allowedMaterials: [
          { id: "nino_blanco", name: "Nino Blanco", description: "Material premium blanco", priceMultiplier: 1.3 },
        ],
        allowedFinishes: COMMON_FINISHES,
        presetSizes: COMMON_PRESET_SIZES,
        allowCustomSize: true,
        quantitySteps: [50, 100, 250, 500, 1000],
        minQuantity: 50,
        maxWidth: 30,
        maxHeight: 30,
      },
      alfa_verdes: {
        id: "alfa_verdes",
        name: "Etiquetas Alfa Verdes",
        slug: "alfa-verdes",
        description: "Etiquetas ecológicas en material alfa verde",
        allowedTypes: [
          { id: "etiqueta_eco", name: "Etiqueta Ecológica" },
        ],
        allowedShapes: COMMON_SHAPES,
        allowedMaterials: [
          { id: "alfa_verde", name: "Alfa Verde", description: "Material ecológico", priceMultiplier: 1.4 },
        ],
        allowedFinishes: COMMON_FINISHES,
        presetSizes: COMMON_PRESET_SIZES,
        allowCustomSize: true,
        quantitySteps: [50, 100, 250, 500, 1000],
        minQuantity: 50,
        maxWidth: 30,
        maxHeight: 30,
      },
    },
  },
}

// Helper para obtener una categoría
export function getCategory(categorySlug: string): CategoryConfig | undefined {
  return STICKER_CATEGORIES[categorySlug]
}

// Helper para obtener una subcategoría
export function getSubcategory(
  categorySlug: string,
  subcategorySlug: string
): SubcategoryConfig | undefined {
  const category = getCategory(categorySlug)
  if (!category) return undefined
  return Object.values(category.subcategories).find(
    (sub) => sub.slug === subcategorySlug
  )
}

// Helper para obtener todas las subcategorías de una categoría
export function getSubcategories(categorySlug: string): SubcategoryConfig[] {
  const category = getCategory(categorySlug)
  if (!category) return []
  return Object.values(category.subcategories)
}
