"use client"

import { useState, useCallback, useMemo } from "react"
import type {
  StickerConfiguration,
  ConfiguratorValidation,
  PriceCalculationParams,
} from "@/types/sticker-configurator"
import type { SubcategoryConfig } from "@/config/sticker-categories"

interface UseStickerConfiguratorProps {
  subcategoryConfig: SubcategoryConfig
  categorySlug: string
}

export function useStickerConfigurator({
  subcategoryConfig,
  categorySlug,
}: UseStickerConfiguratorProps) {
  const [config, setConfig] = useState<StickerConfiguration>({
    categorySlug,
    subcategorySlug: subcategoryConfig.slug,
    type: subcategoryConfig.allowedTypes[0]?.id || "",
    shape: subcategoryConfig.allowedShapes[0]?.id || "",
    material: subcategoryConfig.allowedMaterials[0]?.id || "",
    finish: subcategoryConfig.allowedFinishes[0]?.id || "",
    size: {
      preset: subcategoryConfig.presetSizes[0]?.label,
    },
    quantity: subcategoryConfig.minQuantity,
  })

  // Actualizar campo individual
  const updateField = useCallback(
    <K extends keyof StickerConfiguration>(
      field: K,
      value: StickerConfiguration[K]
    ) => {
      setConfig((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  // Actualizar tamaño
  const updateSize = useCallback(
    (preset?: string, custom?: { width: number; height: number }) => {
      setConfig((prev) => ({
        ...prev,
        size: { preset, custom },
      }))
    },
    []
  )

  // Actualizar imagen
  const updateImage = useCallback((file: File) => {
    const preview = URL.createObjectURL(file)
    setConfig((prev) => ({
      ...prev,
      image: { file, preview },
    }))
  }, [])

  // Limpiar imagen
  const clearImage = useCallback(() => {
    if (config.image?.preview) {
      URL.revokeObjectURL(config.image.preview)
    }
    setConfig((prev) => ({
      ...prev,
      image: undefined,
    }))
  }, [config.image?.preview])

  // Calcular precio mock
  const calculatePrice = useCallback(
    (params: PriceCalculationParams): number => {
      const { width, height, quantity, materialMultiplier, basePrice = 0.5 } =
        params

      // Área en cm²
      const area = width * height

      // Precio base por cm²
      let pricePerUnit = area * basePrice * materialMultiplier

      // Descuentos por volumen
      let volumeDiscount = 1.0
      if (quantity >= 1000) volumeDiscount = 0.7
      else if (quantity >= 500) volumeDiscount = 0.75
      else if (quantity >= 250) volumeDiscount = 0.8
      else if (quantity >= 100) volumeDiscount = 0.85
      else if (quantity >= 50) volumeDiscount = 0.9
      else if (quantity >= 25) volumeDiscount = 0.95

      pricePerUnit *= volumeDiscount

      // Precio total
      const totalPrice = pricePerUnit * quantity

      return Math.max(totalPrice, quantity * 0.5) // Precio mínimo
    },
    []
  )

  // Obtener dimensiones actuales
  const currentDimensions = useMemo(() => {
    if (config.size.custom) {
      return config.size.custom
    }
    if (config.size.preset) {
      const preset = subcategoryConfig.presetSizes.find(
        (p) => p.label === config.size.preset
      )
      if (preset) {
        return { width: preset.width, height: preset.height }
      }
    }
    return { width: 10, height: 10 } // Default
  }, [config.size, subcategoryConfig.presetSizes])

  // Calcular precio actual
  const currentPrice = useMemo(() => {
    const material = subcategoryConfig.allowedMaterials.find(
      (m) => m.id === config.material
    )
    const materialMultiplier = material?.priceMultiplier || 1.0

    return calculatePrice({
      width: currentDimensions.width,
      height: currentDimensions.height,
      quantity: config.quantity,
      materialMultiplier,
    })
  }, [
    config.material,
    config.quantity,
    currentDimensions,
    subcategoryConfig.allowedMaterials,
    calculatePrice,
  ])

  // Calcular precio unitario
  const unitPrice = useMemo(() => {
    return currentPrice / config.quantity
  }, [currentPrice, config.quantity])

  // Validar configuración
  const validation = useMemo((): ConfiguratorValidation => {
    const errors: ConfiguratorValidation["errors"] = {}

    if (!config.type) errors.type = "Selecciona un tipo"
    if (!config.shape) errors.shape = "Selecciona una forma"
    if (!config.material) errors.material = "Selecciona un material"
    if (!config.finish) errors.finish = "Selecciona un acabado"

    if (!config.size.preset && !config.size.custom) {
      errors.size = "Selecciona o define un tamaño"
    }

    if (config.size.custom) {
      const { width, height } = config.size.custom
      if (width <= 0 || height <= 0) {
        errors.size = "Las dimensiones deben ser mayores a 0"
      }
      if (
        subcategoryConfig.maxWidth &&
        width > subcategoryConfig.maxWidth
      ) {
        errors.size = `El ancho máximo es ${subcategoryConfig.maxWidth} cm`
      }
      if (
        subcategoryConfig.maxHeight &&
        height > subcategoryConfig.maxHeight
      ) {
        errors.size = `El alto máximo es ${subcategoryConfig.maxHeight} cm`
      }
    }

    if (config.quantity < subcategoryConfig.minQuantity) {
      errors.quantity = `La cantidad mínima es ${subcategoryConfig.minQuantity}`
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }, [config, subcategoryConfig])

  return {
    config,
    updateField,
    updateSize,
    updateImage,
    clearImage,
    currentPrice,
    unitPrice,
    currentDimensions,
    validation,
  }
}
