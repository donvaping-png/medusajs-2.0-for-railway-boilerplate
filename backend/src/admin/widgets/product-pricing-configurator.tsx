import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { useState, useEffect } from "react"

type PricingMode = 'fixed_table' | 'per_sqm' | 'hybrid'

const ProductPricingConfiguratorWidget = ({ data }: { data: any }) => {
  const product = data
  const [pricingMode, setPricingMode] = useState<PricingMode>('fixed_table')
  
  // Fixed Table
  const [quantities, setQuantities] = useState<Array<{ qty: number; basePrice: number }>>([])
  const [minQuantity, setMinQuantity] = useState(10)
  
  // Per SQM
  const [basePricePerSqm, setBasePricePerSqm] = useState(15.00)
  const [minPrice, setMinPrice] = useState(10.00)
  const [minArea, setMinArea] = useState(0.01)
  const [volumeDiscounts, setVolumeDiscounts] = useState<Array<{ min_qty: number; discount_percent: number }>>([])
  
  // Hybrid
  const [sizeTiers, setSizeTiers] = useState<Array<{ max_area: number | null; price_per_sqm: number }>>([])
  const [quantityMultipliers, setQuantityMultipliers] = useState<Array<{ min_qty: number; multiplier: number }>>([])
  
  // Multipliers
  const [shapeMultipliers, setShapeMultipliers] = useState<Record<string, number>>({})
  const [finishMultipliers, setFinishMultipliers] = useState<Record<string, number>>({})
  
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (product.metadata?.pricing) {
      const pricing = typeof product.metadata.pricing === 'string' 
        ? JSON.parse(product.metadata.pricing)
        : product.metadata.pricing

      setPricingMode(pricing.mode || 'fixed_table')

      if (pricing.mode === 'fixed_table') {
        setQuantities(pricing.quantities || [])
        setMinQuantity(pricing.min_quantity || 10)
      } else if (pricing.mode === 'per_sqm') {
        setBasePricePerSqm(pricing.base_price_per_sqm || 15.00)
        setMinPrice(pricing.min_price || 10.00)
        setMinArea(pricing.min_area || 0.01)
        setVolumeDiscounts(pricing.volume_discounts || [])
        setShapeMultipliers(pricing.shape_multipliers || {})
        setFinishMultipliers(pricing.finish_multipliers || {})
      } else if (pricing.mode === 'hybrid') {
        setBasePricePerSqm(pricing.base_price_per_sqm || 15.00)
        setMinPrice(pricing.min_price || 10.00)
        setSizeTiers(pricing.size_tiers || [])
        setQuantityMultipliers(pricing.quantity_multipliers || [])
        setShapeMultipliers(pricing.shape_multipliers || {})
        setFinishMultipliers(pricing.finish_multipliers || {})
      }
    }
  }, [product])

  const handleSave = async () => {
    setSaving(true)
    try {
      let pricingConfig: any = { mode: pricingMode }

      if (pricingMode === 'fixed_table') {
        pricingConfig = {
          mode: 'fixed_table',
          quantities,
          min_quantity: minQuantity,
        }
      } else if (pricingMode === 'per_sqm') {
        pricingConfig = {
          mode: 'per_sqm',
          base_price_per_sqm: basePricePerSqm,
          min_price: minPrice,
          min_area: minArea,
          volume_discounts: volumeDiscounts,
          shape_multipliers: shapeMultipliers,
          finish_multipliers: finishMultipliers,
        }
      } else if (pricingMode === 'hybrid') {
        pricingConfig = {
          mode: 'hybrid',
          base_price_per_sqm: basePricePerSqm,
          size_tiers: sizeTiers,
          quantity_multipliers: quantityMultipliers,
          min_price: minPrice,
          shape_multipliers: shapeMultipliers,
          finish_multipliers: finishMultipliers,
        }
      }

      const response = await fetch(`/admin/products/${product.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          metadata: {
            ...product.metadata,
            pricing: JSON.stringify(pricingConfig),
          },
        }),
      })

      if (!response.ok) throw new Error("Error al guardar")

      alert("✅ Configuración de precios guardada")
      window.location.reload()
    } catch (error) {
      alert("❌ Error al guardar")
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const addQuantity = () => {
    setQuantities([...quantities, { qty: 0, basePrice: 0 }])
  }

  const updateQuantity = (index: number, field: 'qty' | 'basePrice', value: number) => {
    const newQuantities = [...quantities]
    newQuantities[index][field] = value
    setQuantities(newQuantities)
  }

  const removeQuantity = (index: number) => {
    setQuantities(quantities.filter((_, i) => i !== index))
  }

  const addVolumeDiscount = () => {
    setVolumeDiscounts([...volumeDiscounts, { min_qty: 0, discount_percent: 0 }])
  }

  const updateVolumeDiscount = (index: number, field: 'min_qty' | 'discount_percent', value: number) => {
    const newDiscounts = [...volumeDiscounts]
    newDiscounts[index][field] = value
    setVolumeDiscounts(newDiscounts)
  }

  const removeVolumeDiscount = (index: number) => {
    setVolumeDiscounts(volumeDiscounts.filter((_, i) => i !== index))
  }

  const addSizeTier = () => {
    setSizeTiers([...sizeTiers, { max_area: 0, price_per_sqm: 0 }])
  }

  const updateSizeTier = (index: number, field: 'max_area' | 'price_per_sqm', value: number | null) => {
    const newTiers = [...sizeTiers]
    newTiers[index][field] = value as any
    setSizeTiers(newTiers)
  }

  const removeSizeTier = (index: number) => {
    setSizeTiers(sizeTiers.filter((_, i) => i !== index))
  }

  const addQuantityMultiplier = () => {
    setQuantityMultipliers([...quantityMultipliers, { min_qty: 0, multiplier: 1.0 }])
  }

  const updateQuantityMultiplier = (index: number, field: 'min_qty' | 'multiplier', value: number) => {
    const newMultipliers = [...quantityMultipliers]
    newMultipliers[index][field] = value
    setQuantityMultipliers(newMultipliers)
  }

  const removeQuantityMultiplier = (index: number) => {
    setQuantityMultipliers(quantityMultipliers.filter((_, i) => i !== index))
  }

  const loadTemplate = (template: string) => {
    if (template === 'floor_stickers') {
      setPricingMode('fixed_table')
      setQuantities([
        { qty: 10, basePrice: 50.00 },
        { qty: 25, basePrice: 110.00 },
        { qty: 50, basePrice: 200.00 },
        { qty: 100, basePrice: 350.00 },
      ])
      setMinQuantity(10)
    } else if (template === 'vinyl_sqm') {
      setPricingMode('per_sqm')
      setBasePricePerSqm(25.00)
      setMinPrice(15.00)
      setMinArea(0.01)
      setVolumeDiscounts([
        { min_qty: 10, discount_percent: 5 },
        { min_qty: 25, discount_percent: 10 },
        { min_qty: 50, discount_percent: 15 },
        { min_qty: 100, discount_percent: 20 },
      ])
      setShapeMultipliers({
        contorneado: 1.3,
        cuadrado: 1.0,
        circular: 1.15,
      })
    } else if (template === 'premium_hybrid') {
      setPricingMode('hybrid')
      setBasePricePerSqm(30.00)
      setMinPrice(5.00)
      setSizeTiers([
        { max_area: 10, price_per_sqm: 50.00 },
        { max_area: 50, price_per_sqm: 35.00 },
        { max_area: 100, price_per_sqm: 25.00 },
        { max_area: null, price_per_sqm: 20.00 },
      ])
      setQuantityMultipliers([
        { min_qty: 1, multiplier: 1.0 },
        { min_qty: 50, multiplier: 0.9 },
        { min_qty: 100, multiplier: 0.8 },
        { min_qty: 250, multiplier: 0.7 },
      ])
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>💰 Configurador de Precios</h3>
        <button onClick={handleSave} disabled={saving} style={saving ? styles.disabledButton : styles.primaryButton}>
          {saving ? "Guardando..." : "💾 Guardar Precios"}
        </button>
      </div>

      {/* Plantillas */}
      <div style={styles.section}>
        <label style={styles.label}>Plantillas Rápidas</label>
        <div style={styles.buttonGroup}>
          <button type="button" onClick={() => loadTemplate('floor_stickers')} style={styles.templateButton}>
            🏢 Pegatinas Suelo
          </button>
          <button type="button" onClick={() => loadTemplate('vinyl_sqm')} style={styles.templateButton}>
            📐 Vinilos por m²
          </button>
          <button type="button" onClick={() => loadTemplate('premium_hybrid')} style={styles.templateButton}>
            ⭐ Premium Híbrido
          </button>
        </div>
      </div>

      {/* Modo de Precio */}
      <div style={styles.section}>
        <label style={styles.label}>Modo de Precio</label>
        <select value={pricingMode} onChange={(e) => setPricingMode(e.target.value as PricingMode)} style={styles.select}>
          <option value="fixed_table">Tabla Fija (Precio por Cantidad)</option>
          <option value="per_sqm">Por Metro Cuadrado</option>
          <option value="hybrid">Híbrido (Tiers + Multiplicadores)</option>
        </select>
        <p style={styles.hint}>
          {pricingMode === 'fixed_table' && '📊 Define precios fijos para cantidades específicas'}
          {pricingMode === 'per_sqm' && '📐 Precio calculado según el área en m²'}
          {pricingMode === 'hybrid' && '⚡ Combina tiers de tamaño con multiplicadores de cantidad'}
        </p>
      </div>

      {/* Fixed Table Mode */}
      {pricingMode === 'fixed_table' && (
        <>
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <label style={styles.label}>Tabla de Precios</label>
              <button type="button" onClick={addQuantity} style={styles.addButton}>+ Añadir Precio</button>
            </div>
            {quantities.map((q, index) => (
              <div key={index} style={styles.itemRow}>
                <input
                  type="number"
                  placeholder="Cantidad"
                  value={q.qty}
                  onChange={(e) => updateQuantity(index, 'qty', parseInt(e.target.value) || 0)}
                  style={{ ...styles.input, flex: 1 }}
                />
                <input
                  type="number"
                  placeholder="Precio Total (€)"
                  value={q.basePrice}
                  onChange={(e) => updateQuantity(index, 'basePrice', parseFloat(e.target.value) || 0)}
                  style={{ ...styles.input, flex: 1 }}
                  step="0.01"
                />
                <button type="button" onClick={() => removeQuantity(index)} style={styles.removeButton}>✕</button>
              </div>
            ))}
          </div>
          <div style={styles.section}>
            <label style={styles.label}>Cantidad Mínima</label>
            <input
              type="number"
              value={minQuantity}
              onChange={(e) => setMinQuantity(parseInt(e.target.value) || 10)}
              style={styles.input}
            />
          </div>
        </>
      )}

      {/* Per SQM Mode */}
      {pricingMode === 'per_sqm' && (
        <>
          <div style={styles.grid}>
            <div>
              <label style={styles.label}>Precio Base por m²</label>
              <input
                type="number"
                value={basePricePerSqm}
                onChange={(e) => setBasePricePerSqm(parseFloat(e.target.value) || 0)}
                style={styles.input}
                step="0.01"
              />
            </div>
            <div>
              <label style={styles.label}>Precio Mínimo</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(parseFloat(e.target.value) || 0)}
                style={styles.input}
                step="0.01"
              />
            </div>
            <div>
              <label style={styles.label}>Área Mínima (m²)</label>
              <input
                type="number"
                value={minArea}
                onChange={(e) => setMinArea(parseFloat(e.target.value) || 0)}
                style={styles.input}
                step="0.001"
              />
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <label style={styles.label}>Descuentos por Volumen</label>
              <button type="button" onClick={addVolumeDiscount} style={styles.addButton}>+ Añadir Descuento</button>
            </div>
            {volumeDiscounts.map((d, index) => (
              <div key={index} style={styles.itemRow}>
                <input
                  type="number"
                  placeholder="Cantidad Mínima"
                  value={d.min_qty}
                  onChange={(e) => updateVolumeDiscount(index, 'min_qty', parseInt(e.target.value) || 0)}
                  style={{ ...styles.input, flex: 1 }}
                />
                <input
                  type="number"
                  placeholder="Descuento %"
                  value={d.discount_percent}
                  onChange={(e) => updateVolumeDiscount(index, 'discount_percent', parseFloat(e.target.value) || 0)}
                  style={{ ...styles.input, flex: 1 }}
                  step="0.1"
                />
                <button type="button" onClick={() => removeVolumeDiscount(index)} style={styles.removeButton}>✕</button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Hybrid Mode */}
      {pricingMode === 'hybrid' && (
        <>
          <div style={styles.grid}>
            <div>
              <label style={styles.label}>Precio Base por m²</label>
              <input
                type="number"
                value={basePricePerSqm}
                onChange={(e) => setBasePricePerSqm(parseFloat(e.target.value) || 0)}
                style={styles.input}
                step="0.01"
              />
            </div>
            <div>
              <label style={styles.label}>Precio Mínimo</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(parseFloat(e.target.value) || 0)}
                style={styles.input}
                step="0.01"
              />
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <label style={styles.label}>Tiers de Tamaño</label>
              <button type="button" onClick={addSizeTier} style={styles.addButton}>+ Añadir Tier</button>
            </div>
            <p style={styles.hint}>Define precios por m² según el área total. Usa "null" para sin límite.</p>
            {sizeTiers.map((tier, index) => (
              <div key={index} style={styles.itemRow}>
                <input
                  type="number"
                  placeholder="Área Máxima (m²) o vacío"
                  value={tier.max_area || ''}
                  onChange={(e) => updateSizeTier(index, 'max_area', e.target.value ? parseFloat(e.target.value) : null)}
                  style={{ ...styles.input, flex: 1 }}
                  step="0.01"
                />
                <input
                  type="number"
                  placeholder="Precio por m²"
                  value={tier.price_per_sqm}
                  onChange={(e) => updateSizeTier(index, 'price_per_sqm', parseFloat(e.target.value) || 0)}
                  style={{ ...styles.input, flex: 1 }}
                  step="0.01"
                />
                <button type="button" onClick={() => removeSizeTier(index)} style={styles.removeButton}>✕</button>
              </div>
            ))}
          </div>

          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <label style={styles.label}>Multiplicadores de Cantidad</label>
              <button type="button" onClick={addQuantityMultiplier} style={styles.addButton}>+ Añadir Multiplicador</button>
            </div>
            <p style={styles.hint}>Multiplica el precio según la cantidad. Valores &lt; 1.0 = descuento.</p>
            {quantityMultipliers.map((mult, index) => (
              <div key={index} style={styles.itemRow}>
                <input
                  type="number"
                  placeholder="Cantidad Mínima"
                  value={mult.min_qty}
                  onChange={(e) => updateQuantityMultiplier(index, 'min_qty', parseInt(e.target.value) || 0)}
                  style={{ ...styles.input, flex: 1 }}
                />
                <input
                  type="number"
                  placeholder="Multiplicador"
                  value={mult.multiplier}
                  onChange={(e) => updateQuantityMultiplier(index, 'multiplier', parseFloat(e.target.value) || 1.0)}
                  style={{ ...styles.input, flex: 1 }}
                  step="0.01"
                />
                <button type="button" onClick={() => removeQuantityMultiplier(index)} style={styles.removeButton}>✕</button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Info Box */}
      <div style={styles.infoBox}>
        <strong>💡 Consejo:</strong> Usa las plantillas rápidas para empezar. Luego ajusta los valores según tus necesidades.
      </div>
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
  select: { width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", backgroundColor: "white" },
  input: { padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" as const, width: "100%" },
  addButton: { backgroundColor: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "500" as const },
  removeButton: { backgroundColor: "#ef4444", color: "white", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
  itemRow: { display: "flex", gap: "8px", marginBottom: "8px", alignItems: "center" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "24px" },
  buttonGroup: { display: "flex", gap: "8px", flexWrap: "wrap" as const },
  templateButton: { backgroundColor: "#f9fafb", color: "#374151", border: "1px solid #d1d5db", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "500" as const },
  hint: { fontSize: "12px", color: "#6b7280", marginTop: "4px", marginBottom: 0 },
  infoBox: { backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "6px", padding: "12px", fontSize: "13px", color: "#1e40af" },
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductPricingConfiguratorWidget

