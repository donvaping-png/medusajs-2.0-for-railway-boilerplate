import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, Input, Select, Checkbox, Label } from "@medusajs/ui"
import { useState, useEffect } from "react"

// Widget para configurar productos personalizables
const ProductConfiguratorWidget = ({ data }: { data: any }) => {
  const product = data
  const [config, setConfig] = useState({
    productType: product.metadata?.product_type || "standard",
    shapes: [],
    materials: [],
    sizes: [],
    quantities: [],
    finishes: [],
    allowCustomSize: false,
    minQuantity: 10,
    maxWidth: null,
    maxHeight: null,
  })

  // Parsear metadata existente
  useEffect(() => {
    if (product.metadata) {
      const parseField = (field: any) => {
        if (!field) return null
        if (typeof field === "string") {
          try {
            return JSON.parse(field)
          } catch {
            return field
          }
        }
        return field
      }

      setConfig({
        productType: product.metadata.product_type || "standard",
        shapes: parseField(product.metadata["config.shapes"]) || [],
        materials: parseField(product.metadata["config.materials"]) || [],
        sizes: parseField(product.metadata["config.sizes"]) || [],
        quantities: parseField(product.metadata["config.quantities"]) || [],
        finishes: parseField(product.metadata["config.finishes"]) || [],
        allowCustomSize: product.metadata["config.allowCustomSize"] === "true" || product.metadata["config.allowCustomSize"] === true,
        minQuantity: parseInt(product.metadata["config.minQuantity"]) || 10,
        maxWidth: parseInt(product.metadata["config.maxWidth"]) || null,
        maxHeight: parseInt(product.metadata["config.maxHeight"]) || null,
      })
    }
  }, [product])

  const isCustomSticker = config.productType === "custom_sticker"

  return (
    <Container className="p-6">
      <Heading level="h2" className="mb-4">
        Configurador de Producto
      </Heading>

      {/* Tipo de producto */}
      <div className="mb-6">
        <Label>Tipo de Producto</Label>
        <Select
          value={config.productType}
          onValueChange={(value) => setConfig({ ...config, productType: value })}
        >
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="standard">Producto Estándar</Select.Item>
            <Select.Item value="custom_sticker">Pegatina Personalizable</Select.Item>
          </Select.Content>
        </Select>
      </div>

      {isCustomSticker && (
        <>
          {/* Formas */}
          <div className="mb-6">
            <Label>Formas Disponibles</Label>
            <div className="text-sm text-gray-600 mb-2">
              Selecciona las formas que estarán disponibles para este producto
            </div>
            <div className="space-y-2">
              {["contorneado", "cuadrado", "circular", "esquinas_redondeadas"].map((shape) => (
                <div key={shape} className="flex items-center gap-2">
                  <Checkbox
                    checked={config.shapes.includes(shape)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setConfig({ ...config, shapes: [...config.shapes, shape] })
                      } else {
                        setConfig({ ...config, shapes: config.shapes.filter((s) => s !== shape) })
                      }
                    }}
                  />
                  <span className="capitalize">{shape.replace(/_/g, " ")}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Información de configuración */}
          <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Para configurar materiales, tamaños, cantidades y precios,
              edita el metadata del producto directamente o usa la API.
            </p>
            <p className="text-sm text-blue-800 mt-2">
              Ver documentación: <code>METADATA_COMPLETO_ACTUALIZADO.md</code>
            </p>
          </div>

          {/* Opciones adicionales */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Checkbox
                checked={config.allowCustomSize}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, allowCustomSize: checked as boolean })
                }
              />
              <Label>Permitir tamaño personalizado</Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Cantidad Mínima</Label>
                <Input
                  type="number"
                  value={config.minQuantity}
                  onChange={(e) =>
                    setConfig({ ...config, minQuantity: parseInt(e.target.value) || 10 })
                  }
                />
              </div>

              {config.allowCustomSize && (
                <>
                  <div>
                    <Label>Ancho Máximo (cm)</Label>
                    <Input
                      type="number"
                      value={config.maxWidth || ""}
                      onChange={(e) =>
                        setConfig({ ...config, maxWidth: parseInt(e.target.value) || null })
                      }
                      placeholder="Sin límite"
                    />
                  </div>
                  <div>
                    <Label>Alto Máximo (cm)</Label>
                    <Input
                      type="number"
                      value={config.maxHeight || ""}
                      onChange={(e) =>
                        setConfig({ ...config, maxHeight: parseInt(e.target.value) || null })
                      }
                      placeholder="Sin límite"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Botón para guardar */}
          <Button
            onClick={() => {
              // Aquí iría la lógica para guardar en el metadata
              console.log("Configuración a guardar:", config)
              alert("Configuración guardada (implementar guardado real)")
            }}
          >
            Guardar Configuración
          </Button>
        </>
      )}

      {!isCustomSticker && (
        <div className="text-gray-600 text-sm">
          Este es un producto estándar. Cambia el tipo a "Pegatina Personalizable" para configurar
          el configurador.
        </div>
      )}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductConfiguratorWidget
