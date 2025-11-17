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
        <div style={styles.headerContent}>
          <h3 style={styles.title}>⚙️ Configurador de Producto</h3>
          <p style={styles.subtitle}>
            Configura este producto como personalizable y define sus opciones
          </p>
        </div>
      </div>

      {/* Tipo de producto */}
      <div style={styles.section}>
        <label style={styles.label}>
          Tipo de Producto
          <span style={styles.required}>*</span>
        </label>
        <select
          value={isCustom ? "custom_sticker" : "standard"}
          onChange={(e: any) => setIsCustom(e.target.value === "custom_sticker")}
          style={styles.select}
        >
          <option value="standard">Producto Estándar</option>
          <option value="custom_sticker">Pegatina Personalizable</option>
        </select>
        <p style={styles.hint}>
          Los productos personalizables aparecerán en las páginas de configurador
        </p>
      </div>

      {isCustom && (
        <>
          <div style={styles.divider} />

          {/* Categoría */}
          <div style={styles.section}>
            <label style={styles.label}>
              Categoría
              <span style={styles.required}>*</span>
            </label>
            <select
              value={category}
              onChange={(e: any) => handleCategoryChange(e.target.value)}
              style={styles.select}
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <p style={styles.hint}>
              Categoría principal para organizar el producto
            </p>
          </div>

          {/* Subcategoría */}
          {category && (
            <div style={styles.section}>
              <label style={styles.label}>
                Subcategoría
                <span style={styles.required}>*</span>
              </label>
              <select
                value={subcategory}
                onChange={(e: any) => setSubcategory(e.target.value)}
                style={styles.select}
              >
                {availableSubcategories.map((subcat) => (
                  <option key={subcat.value} value={subcat.value}>
                    {subcat.label}
                  </option>
                ))}
              </select>
              <p style={styles.hint}>
                Subcategoría específica del producto
              </p>
            </div>
          )}

          <div style={styles.divider} />

          {/* Formas */}
          <div style={styles.section}>
            <label style={styles.label}>Formas Disponibles</label>
            <p style={styles.hint}>
              Selecciona las formas que estarán disponibles en el configurador
            </p>
            <div style={styles.checkboxGrid}>
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

          <div style={styles.divider} />

          {/* Información adicional */}
          <div style={styles.infoBox}>
            <div style={styles.infoHeader}>
              <svg style={styles.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span style={styles.infoTitle}>Configuración Completa</span>
            </div>
            <p style={styles.infoText}>
              Para configurar materiales, tamaños, cantidades y precios, añade estos campos en la sección <strong>Metadata</strong> del producto:
            </p>
            <ul style={styles.infoList}>
              <li><code style={styles.code}>config.materials</code> - Array de materiales con precios</li>
              <li><code style={styles.code}>config.sizes</code> - Array de tamaños disponibles</li>
              <li><code style={styles.code}>config.quantities</code> - Array de cantidades y precios base</li>
              <li><code style={styles.code}>config.finishes</code> - Array de acabados (opcional)</li>
            </ul>
            <p style={styles.infoText}>
              📖 Ver documentación completa en: <code style={styles.code}>METADATA_COMPLETO_ACTUALIZADO.md</code>
            </p>
          </div>

          {/* Valores a copiar */}
          {(category || subcategory || shapes.length > 0) && (
            <>
              <div style={styles.divider} />
              <div style={styles.metadataBox}>
                <div style={styles.metadataHeader}>
                  <svg style={styles.metadataIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span style={styles.metadataTitle}>Metadata a Copiar</span>
                </div>
                <p style={styles.metadataHint}>
                  Copia estos valores en la sección <strong>Metadata</strong> del producto (más abajo en esta página)
                </p>
                
                <div style={styles.metadataGrid}>
                  {isCustom && (
                    <div style={styles.metadataItem}>
                      <div style={styles.metadataKey}>product_type</div>
                      <div style={styles.metadataValue}>custom_sticker</div>
                    </div>
                  )}
                  
                  {category && (
                    <div style={styles.metadataItem}>
                      <div style={styles.metadataKey}>category</div>
                      <div style={styles.metadataValue}>{category}</div>
                    </div>
                  )}
                  
                  {subcategory && (
                    <div style={styles.metadataItem}>
                      <div style={styles.metadataKey}>subcategory</div>
                      <div style={styles.metadataValue}>{subcategory}</div>
                    </div>
                  )}
                  
                  {shapes.length > 0 && (
                    <div style={styles.metadataItem}>
                      <div style={styles.metadataKey}>config.shapes</div>
                      <div style={styles.metadataValue}>
                        {JSON.stringify(shapes)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {!isCustom && (
        <div style={styles.standardInfo}>
          <svg style={styles.standardIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <div>
            <p style={styles.standardTitle}>Producto Estándar</p>
            <p style={styles.standardText}>
              Este producto no tiene configuración personalizable. Cambia el tipo a "Pegatina Personalizable" para habilitar el configurador.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    overflow: "hidden",
    marginTop: "24px",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
  },
  header: {
    backgroundColor: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
    padding: "20px 24px",
  },
  headerContent: {
    margin: 0,
  },
  title: {
    fontSize: "18px",
    fontWeight: "600" as const,
    margin: "0 0 4px 0",
    color: "#111827",
  },
  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
  },
  section: {
    padding: "20px 24px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500" as const,
    marginBottom: "8px",
    color: "#374151",
  },
  required: {
    color: "#ef4444",
    marginLeft: "4px",
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    backgroundColor: "#ffffff",
    color: "#111827",
    cursor: "pointer",
    transition: "border-color 0.2s",
  },
  hint: {
    fontSize: "13px",
    color: "#6b7280",
    marginTop: "6px",
    marginBottom: 0,
  },
  divider: {
    height: "1px",
    backgroundColor: "#e5e7eb",
    margin: "0 24px",
  },
  checkboxGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "12px",
    marginTop: "12px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    backgroundColor: "#ffffff",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
    accentColor: "#3b82f6",
  },
  checkboxText: {
    fontSize: "14px",
    color: "#374151",
    userSelect: "none" as const,
  },
  infoBox: {
    backgroundColor: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "8px",
    padding: "16px",
    margin: "0 24px 20px 24px",
  },
  infoHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "12px",
  },
  infoIcon: {
    width: "20px",
    height: "20px",
    color: "#3b82f6",
  },
  infoTitle: {
    fontSize: "15px",
    fontWeight: "600" as const,
    color: "#1e40af",
  },
  infoText: {
    fontSize: "13px",
    color: "#1e3a8a",
    marginBottom: "12px",
    lineHeight: "1.6",
  },
  infoList: {
    margin: "12px 0",
    paddingLeft: "24px",
    fontSize: "13px",
    color: "#1e3a8a",
    lineHeight: "1.8",
  },
  code: {
    fontFamily: "monospace",
    fontSize: "12px",
    backgroundColor: "#dbeafe",
    padding: "2px 6px",
    borderRadius: "4px",
    color: "#1e40af",
  },
  metadataBox: {
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "8px",
    padding: "16px",
    margin: "0 24px 20px 24px",
  },
  metadataHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "8px",
  },
  metadataIcon: {
    width: "20px",
    height: "20px",
    color: "#16a34a",
  },
  metadataTitle: {
    fontSize: "15px",
    fontWeight: "600" as const,
    color: "#166534",
  },
  metadataHint: {
    fontSize: "13px",
    color: "#166534",
    marginBottom: "16px",
  },
  metadataGrid: {
    display: "grid",
    gap: "12px",
  },
  metadataItem: {
    backgroundColor: "#ffffff",
    border: "1px solid #bbf7d0",
    borderRadius: "6px",
    padding: "12px",
  },
  metadataKey: {
    fontSize: "11px",
    fontWeight: "600" as const,
    color: "#166534",
    marginBottom: "6px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },
  metadataValue: {
    fontFamily: "monospace",
    fontSize: "13px",
    color: "#111827",
    backgroundColor: "#f9fafb",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #e5e7eb",
    wordBreak: "break-all" as const,
  },
  standardInfo: {
    display: "flex",
    gap: "16px",
    padding: "20px 24px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    margin: "0 24px 20px 24px",
  },
  standardIcon: {
    width: "24px",
    height: "24px",
    color: "#6b7280",
    flexShrink: 0,
  },
  standardTitle: {
    fontSize: "14px",
    fontWeight: "600" as const,
    color: "#374151",
    marginBottom: "4px",
  },
  standardText: {
    fontSize: "13px",
    color: "#6b7280",
    margin: 0,
    lineHeight: "1.6",
  },
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductConfiguratorWidget
