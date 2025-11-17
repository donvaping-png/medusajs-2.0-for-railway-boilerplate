"use client"

import { useStickerConfigurator } from "@/hooks/useStickerConfigurator"
import type { SubcategoryConfig } from "@/config/sticker-categories"

interface StickerConfiguratorProps {
  subcategoryConfig: SubcategoryConfig
  categorySlug: string
  productId?: string
  priceTable?: Array<{ qty: number; basePrice: number }>
  productImages?: Array<{ url: string; alt?: string }>
  onAddToCart?: (config: any) => void
}

export function StickerConfigurator({
  subcategoryConfig,
  categorySlug,
  productId,
  priceTable,
  productImages = [],
  onAddToCart,
}: StickerConfiguratorProps) {
  const {
    config,
    updateField,
    updateSize,
    updateImage,
    currentPrice,
    currentDimensions,
    validation,
  } = useStickerConfigurator({ subcategoryConfig, categorySlug })

  // Calcular precio desde tabla si está disponible
  const getPriceFromTable = (quantity: number): number | null => {
    if (!priceTable || priceTable.length === 0) return null
    
    const priceEntry = priceTable.find((p) => p.qty === quantity)
    return priceEntry ? priceEntry.basePrice : null
  }

  const displayPrice = getPriceFromTable(config.quantity) ?? currentPrice

  const handleAddToCart = () => {
    if (!validation.isValid) {
      alert("Por favor completa todos los campos requeridos")
      return
    }

    const payload = {
      productId: productId || `custom-sticker-${categorySlug}-${subcategoryConfig.slug}`,
      quantity: 1,
      unitPrice: displayPrice,
      metadata: {
        configurationType: "custom_sticker",
        category: categorySlug,
        subcategory: subcategoryConfig.slug,
        type: config.type,
        shape: config.shape,
        material: config.material,
        finish: config.finish,
        width: currentDimensions.width,
        height: currentDimensions.height,
        customQuantity: config.quantity,
        imageUrl: config.image?.url,
      },
    }

    console.log("[StickerConfigurator] Configuración completa:", payload)

    if (onAddToCart) {
      onAddToCart(payload)
    } else {
      const message = `🎨 Producto configurado: €${currentPrice.toFixed(2)}`
      alert(message)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      {/* Imágenes del producto - Izquierda */}
      <div className="lg:sticky lg:top-4 h-fit">
        {productImages && productImages.length > 0 ? (
          <div className="space-y-4">
            {/* Imagen principal */}
            <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center relative overflow-hidden">
              <img
                src={productImages[0].url}
                alt={productImages[0].alt || "Imagen del producto"}
                className="w-full h-full object-contain p-4"
              />
            </div>

            {/* Miniaturas */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-primary transition-all"
                  >
                    <img
                      src={image.url}
                      alt={image.alt || `Imagen ${index + 1}`}
                      className="w-full h-full object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center">
            <div className="text-center p-8">
              <svg
                className="w-24 h-24 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-500 text-sm">
                Sin imágenes disponibles
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Configurador - Derecha */}
      <div className="space-y-6">
        {/* Producto (Tipo) - Solo si hay más de un tipo */}
        {subcategoryConfig.allowedTypes &&
          subcategoryConfig.allowedTypes.length > 1 && (
            <div>
              <label className="block text-sm font-semibold mb-2">
                Producto
              </label>
              <select
                value={config.type}
                onChange={(e) => updateField("type", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Selecciona un tipo</option>
                {subcategoryConfig.allowedTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          )}

        {/* Forma */}
        <div>
          <label className="block text-sm font-semibold mb-3">Forma</label>
          <div className="space-y-2">
            {subcategoryConfig.allowedShapes.map((shape) => (
              <label
                key={shape.id}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors"
              >
                <input
                  type="radio"
                  name="shape"
                  value={shape.id}
                  checked={config.shape === shape.id}
                  onChange={(e) => updateField("shape", e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm">{shape.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Materiales */}
        <div>
          <label className="block text-sm font-semibold mb-3">
            Materiales
          </label>
          <div className="grid grid-cols-5 gap-3">
            {subcategoryConfig.allowedMaterials.map((material) => (
              <button
                key={material.id}
                onClick={() => updateField("material", material.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  config.material === material.id
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full ${
                    config.material === material.id
                      ? "bg-primary/20"
                      : "bg-gray-200"
                  }`}
                />
                <span className="text-xs text-center">{material.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Acabado - Solo si hay acabados configurados */}
        {subcategoryConfig.allowedFinishes &&
          subcategoryConfig.allowedFinishes.length > 0 && (
            <div>
              <label className="block text-sm font-semibold mb-2">
                Acabado
              </label>
              <select
                value={config.finish}
                onChange={(e) => updateField("finish", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Selecciona un acabado</option>
                {subcategoryConfig.allowedFinishes.map((finish) => (
                  <option key={finish.id} value={finish.id}>
                    {finish.name}
                  </option>
                ))}
              </select>
            </div>
          )}

        {/* Tamaño */}
        <div>
          <label className="block text-sm font-semibold mb-3">Tamaño</label>
          <div className="space-y-2">
            {subcategoryConfig.presetSizes.map((preset) => (
              <button
                key={preset.label}
                onClick={() => updateSize(preset.label, undefined)}
                className={`w-full text-left px-4 py-3 border rounded-lg transition-colors ${
                  config.size.preset === preset.label
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {preset.label}
              </button>
            ))}

            {subcategoryConfig.allowCustomSize && (
              <div className="pt-2">
                <button
                  onClick={() =>
                    updateSize(undefined, { width: 10, height: 10 })
                  }
                  className={`w-full text-left px-4 py-3 border rounded-lg transition-colors ${
                    config.size.custom
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  Tamaño personalizado
                </button>
                {config.size.custom && (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={config.size.custom.width}
                      onChange={(e) =>
                        updateSize(undefined, {
                          width: parseFloat(e.target.value) || 0,
                          height: config.size.custom?.height || 10,
                        })
                      }
                      placeholder="Ancho (cm)"
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={config.size.custom.height}
                      onChange={(e) =>
                        updateSize(undefined, {
                          width: config.size.custom?.width || 10,
                          height: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="Alto (cm)"
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Cantidad con tabla de precios */}
        <div>
          <label className="block text-sm font-semibold mb-3">Cantidad</label>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {subcategoryConfig.quantitySteps.map((qty, index) => {
                  const isSelected = config.quantity === qty
                  const price = getPriceFromTable(qty)
                  
                  // Calcular descuento si hay tabla de precios
                  let discount = 0
                  if (priceTable && priceTable.length > 0) {
                    const firstPrice = priceTable[0]
                    if (price && firstPrice) {
                      const pricePerUnit = price / qty
                      const firstPricePerUnit = firstPrice.basePrice / firstPrice.qty
                      discount = Math.round(((firstPricePerUnit - pricePerUnit) / firstPricePerUnit) * 100)
                    }
                  } else {
                    // Descuentos por defecto
                    if (qty >= 1000) discount = 30
                    else if (qty >= 500) discount = 25
                    else if (qty >= 250) discount = 20
                    else if (qty >= 100) discount = 15
                    else if (qty >= 50) discount = 10
                    else if (qty >= 25) discount = 5
                  }

                  return (
                    <tr
                      key={qty}
                      onClick={() => updateField("quantity", qty)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? "bg-primary/10" : "hover:bg-gray-50"
                      } ${index > 0 ? "border-t border-gray-100" : ""}`}
                    >
                      <td className="px-4 py-3 font-medium">{qty} uts</td>
                      <td className="px-4 py-3 text-right">
                        {price ? `${price.toFixed(2)} €` : isSelected ? `${displayPrice.toFixed(2)} €` : "—"}
                      </td>
                      {discount > 0 && (
                        <td className="px-4 py-3 text-right text-green-600 font-medium">
                          -{discount}%
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Cantidad personalizada */}
          <div className="mt-3">
            <input
              type="number"
              min={subcategoryConfig.minQuantity}
              value={config.quantity}
              onChange={(e) =>
                updateField("quantity", parseInt(e.target.value) || 0)
              }
              placeholder="Cantidad personalizada"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Subir imagen */}
        <div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) updateImage(file)
            }}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="block w-full py-4 px-6 bg-yellow-400 hover:bg-yellow-500 text-center font-semibold rounded-lg cursor-pointer transition-colors"
          >
            Subir una imagen
          </label>
          {config.image && (
            <p className="text-sm text-gray-600 mt-2 text-center">
              ✓ {config.image.file?.name}
            </p>
          )}
        </div>

        {/* Precio y botón añadir */}
        <div className="border-t pt-6 space-y-4">
          <div className="flex justify-between items-center text-lg">
            <span className="font-semibold">Total:</span>
            <span className="text-2xl font-bold text-primary">
              {displayPrice.toFixed(2)} €
            </span>
          </div>

          {!validation.isValid && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600 font-medium">
                Completa todos los campos requeridos
              </p>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={!validation.isValid}
            className={`w-full py-4 px-6 rounded-lg font-semibold transition-colors ${
              validation.isValid
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Añadir al Carrito
          </button>
        </div>
      </div>
    </div>
  )
}
