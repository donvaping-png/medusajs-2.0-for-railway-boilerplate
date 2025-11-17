# Correcciones del Configurador - Lista de Cambios

## 1. Tipos Actualizados

```typescript
type Material = { id: string; name: string; priceMultiplier: number; icon?: string }
type Size = { label: string; width: number; height: number; priceMultiplier: number }
type Shape = { id: string; name: string; icon?: string }
```

## 2. Eliminar Estados de Categoría

```typescript
// ELIMINAR estas líneas:
const [category, setCategory] = useState("")
const [subcategory, setSubcategory] = useState("")
```

## 3. Cambiar Tipo de Shapes

```typescript
// CAMBIAR de:
const [shapes, setShapes] = useState<string[]>([])

// A:
const [shapes, setShapes] = useState<Shape[]>([])
```

## 4. Actualizar allShapes

```typescript
const allShapes: Shape[] = [
  { id: "contorneado", name: "Contorneado", icon: "🔷" },
  { id: "cuadrado", name: "Cuadrado", icon: "⬜" },
  { id: "circular", name: "Circular", icon: "⭕" },
  { id: "esquinas_redondeadas", name: "Esquinas Redondeadas", icon: "▢" },
]
```

## 5. Actualizar Funciones de Shapes

```typescript
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
```

## 6. Actualizar addSize

```typescript
const addSize = () => {
  setSizes([...sizes, { label: "", width: 0, height: 0, priceMultiplier: 1.0 }])
}
```

## 7. Actualizar addMaterial

```typescript
const addMaterial = () => {
  setMaterials([...materials, { id: "", name: "", priceMultiplier: 1.0, icon: "" }])
}
```

## 8. Eliminar Secciones de Categoría en UI

Eliminar completamente las secciones de Categoría y Subcategoría del JSX.

## 9. Actualizar Sección de Formas en UI

```tsx
{/* Formas */}
<div style={styles.section}>
  <div style={styles.sectionHeader}>
    <label style={styles.label}>Formas Disponibles</label>
  </div>
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
```

## 10. Actualizar Sección de Materiales en UI

Añadir campo de icono:

```tsx
<input 
  type="text" 
  placeholder="Icono/Emoji" 
  value={material.icon || ""} 
  onChange={(e) => updateMaterial(index, "icon", e.target.value)} 
  style={{...styles.input, width: "80px"}} 
/>
```

## 11. Actualizar Sección de Tamaños en UI

Añadir campo de multiplicador:

```tsx
<input 
  type="number" 
  placeholder="Multiplicador" 
  value={size.priceMultiplier} 
  onChange={(e) => updateSize(index, "priceMultiplier", parseFloat(e.target.value))} 
  style={{...styles.input, width: "120px"}} 
  step="0.1" 
/>
```

## 12. Actualizar handleSave

Eliminar guardado de categorías:

```typescript
// ELIMINAR estas líneas:
if (category) metadata["category"] = category
if (subcategory) metadata["subcategory"] = subcategory
```

## 13. Añadir Hint Style

```typescript
hint: {
  fontSize: "12px",
  color: "#6b7280",
  marginBottom: "8px",
}
```

## Resumen de Cambios

- ✅ Añadido multiplicador de precio por tamaño
- ✅ Añadido campo de icono para materiales y formas
- ✅ Eliminadas categorías (usar las de Medusa)
- ✅ Actualizado tipo de shapes a objetos
- ⏳ Pendiente: Validación de tamaño personalizado
- ⏳ Pendiente: Corrección de cálculos de precio en frontend
