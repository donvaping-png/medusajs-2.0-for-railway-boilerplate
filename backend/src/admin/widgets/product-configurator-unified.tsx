import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { useState, useEffect } from "react"

// Types
type Material = { id: string; name: string; priceMultiplier: number; icon?: string }
type Size = { label: string; width: number; height: number }
type Finish = { id: string; name: string }
type Shape = { id: string; name: string; icon?: string }
type PricingMode = 'fixed_table' | 'per_sqm' | 'hybrid'

const ProductConfiguratorUnified = ({ data }: { data: any }) => {
  const product = data
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'config' | 'pricing'>('config')
  
  // Product config state
  const [isCustom, setIsCustom] = useState(false)
  const [shapes, setShapes] = useState<Shape[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [sizes, setSizes] = useState<Size[]>([])
  const [finishes, setFinishes] = useState<Finish[]>([])
  const [allowCustomSize, setAllowCustomSize] = useState(false)
  const [minQuantity, setMinQuantity] = useState(10)
  const [maxWidth, setMaxWidth] = useState("")
  const [maxHeight, setMaxHeight] = useState("")
  
  // Pricing state
  const [pricingMode, setPricingMode] = useState<PricingMode>('fixed_table')
  const [quantities, setQuantities] = useState<Array<{ qty: number; basePrice: number }>>([])
  const [basePricePerSqm, setBasePricePerSqm] = useState(15.00)
  const [minPrice, setMinPrice] = useState(10.00)
  const [minArea, setMinArea] = useState(0.01)
  const [volumeDiscounts, setVolumeDiscounts] = useState<Array<{ min_qty: number; discount_percent: number }>>([])
  const [sizeTiers, setSizeTiers] = useState<Array<{ max_area: number | null; price_per_sqm: number }>>([])
  const [quantityMultipliers, setQuantityMultipliers] = useState<Array<{ min_qty: number; multiplier: number }>>([])
  
  const [saving, setSaving] = useState(false)

  // Load data from product metadata
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

      // Load product config
      setIsCustom(product.metadata.product_type === "custom_sticker")
      
      const config = parseField(product.metadata.config)
      if (config) {
        setShapes(config.shapes || [])
        setMaterials(config.materials || [])
        setSizes(config.sizes || [])
        setFinishes(config.finishes || [])
        setAllowCustomSize(config.allowCustomSize || false)
        setMinQuantity(config.minQuantity || 10)
        setMaxWidth(config.maxWidth || "")
        setMaxHeight(config.maxHeight || "")
      }

      // Load pricing config
      const pricing = parseField(product.metadata.pricing)
      if (pricing) {
        setPricingMode(pricing.mode || 'fixed_table')
        
        if (pricing.mode === 'fixed_table') {
          setQuantities(pricing.quantities || [])
          setMinQuantity(pricing.min_quantity || 10)
        } else if (pricing.mode === 'per_sqm') {
          setBasePricePerSqm(pricing.base_price_per_sqm || 15.00)
          setMinPrice(pricing.min_price || 10.00)
          setMinArea(pricing.min_area || 0.01)
          setVolumeDiscounts(pricing.volume_discounts || [])
        } else if (pricing.mode === 'hybrid') {
          setBasePricePerSqm(pricing.base_price_per_sqm || 15.00)
          setMinPrice(pricing.min_price || 10.00)
          setSizeTiers(pricing.size_tiers || [])
          setQuantityMultipliers(pricing.quantity_multipliers || [])
        }
      }
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

  const handleSave = async () => {
    setSaving(true)
    try {
      const metadata: any = {
        product_type: isCustom ? "custom_sticker" : "standard",
      }

      if (isCustom) {
        // Save product config
        metadata.config = JSON.stringify({
          shapes,
          materials,
          sizes,
          finishes,
          allowCustomSize,
          minQuantity,
          maxWidth,
          maxHeight,
        })

        // Save pricing config
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
          }
        } else if (pricingMode === 'hybrid') {
          pricingConfig = {
            mode: 'hybrid',
            base_price_per_sqm: basePricePerSqm,
            size_tiers: sizeTiers,
            quantity_multipliers: quantityMultipliers,
            min_price: minPrice,
          }
        }

        metadata.pricing = JSON.stringify(pricingConfig)
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

  // Helper functions for arrays
  const addMaterial = () => setMaterials([...materials, { id: "", name: "", priceMultiplier: 1.0 }])
  const updateMaterial = (index: number, field: keyof Material, value: any) => {
    const newMaterials = [...materials]
    newMaterials[index] = { ...newMaterials[index], [field]: value }
    setMaterials(newMaterials)
  }
  const removeMaterial = (index: number) => setMaterials(materials.filter((_, i) => i !== index))

  const addSize = () => setSizes([...sizes, { label: "", width: 0, height: 0 }])
  const updateSize = (index: number, field: keyof Size, value: any) => {
    const newSizes = [...sizes]
    newSizes[index] = { ...newSizes[index], [field]: value }
    setSizes(newSizes)
  }
  const removeSize = (index: number) => setSizes(sizes.filter((_, i) => i !== index))

  const addFinish = () => setFinishes([...finishes, { id: "", name: "" }])
  const updateFinish = (index: number, field: keyof Finish, value: any) => {
    const newFinishes = [...finishes]
    newFinishes[index] = { ...newFinishes[index], [field]: value }
    setFinishes(newFinishes)
  }
  const removeFinish = (index: number) => setFinishes(finishes.filter((_, i) => i !== index))

  const addQuantity = () => setQuantities([...quantities, { qty: 0, basePrice: 0 }])
  const updateQuantity = (index: number, field: 'qty' | 'basePrice', value: number) => {
    const newQuantities = [...quantities]
    newQuantities[index][field] = value
    setQuantities(newQuantities)
  }
  const removeQuantity = (index: number) => setQuantities(quantities.filter((_, i) => i !== index))

  const addVolumeDiscount = () => setVolumeDiscounts([...volumeDiscounts, { min_qty: 0, discount_percent: 0 }])
  const updateVolumeDiscount = (index: number, field: 'min_qty' | 'discount_percent', value: number) => {
    const newDiscounts = [...volumeDiscounts]
    newDiscounts[index][field] = value
    setVolumeDiscounts(newDiscounts)
  }
  const removeVolumeDiscount = (index: number) => setVolumeDiscounts(volumeDiscounts.filter((_, i) => i !== index))

  const addSizeTier = () => setSizeTiers([...sizeTiers, { max_area: 0, price_per_sqm: 0 }])
  const updateSizeTier = (index: number, field: 'max_area' | 'price_per_sqm', value: number | null) => {
    const newTiers = [...sizeTiers]
    newTiers[index][field] = value as any
    setSizeTiers(newTiers)
  }
  const removeSizeTier = (index: number) => setSizeTiers(sizeTiers.filter((_, i) => i !== index))

  const addQuantityMultiplier = () => setQuantityMultipliers([...quantityMultipliers, { min_qty: 0, multiplier: 1.0 }])
  const updateQuantityMultiplier = (index: number, field: 'min_qty' | 'multiplier', value: number) => {
    const newMultipliers = [...quantityMultipliers]
    newMultipliers[index][field] = value
    setQuantityMultipliers(newMultipliers)
  }
  const removeQuantityMultiplier = (index: number) => setQuantityMultipliers(quantityMultipliers.filter((_, i) => i !== index))

  const loadPricingTemplate = (template: string) => {
    if (template === 'floor_stickers') {
      setPricingMode('fixed_table')
      setQuantities([
        { qty: 10, basePrice: 50.00 },
        { qty: 25, basePrice: 110.00 },
        { qty: 50, basePrice: 200.00 },
        { qty: 100, basePrice: 350.00 },
      ])
    } else if (template === 'vinyl_sqm') {
      setPricingMode('per_sqm')
      setBasePricePerSqm(25.00)
      setMinPrice(15.00)
      setVolumeDiscounts([
        { min_qty: 10, discount_percent: 5 },
        { min_qty: 25, discount_percent: 10 },
        { min_qty: 50, discount_percent: 15 },
      ])
    } else if (template === 'premium_hybrid') {
      setPricingMode('hybrid')
      setBasePricePerSqm(30.00)
      setMinPrice(5.00)
      setSizeTiers([
        { max_area: 10, price_per_sqm: 50.00 },
        { max_area: 50, price_per_sqm: 35.00 },
        { max_area: null, price_per_sqm: 20.00 },
      ])
      setQuantityMultipliers([
        { min_qty: 1, multiplier: 1.0 },
        { min_qty: 50, multiplier: 0.9 },
        { min_qty: 100, multiplier: 0.8 },
      ])
    }
  }


  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>⚙️ Configurador de Producto Completo</h3>
        <button 
          onClick={handleSave} 
          disabled={saving} 
          style={saving ? styles.disabledButton : styles.primaryButton}
        >
          {saving ? "Guardando..." : "💾 Guardar Todo"}
        </button>
      </div>

      {/* Product Type Selector */}
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
          {/* Tabs */}
          <div style={styles.tabs}>
            <button
              onClick={() => setActiveTab('config')}
              style={activeTab === 'config' ? styles.tabActive : styles.tab}
            >
              ⚙️ Configuración
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              style={activeTab === 'pricing' ? styles.tabActive : styles.tab}
            >
              💰 Precios
            </button>
          </div>

          {/* Configuration Tab */}
          {activeTab === 'config' && (
            <div style={styles.tabContent}>
              {/* Shapes */}
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

              {/* Materials */}
              <div style={styles.section}>
                <div style={styles.sectionHeader}>
                  <label style={styles.label}>Materiales</label>
                  <button type="button" onClick={addMaterial} style={styles.addButton}>
                    + Añadir Material
                  </button>
                </div>
                {materials.map((material, index) => (
                  <div key={index} style={styles.itemRow}>
                    <input 
                      type="text" 
                      placeholder="ID (ej: vinilo)" 
                      value={material.id} 
                      onChange={(e) => updateMaterial(index, "id", e.target.value)} 
                      style={{...styles.input, flex: 1}} 
                    />
                    <input 
                      type="text" 
                      placeholder="Nombre" 
                      value={material.name} 
                      onChange={(e) => updateMaterial(index, "name", e.target.value)} 
                      style={{...styles.input, flex: 1}} 
                    />
                    <input 
                      type="number" 
                      placeholder="Mult." 
                      value={material.priceMultiplier} 
                      onChange={(e) => updateMaterial(index, "priceMultiplier", parseFloat(e.target.value))} 
                      style={{...styles.input, width: "100px"}} 
                      step="0.1" 
                    />
                    <button type="button" onClick={() => removeMaterial(index)} style={styles.removeButton}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Sizes */}
              <div style={styles.section}>
                <div style={styles.sectionHeader}>
                  <label style={styles.label}>Tamaños</label>
                  <button type="button" onClick={addSize} style={styles.addButton}>
                    + Añadir Tamaño
                  </button>
                </div>
                {sizes.map((size, index) => (
                  <div key={index} style={styles.itemRow}>
                    <input 
                      type="text" 
                      placeholder="Label (ej: 10x10 cm)" 
                      value={size.label} 
                      onChange={(e) => updateSize(index, "label", e.target.value)} 
                      style={{...styles.input, flex: 1}} 
                    />
                    <input 
                      type="number" 
                      placeholder="Ancho" 
                      value={size.width} 
                      onChange={(e) => updateSize(index, "width", parseFloat(e.target.value))} 
                      style={{...styles.input, width: "100px"}} 
                      step="0.1" 
                    />
                    <input 
                      type="number" 
                      placeholder="Alto" 
                      value={size.height} 
                      onChange={(e) => updateSize(index, "height", parseFloat(e.target.value))} 
                      style={{...styles.input, width: "100px"}} 
                      step="0.1" 
                    />
                    <button type="button" onClick={() => removeSize(index)} style={styles.removeButton}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Finishes */}
              <div style={styles.section}>
                <div style={styles.sectionHeader}>
                  <label style={styles.label}>Acabados (Opcional)</label>
                  <button type="button" onClick={addFinish} style={styles.addButton}>
                    + Añadir Acabado
                  </button>
                </div>
                {finishes.map((finish, index) => (
                  <div key={index} style={styles.itemRow}>
                    <input 
                      type="text" 
                      placeholder="ID (ej: mate)" 
                      value={finish.id} 
                      onChange={(e) => updateFinish(index, "id", e.target.value)} 
                      style={{...styles.input, flex: 1}} 
                    />
                    <input 
                      type="text" 
                      placeholder="Nombre (ej: Mate)" 
                      value={finish.name} 
                      onChange={(e) => updateFinish(index, "name", e.target.value)} 
                      style={{...styles.input, flex: 1}} 
                    />
                    <button type="button" onClick={() => removeFinish(index)} style={styles.removeButton}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Additional Options */}
              <div style={styles.section}>
                <label style={styles.label}>Opciones Adicionales</label>
                <label style={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={allowCustomSize} 
                    onChange={(e) => setAllowCustomSize(e.target.checked)} 
                    style={styles.checkbox} 
                  />
                  <span>Permitir tamaño personalizado</span>
                </label>
                <div style={styles.grid}>
                  <div>
                    <label style={styles.smallLabel}>Cantidad Mínima</label>
                    <input 
                      type="number" 
                      value={minQuantity} 
                      onChange={(e) => setMinQuantity(parseInt(e.target.value) || 10)} 
                      style={styles.input} 
                    />
                  </div>
                  {allowCustomSize && (
                    <>
                      <div>
                        <label style={styles.smallLabel}>Ancho Máximo (cm)</label>
                        <input 
                          type="number" 
                          value={maxWidth} 
                          onChange={(e) => setMaxWidth(e.target.value)} 
                          placeholder="Sin límite" 
                          style={styles.input} 
                        />
                      </div>
                      <div>
                        <label style={styles.smallLabel}>Alto Máximo (cm)</label>
                        <input 
                          type="number" 
                          value={maxHeight} 
                          onChange={(e) => setMaxHeight(e.target.value)} 
                          placeholder="Sin límite" 
                          style={styles.input} 
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}


          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <div style={styles.tabContent}>
              {/* Templates */}
              <div style={styles.section}>
                <label style={styles.label}>Plantillas Rápidas</label>
                <div style={styles.buttonGroup}>
                  <button type="button" onClick={() => loadPricingTemplate('floor_stickers')} style={styles.templateButton}>
                    🏢 Pegatinas Suelo
                  </button>
                  <button type="button" onClick={() => loadPricingTemplate('vinyl_sqm')} style={styles.templateButton}>
                    📐 Vinilos por m²
                  </button>
                  <button type="button" onClick={() => loadPricingTemplate('premium_hybrid')} style={styles.templateButton}>
                    ⭐ Premium Híbrido
                  </button>
                </div>
              </div>

              {/* Pricing Mode */}
              <div style={styles.section}>
                <label style={styles.label}>Modo de Precio</label>
                <select 
                  value={pricingMode} 
                  onChange={(e) => setPricingMode(e.target.value as PricingMode)} 
                  style={styles.select}
                >
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
                <div style={styles.section}>
                  <div style={styles.sectionHeader}>
                    <label style={styles.label}>Tabla de Precios</label>
                    <button type="button" onClick={addQuantity} style={styles.addButton}>
                      + Añadir Precio
                    </button>
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
                      <button type="button" onClick={() => removeQuantity(index)} style={styles.removeButton}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
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
                      <button type="button" onClick={addVolumeDiscount} style={styles.addButton}>
                        + Añadir Descuento
                      </button>
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
                        <button type="button" onClick={() => removeVolumeDiscount(index)} style={styles.removeButton}>
                          ✕
                        </button>
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
                      <button type="button" onClick={addSizeTier} style={styles.addButton}>
                        + Añadir Tier
                      </button>
                    </div>
                    <p style={styles.hint}>Define precios por m² según el área total.</p>
                    {sizeTiers.map((tier, index) => (
                      <div key={index} style={styles.itemRow}>
                        <input
                          type="number"
                          placeholder="Área Máxima (m²)"
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
                        <button type="button" onClick={() => removeSizeTier(index)} style={styles.removeButton}>
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div style={styles.section}>
                    <div style={styles.sectionHeader}>
                      <label style={styles.label}>Multiplicadores de Cantidad</label>
                      <button type="button" onClick={addQuantityMultiplier} style={styles.addButton}>
                        + Añadir Multiplicador
                      </button>
                    </div>
                    <p style={styles.hint}>Valores &lt; 1.0 = descuento.</p>
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
                        <button type="button" onClick={() => removeQuantityMultiplier(index)} style={styles.removeButton}>
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Info Box */}
              <div style={styles.infoBox}>
                <strong>💡 Consejo:</strong> Usa las plantillas rápidas para empezar. Los precios se calculan automáticamente en el frontend.
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}


// Dark Mode Styles for Medusa Admin
const styles = {
  container: { 
    backgroundColor: "#1c1c1f", 
    border: "1px solid #2d2d32", 
    borderRadius: "8px", 
    padding: "20px", 
    marginTop: "16px",
    color: "#e4e4e7"
  },
  header: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: "20px", 
    paddingBottom: "12px", 
    borderBottom: "1px solid #2d2d32" 
  },
  title: { 
    fontSize: "18px", 
    fontWeight: "600" as const, 
    margin: 0, 
    color: "#fafafa" 
  },
  primaryButton: { 
    backgroundColor: "#3b82f6", 
    color: "white", 
    border: "none", 
    padding: "10px 20px", 
    borderRadius: "6px", 
    cursor: "pointer", 
    fontSize: "14px", 
    fontWeight: "500" as const,
    transition: "all 0.2s"
  },
  disabledButton: { 
    backgroundColor: "#52525b", 
    color: "#a1a1aa", 
    border: "none", 
    padding: "10px 20px", 
    borderRadius: "6px", 
    cursor: "not-allowed", 
    fontSize: "14px", 
    fontWeight: "500" as const 
  },
  tabs: {
    display: "flex",
    gap: "8px",
    marginBottom: "24px",
    borderBottom: "1px solid #2d2d32",
    paddingBottom: "0"
  },
  tab: {
    backgroundColor: "transparent",
    color: "#a1a1aa",
    border: "none",
    borderBottom: "2px solid transparent",
    padding: "12px 20px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500" as const,
    transition: "all 0.2s"
  },
  tabActive: {
    backgroundColor: "transparent",
    color: "#3b82f6",
    border: "none",
    borderBottom: "2px solid #3b82f6",
    padding: "12px 20px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600" as const
  },
  tabContent: {
    animation: "fadeIn 0.3s ease-in"
  },
  section: { 
    marginBottom: "24px" 
  },
  sectionHeader: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: "12px" 
  },
  label: { 
    display: "block", 
    fontSize: "14px", 
    fontWeight: "500" as const, 
    marginBottom: "8px", 
    color: "#fafafa" 
  },
  smallLabel: { 
    display: "block", 
    fontSize: "12px", 
    fontWeight: "500" as const, 
    marginBottom: "4px", 
    color: "#d4d4d8" 
  },
  select: { 
    width: "100%", 
    padding: "8px 12px", 
    border: "1px solid #3f3f46", 
    borderRadius: "6px", 
    fontSize: "14px", 
    backgroundColor: "#27272a",
    color: "#fafafa",
    cursor: "pointer"
  },
  input: { 
    padding: "8px 12px", 
    border: "1px solid #3f3f46", 
    borderRadius: "6px", 
    fontSize: "14px", 
    boxSizing: "border-box" as const, 
    width: "100%",
    backgroundColor: "#27272a",
    color: "#fafafa"
  },
  checkboxGroup: { 
    display: "flex", 
    flexDirection: "column" as const, 
    gap: "8px" 
  },
  checkboxLabel: { 
    display: "flex", 
    alignItems: "center", 
    gap: "8px", 
    padding: "10px 12px", 
    border: "1px solid #3f3f46", 
    borderRadius: "6px", 
    cursor: "pointer",
    backgroundColor: "#27272a",
    transition: "all 0.2s"
  },
  checkbox: { 
    width: "16px", 
    height: "16px", 
    cursor: "pointer",
    accentColor: "#3b82f6"
  },
  addButton: { 
    backgroundColor: "#27272a", 
    color: "#fafafa", 
    border: "1px solid #3f3f46", 
    padding: "6px 12px", 
    borderRadius: "6px", 
    cursor: "pointer", 
    fontSize: "13px", 
    fontWeight: "500" as const,
    transition: "all 0.2s"
  },
  removeButton: { 
    backgroundColor: "#dc2626", 
    color: "white", 
    border: "none", 
    padding: "6px 10px", 
    borderRadius: "6px", 
    cursor: "pointer", 
    fontSize: "14px",
    transition: "all 0.2s"
  },
  itemRow: { 
    display: "flex", 
    gap: "8px", 
    marginBottom: "8px", 
    alignItems: "center" 
  },
  grid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(3, 1fr)", 
    gap: "12px", 
    marginTop: "12px" 
  },
  buttonGroup: { 
    display: "flex", 
    gap: "8px", 
    flexWrap: "wrap" as const 
  },
  templateButton: { 
    backgroundColor: "#27272a", 
    color: "#fafafa", 
    border: "1px solid #3f3f46", 
    padding: "8px 16px", 
    borderRadius: "6px", 
    cursor: "pointer", 
    fontSize: "13px", 
    fontWeight: "500" as const,
    transition: "all 0.2s"
  },
  hint: { 
    fontSize: "12px", 
    color: "#a1a1aa", 
    marginTop: "4px", 
    marginBottom: 0,
    fontStyle: "italic" as const
  },
  infoBox: { 
    backgroundColor: "#1e3a8a", 
    border: "1px solid #3b82f6", 
    borderRadius: "6px", 
    padding: "12px", 
    fontSize: "13px", 
    color: "#bfdbfe",
    marginTop: "16px"
  },
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductConfiguratorUnified
