import type { StickerConfiguration, ConfiguratorValidation } from "@/types/sticker-configurator"
import type { SubcategoryConfig } from "@/config/sticker-categories"

interface ConfiguratorSummaryProps {
  config: StickerConfiguration
  subcategoryConfig: SubcategoryConfig
  currentPrice: number
  unitPrice: number
  currentDimensions: { width: number; height: number }
  validation: ConfiguratorValidation
  onAddToCart: () => void
}

export function ConfiguratorSummary({
  config,
  subcategoryConfig,
  currentPrice,
  unitPrice,
  currentDimensions,
  validation,
  onAddToCart,
}: ConfiguratorSummaryProps) {
  const getTypeName = () => {
    return subcategoryConfig.allowedTypes.find((t) => t.id === config.type)?.name || "-"
  }

  const getShapeName = () => {
    return subcategoryConfig.allowedShapes.find((s) => s.id === config.shape)?.name || "-"
  }

  const getMaterialName = () => {
    return subcategoryConfig.allowedMaterials.find((m) => m.id === config.material)?.name || "-"
  }

  const getFinishName = () => {
    return subcategoryConfig.allowedFinishes.find((f) => f.id === config.finish)?.name || "-"
  }

  return (
    <div className="bg-white rounded-lg border p-6 lg:sticky lg:top-4">
      <h3 className="text-xl font-bold mb-4">Resumen del Pedido</h3>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tipo:</span>
          <span className="font-medium">{getTypeName()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Forma:</span>
          <span className="font-medium">{getShapeName()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Material:</span>
          <span className="font-medium">{getMaterialName()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Acabado:</span>
          <span className="font-medium">{getFinishName()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tamaño:</span>
          <span className="font-medium">
            {currentDimensions.width} x {currentDimensions.height} cm
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Cantidad:</span>
          <span className="font-medium">{config.quantity} unidades</span>
        </div>
        {config.image && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Diseño:</span>
            <span className="font-medium text-green-600">✓ Subido</span>
          </div>
        )}
      </div>

      <div className="border-t pt-4 mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Precio unitario:</span>
          <span className="font-medium">{unitPrice.toFixed(2)}€</span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span className="text-primary">{currentPrice.toFixed(2)}€</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">IVA incluido</p>
      </div>

      {!validation.isValid && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-600 font-medium mb-1">
            Completa la configuración:
          </p>
          <ul className="text-xs text-red-600 space-y-1">
            {Object.values(validation.errors).map((error, idx) => (
              <li key={idx}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={onAddToCart}
        disabled={!validation.isValid}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          validation.isValid
            ? "bg-primary text-white hover:bg-primary/90"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Añadir al Carrito
      </button>

      <div className="mt-4 space-y-2 text-xs text-gray-600">
        <div className="flex items-start gap-2">
          <span>✓</span>
          <span>Envío gratis en pedidos superiores a 50€</span>
        </div>
        <div className="flex items-start gap-2">
          <span>✓</span>
          <span>Producción en 3-5 días laborables</span>
        </div>
        <div className="flex items-start gap-2">
          <span>✓</span>
          <span>Garantía de calidad 100%</span>
        </div>
      </div>
    </div>
  )
}
