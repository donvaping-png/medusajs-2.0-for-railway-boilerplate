import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { useState, useEffect } from "react"

// Widget para configurar productos personalizables
const ProductConfiguratorWidget = ({ data }: { data: any }) => {
  const product = data
  const [isCustom, setIsCustom] = useState(false)
  const [shapes, setShapes] = useState<string[]>([])
  const [category, setCategory] = useState("")
  const [subcategory, setSubcategory] = useState("")

  // Parsear metadata existente
  useEffect(() => {
    if (product.metadata) {
      setIsCustom(product.metadata.product_type === "custom_sticker")
      setCategory(product.metadata.category || "")
      setSubcategory(product.metadata.subcategory || "")
      
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

      const parsedShapes = parseField(product.metadata["config.shapes"])
      if (Array.isArray(parsedShapes)) {
        setShapes(parsedShapes)
      }
    }
  }, [product])

  const allShapes = ["contorneado", "cuadrado", "circular", "esquinas_redondeadas"]

  // Categorías y subcategorías disponibles
  const categories = [
    { value: "", label: "Seleccionar categoría..." },
    { value: "pegatinas", label: "Pegatinas" },
    { value: "etiquetas", label: "Etiquetas" },
    { value: "vinilos", label: "Vinilos" },
    { value: "otros", label: "Otros" },
  ]

  const subcategoriesByCategory: Record<string, Array<{ value: string; label: string }>> = {
    pegatinas: [
      { value: "", label: "Seleccionar subcategoría..." },
      { value: "suelo", label: "Para el Suelo" },
      { value: "pared", label: "Para la Pared" },
      { value: "cristal", label: "Para Cristal" },
      { value: "vehiculos", label: "Para Vehículos" },
      { value: "general", label: "General" },
    ],
    etiquetas: [
      { value: "", label: "Seleccionar subcategoría..." },
      { value: "productos", label: "Para Productos" },
      { value: "envases", label: "Para Envases" },
      { value: "general", label: "General" },
    ],
    vinilos: [
      { value: "", label: "Seleccionar subcategoría..." },
      { value: "decorativos", label: "Decorativos" },
      { value: "publicitarios", label: "Publicitarios" },
      { value: "general", label: "General" },
    ],
    otros: [
      { value: "", label: "Seleccionar subcategoría..." },
      { value: "general", label: "General" },
    ],
  }

  const availableSubcategories = category ? subcategoriesByCategory[category] || [] : []

  const toggleShape = (shape: string) => {
    if (shapes.includes(shape)) {
      setShapes(shapes.filter(s => s !== shape))
    } else {
      setShapes([...shapes, shape])
    }
  }

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory)
    // Reset subcategory cuando cambia la categoría
    setSubcategory("")
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>⚙️ Configurador de Producto</h3>
      </div>

      {/* Tipo de producto */}
      <div style={styles.section}>
        <label style={styles.label}>Tipo de Producto</label>
        <select
          value={isCustom ? "custom_sticker" : "standard"}
          onChange={(e) => setIsCustom(e.target.value === "custom_sticker")}
          style={styles.select}
        >
          <option value="standard">Producto Estándar</option>
          <option value="custom_sticker">Pegatina Personalizable</option>
        </select>
      </div>

      {isCustom && (
        <>
          {/* Categoría */}
          <div style={styles.section}>
            <label style={styles.label}>Categoría *</label>
            <div style={styles.hint}>
              Selecciona la categoría principal del producto
            </div>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              style={styles.select}
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategoría */}
          {category && (
            <div style={styles.section}>
              <label style={styles.label}>Subcategoría *</label>
              <div style={styles.hint}>
                Selecciona la subcategoría específica
              </div>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                style={styles.select}
              >
                {availableSubcategories.map((subcat) => (
                  <option key={subcat.value} value={subcat.value}>
                    {subcat.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Formas */}
          <div style={styles.section}>
            <label style={styles.label}>Formas Disponibles</label>
            <div style={styles.hint}>
              Selecciona las formas que estarán disponibles para este producto
            </div>
            <div style={styles.checkboxGroup}>
              {allShapes.map((shape) => (
                <label key={shape} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={shapes.includes(shape)}
                    onChange={() => toggleShape(shape)}
                    style={styles.checkbox}
                  />
                  <span style={styles.checkboxText}>
                    {shape.charAt(0).toUpperCase() + shape.slice(1).replace(/_/g, " ")}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Información */}
          <div style={styles.infoBox}>
            <div style={styles.infoTitle}>📝 Configuración Completa</div>
            <div style={styles.infoText}>
              Para configurar materiales, tamaños, cantidades y precios, edita el metadata del producto:
            </div>
            <ul style={styles.infoList}>
              <li><code>config.materials</code> - Array de materiales</li>
              <li><code>config.sizes</code> - Array de tamaños</li>
              <li><code>config.quantities</code> - Array de cantidades y precios</li>
              <li><code>config.finishes</code> - Array de acabados (opcional)</li>
            </ul>
            <div style={styles.infoText}>
              Ver: <code>METADATA_COMPLETO_ACTUALIZADO.md</code>
            </div>
          </div>

          {/* Valores actuales */}
          <div style={styles.currentConfig}>
            <div style={styles.configLabel}>📋 Metadata a copiar:</div>
            
            {category && (
              <div style={styles.metadataItem}>
                <div style={styles.metadataKey}>category</div>
                <div style={styles.configValue}>{category}</div>
              </div>
            )}
            
            {subcategory && (
              <div style={styles.metadataItem}>
                <div style={styles.metadataKey}>subcategory</div>
                <div style={styles.configValue}>{subcategory}</div>
              </div>
            )}
            
            {shapes.length > 0 && (
              <div style={styles.metadataItem}>
                <div style={styles.metadataKey}>config.shapes</div>
                <div style={styles.configValue}>
                  {JSON.stringify(shapes)}
                </div>
              </div>
            )}
            
            <div style={styles.hint}>
              💡 Copia estos valores en la sección "Metadata" del producto
            </div>
          </div>
        </>
      )}

      {!isCustom && (
        <div style={styles.standardInfo}>
          Este es un producto estándar. Cambia el tipo a "Pegatina Personalizable" para configurar el configurador.
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "20px",
    marginTop: "16px",
  },
  header: {
    marginBottom: "16px",
    paddingBottom: "12px",
    borderBottom: "1px solid #e5e7eb",
  },
  title: {
    fontSize: "16px",
    fontWeight: "600" as const,
    margin: 0,
    color: "#111827",
  },
  section: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500" as const,
    marginBottom: "8px",
    color: "#374151",
  },
  select: {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
    backgroundColor: "white",
    color: "#111827",
  },
  hint: {
    fontSize: "12px",
    color: "#6b7280",
    marginBottom: "8px",
  },
  checkboxGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    cursor: "pointer",
  },
  checkbox: {
    width: "16px",
    height: "16px",
    cursor: "pointer",
  },
  checkboxText: {
    fontSize: "14px",
    color: "#374151",
  },
  infoBox: {
    backgroundColor: "#f0f9ff",
    border: "1px solid #bae6fd",
    borderRadius: "6px",
    padding: "12px",
    marginBottom: "20px",
  },
  infoTitle: {
    fontSize: "14px",
    fontWeight: "600" as const,
    color: "#0369a1",
    marginBottom: "8px",
  },
  infoText: {
    fontSize: "13px",
    color: "#0c4a6e",
    marginBottom: "8px",
    lineHeight: "1.5",
  },
  infoList: {
    margin: "8px 0",
    paddingLeft: "20px",
    fontSize: "13px",
    color: "#0c4a6e",
    lineHeight: "1.6",
  },
  currentConfig: {
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "6px",
    padding: "16px",
    marginBottom: "20px",
  },
  configLabel: {
    fontSize: "14px",
    fontWeight: "600" as const,
    color: "#166534",
    marginBottom: "12px",
  },
  metadataItem: {
    marginBottom: "12px",
  },
  metadataKey: {
    fontSize: "11px",
    fontWeight: "600" as const,
    color: "#166534",
    marginBottom: "4px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },
  configValue: {
    fontFamily: "monospace",
    fontSize: "13px",
    color: "#111827",
    backgroundColor: "white",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #bbf7d0",
    overflowX: "auto" as const,
    wordBreak: "break-all" as const,
  },
  standardInfo: {
    fontSize: "14px",
    color: "#6b7280",
    padding: "12px",
    backgroundColor: "#f9fafb",
    borderRadius: "6px",
  },
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductConfiguratorWidget
