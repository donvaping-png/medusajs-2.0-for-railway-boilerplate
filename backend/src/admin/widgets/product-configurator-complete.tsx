import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { useState, useEffect } from "react"

type Material = { id: string; name: string; priceMultiplier: number; icon?: string }
type Size = { label: string; width: number; height: number; priceMultiplier: number }
type Quantity = { qty: number; basePrice: number }
type Finish = { id: string; name: string }
type Shape = { id: string; name: string; icon?: string }

const ProductConfiguratorWidget = ({ data }: { data: any }) => {
  const product = data
  const [isCustom, setIsCustom] = useState(false)
  const [shapes, setShapes] = useState<Shape[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [sizes, setSizes] = useState<Size[]>([])
  const [quantities, setQuantities] = useState<Quantity[]>([])
  const [finishes, setFinishes] = useState<Finish[]>([])
  const [allowCustomSize, setAllowCustomSize] = useState(false)
  const [minQuantity, setMinQuantity] = useState(10)
  const [maxWidth, setMaxWidth] = useState("")
  const [maxHeight, setMaxHeight] = useState("")
  const [saving, setSaving] = useState(false)

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

      setIsCustom(product.metadata.product_type === "custom_sticker")
      setShapes(parseField(product.metadata["config.shapes"]) || [])
      setMaterials(parseField(product.metadata["config.materials"]) || [])
      setSizes(parseField(product.metadata["config.sizes"]) || [])
      setQuantities(parseField(product.metadata["config.quantities"]) || [])
      setFinishes(parseField(product.metadata["config.finishes"]) || [])
      setAllowCustomSize(product.metadata["config.allowCustomSize"] === "true" || product.metadata["config.allowCustomSize"] === true)
      setMinQuantity(parseInt(product.metadata["config.minQuantity"]) || 10)
      setMaxWidth(product.metadata["config.maxWidth"] || "")
      setMaxHeight(product.metadata["config.maxHeight"] || "")
    }
  }, [product])

  const allShapes: Shape[] = [
    { id: "contorneado", name: "Contorneado", icon: "🔷" },
    { id: "cuadrado", name: "Cuadrado", icon: "⬜" },
    { id: "circular", name: "Circular", icon: "⭕" },
    { id: "esquinas_redondeadas", name: "Esquinas Redondeadas", icon: "▢" },
  ]

  const toggleShape = (shapeId: string) => {
    const shapeExists = shapes.find(s => s.id === shapeId)
    if (shapeExists) {
      setShapes(shapes.filter(s => s.id !== shapeId))
    } else {
      const shapeToAdd = allShapes.find(s => s.id === shapeId)
      if (shapeToAdd) {
        setShapes([...shapes, shapeToAdd])
      }
    }
  }

  const addShape = () => {
    setShapes([...shapes, { id: "", name: "", icon: "" }])
  }

  const updateShape = (index: number, field: keyof Shape, value: any) => {
    const newShapes = [...shapes]
    newShapes[index] = { ...newShapes[index], [field]: value }
    setShapes(newShapes)
  }

  const removeShape = (index: number) => {
    setShapes(shapes.filter((_, i) => i !== index))
  }

  const addMaterial = () => {
    setMaterials([...materials, { id: "", name: "", priceMultiplier: 1.0, icon: "" }])
  }

  const updateMaterial = (index: number, field: keyof Material, value: any) => {
    const newMaterials = [...materials]
    newMaterials[index] = { ...newMaterials[index], [field]: value }
    setMaterials(newMaterials)
  }

  const removeMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index))
  }

  const addSize = () => {
    setSizes([...sizes, { label: "", width: 0, height: 0, priceMultiplier: 1.0 }])
  }

  const updateSize = (index: number, field: keyof Size, value: any) => {
    const newSizes = [...sizes]
    newSizes[index] = { ...newSizes[index], [field]: value }
    setSizes(newSizes)
  }

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index))
  }

  const addQuantity = () => {
    setQuantities([...quantities, { qty: 0, basePrice: 0 }])
  }

  const updateQuantity = (index: number, field: keyof Quantity, value: any) => {
    const newQuantities = [...quantities]
    newQuantities[index] = { ...newQuantities[index], [field]: value }
    setQuantities(newQuantities)
  }

  const removeQuantity = (index: number) => {
    setQuantities(quantities.filter((_, i) => i !== index))
  }

  const addFinish = () => {
    setFinishes([...finishes, { id: "", name: "" }])
  }

  const updateFinish = (index: number, field: keyof Finish, value: any) => {
    const newFinishes = [...finishes]
    newFinishes[index] = { ...newFinishes[index], [field]: value }
    setFinishes(newFinishes)
  }

  const removeFinish = (index: number) => {
    setFinishes(finishes.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const metadata: any = {
        product_type: isCustom ? "custom_sticker" : "standard",
      }

      if (isCustom) {
        metadata["config.shapes"] = JSON.stringify(shapes)
        metadata["config.materials"] = JSON.stringify(materials)
        metadata["config.sizes"] = JSON.stringify(sizes)
        metadata["config.quantities"] = JSON.stringify(quantities)
        if (finishes.length > 0) {
          metadata["config.finishes"] = JSON.stringify(finishes)
        }
        metadata["config.allowCustomSize"] = allowCustomSize.toString()
        metadata["config.minQuantity"] = minQuantity.toString()
        if (maxWidth) metadata["config.maxWidth"] = maxWidth
        if (maxHeight) metadata["config.maxHeight"] = maxHeight
      }

      const response = await fetch(`/admin/products/${product.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ metadata }),
      })

      if (!response.ok) throw new Error("Error al guardar")

      alert("✅ Configuración guardada exitosamente")
      window.location.reload()
    } catch (error) {
      alert("❌ Error al guardar la configuración")
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>⚙️ Configurador de Producto</h3>
        <button onClick={handleSave} disabled={saving} style={saving ? styles.disabledButton : styles.primaryButton}>
          {saving ? "Guardando..." : "💾 Guardar Configuración"}
        </button>
      </div>

      <div style={styles.section}>
        <label style={styles.label}>Tipo de Producto</label>
        <select value={isCustom ? "custom_sticker" : "standard"} onChange={(e) => setIsCustom(e.target.value === "custom_sticker")} style={styles.select}>
          <option value="standard">Producto Estándar</option>
          <option value="custom_sticker">Pegatina Personalizable</option>
        </select>
      </div>

      {isCustom && (
        <>
          {/* Formas */}
          <div style={styles.section}>
            <label style={styles.label}>Formas Disponibles</label>
            <div style={styles.checkboxGroup}>
              {allShapes.map((shape) => (
                <label key={shape.id} style={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={shapes.some(s => s.id === shape.id)} 
                    onChange={() => toggleShape(shape.id)} 
                    style={styles.checkbox} 
                  />
                  <span>{shape.icon} {shape.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Materiales */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <label style={styles.label}>Materiales</label>
              <button type="button" onClick={addMaterial} style={styles.addButton}>+ Añadir Material</button>
            </div>
            {materials.map((material, index) => (
              <div key={index} style={styles.itemRow}>
                <input type="text" placeholder="ID (ej: vinilo)" value={material.id} onChange={(e) => updateMaterial(index, "id", e.target.value)} style={{...styles.input, flex: 1}} />
                <input type="text" placeholder="Nombre (ej: Vinilo)" value={material.name} onChange={(e) => updateMaterial(index, "name", e.target.value)} style={{...styles.input, flex: 1}} />
                <input type="number" placeholder="Multiplicador" value={material.priceMultiplier} onChange={(e) => updateMaterial(index, "priceMultiplier", parseFloat(e.target.value))} style={{...styles.input, width: "120px"}} step="0.1" />
                <button type="button" onClick={() => removeMaterial(index)} style={styles.removeButton}>✕</button>
              </div>
            ))}
          </div>

          {/* Tamaños */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <label style={styles.label}>Tamaños</label>
              <button type="button" onClick={addSize} style={styles.addButton}>+ Añadir Tamaño</button>
            </div>
            {sizes.map((size, index) => (
              <div key={index} style={styles.itemRow}>
                <input type="text" placeholder="Label (ej: 10x10 cm)" value={size.label} onChange={(e) => updateSize(index, "label", e.target.value)} style={{...styles.input, flex: 1}} />
                <input type="number" placeholder="Ancho" value={size.width} onChange={(e) => updateSize(index, "width", parseFloat(e.target.value))} style={{...styles.input, width: "100px"}} step="0.1" />
                <input type="number" placeholder="Alto" value={size.height} onChange={(e) => updateSize(index, "height", parseFloat(e.target.value))} style={{...styles.input, width: "100px"}} step="0.1" />
                <button type="button" onClick={() => removeSize(index)} style={styles.removeButton}>✕</button>
              </div>
            ))}
          </div>

          {/* Cantidades y Precios */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <label style={styles.label}>Cantidades y Precios</label>
              <button type="button" onClick={addQuantity} style={styles.addButton}>+ Añadir Cantidad</button>
            </div>
            {quantities.map((quantity, index) => (
              <div key={index} style={styles.itemRow}>
                <input type="number" placeholder="Cantidad" value={quantity.qty} onChange={(e) => updateQuantity(index, "qty", parseInt(e.target.value))} style={{...styles.input, flex: 1}} />
                <input type="number" placeholder="Precio (€)" value={quantity.basePrice} onChange={(e) => updateQuantity(index, "basePrice", parseFloat(e.target.value))} style={{...styles.input, flex: 1}} step="0.01" />
                <button type="button" onClick={() => removeQuantity(index)} style={styles.removeButton}>✕</button>
              </div>
            ))}
          </div>

          {/* Acabados */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <label style={styles.label}>Acabados (Opcional)</label>
              <button type="button" onClick={addFinish} style={styles.addButton}>+ Añadir Acabado</button>
            </div>
            {finishes.map((finish, index) => (
              <div key={index} style={styles.itemRow}>
                <input type="text" placeholder="ID (ej: mate)" value={finish.id} onChange={(e) => updateFinish(index, "id", e.target.value)} style={{...styles.input, flex: 1}} />
                <input type="text" placeholder="Nombre (ej: Mate)" value={finish.name} onChange={(e) => updateFinish(index, "name", e.target.value)} style={{...styles.input, flex: 1}} />
                <button type="button" onClick={() => removeFinish(index)} style={styles.removeButton}>✕</button>
              </div>
            ))}
          </div>

          {/* Opciones adicionales */}
          <div style={styles.section}>
            <label style={styles.label}>Opciones Adicionales</label>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" checked={allowCustomSize} onChange={(e) => setAllowCustomSize(e.target.checked)} style={styles.checkbox} />
              <span>Permitir tamaño personalizado</span>
            </label>
            <div style={styles.grid}>
              <div>
                <label style={styles.smallLabel}>Cantidad Mínima</label>
                <input type="number" value={minQuantity} onChange={(e) => setMinQuantity(parseInt(e.target.value) || 10)} style={styles.input} />
              </div>
              {allowCustomSize && (
                <>
                  <div>
                    <label style={styles.smallLabel}>Ancho Máximo (cm)</label>
                    <input type="number" value={maxWidth} onChange={(e) => setMaxWidth(e.target.value)} placeholder="Sin límite" style={styles.input} />
                  </div>
                  <div>
                    <label style={styles.smallLabel}>Alto Máximo (cm)</label>
                    <input type="number" value={maxHeight} onChange={(e) => setMaxHeight(e.target.value)} placeholder="Sin límite" style={styles.input} />
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

const styles = {
  container: { backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "20px", marginTop: "16px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid #e5e7eb" },
  title: { fontSize: "16px", fontWeight: "600" as const, margin: 0, color: "#111827" },
  primaryButton: { backgroundColor: "#3b82f6", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontWeight: "500" as const },
  disabledButton: { backgroundColor: "#9ca3af", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "not-allowed", fontSize: "14px", fontWeight: "500" as const },
  section: { marginBottom: "24px" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" },
  label: { display: "block", fontSize: "14px", fontWeight: "500" as const, marginBottom: "8px", color: "#374151" },
  smallLabel: { display: "block", fontSize: "12px", fontWeight: "500" as const, marginBottom: "4px", color: "#6b7280" },
  select: { width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", backgroundColor: "white" },
  input: { padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" as const },
  checkboxGroup: { display: "flex", flexDirection: "column" as const, gap: "8px" },
  checkboxLabel: { display: "flex", alignItems: "center", gap: "8px", padding: "8px", border: "1px solid #e5e7eb", borderRadius: "6px", cursor: "pointer" },
  checkbox: { width: "16px", height: "16px", cursor: "pointer" },
  addButton: { backgroundColor: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "500" as const },
  removeButton: { backgroundColor: "#ef4444", color: "white", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
  itemRow: { display: "flex", gap: "8px", marginBottom: "8px", alignItems: "center" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginTop: "12px" },
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductConfiguratorWidget
