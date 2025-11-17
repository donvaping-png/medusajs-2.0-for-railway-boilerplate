# Tareas Pendientes del Configurador

## ✅ Completado

1. ✅ Tipos actualizados (Material con icon, Size con priceMultiplier, Shape como objeto)
2. ✅ Documentación de correcciones en `backend/CORRECCIONES_CONFIGURADOR.md`

## 🔄 En Progreso - Backend Widget

### Cambios Necesarios en `product-configurator-complete.tsx`:

1. **Eliminar Estados de Categoría**
   - Eliminar `const [category, setCategory] = useState("")`
   - Eliminar `const [subcategory, setSubcategory] = useState("")`

2. **Actualizar Sección de Formas**
   - Cambiar checkboxes para usar `shape.id` y `shape.icon`
   - Mostrar iconos junto a nombres

3. **Actualizar Sección de Materiales**
   - Añadir campo de input para icono/emoji
   - Mostrar icono en la tabla

4. **Actualizar Sección de Tamaños**
   - Añadir campo de input para `priceMultiplier`
   - Explicar que afecta el precio según el tamaño

5. **Eliminar Secciones de UI**
   - Eliminar selector de Categoría
   - Eliminar selector de Subcategoría

6. **Actualizar handleSave**
   - Eliminar guardado de category/subcategory

## 🔴 Crítico - Frontend

### 1. Actualizar Hook `useStickerConfigurator.ts`

**Problema**: Usa configuración hardcodeada en lugar de la del producto

**Solución**:
```typescript
// Recibir configuración del producto
interface UseStickerConfiguratorProps {
  productConfig: {
    shapes: Shape[]
    materials: Material[]
    sizes: Size[]
    quantities: Quantity[]
    finishes: Finish[]
    allowCustomSize: boolean
    minQuantity: number
    maxWidth?: number
    maxHeight?: number
  }
}

// Actualizar cálculo de precio para usar:
// - size.priceMultiplier (multiplicador por tamaño)
// - material.priceMultiplier (multiplicador por material)
// - quantity.basePrice (precio base de la tabla)
```

### 2. Corregir Cálculo de Precio

**Fórmula Correcta**:
```typescript
// 1. Obtener precio base de la tabla según cantidad
const quantityTier = quantities.find(q => quantity >= q.qty) || quantities[0]
const basePrice = quantityTier.basePrice

// 2. Aplicar multiplicador de tamaño
const sizeMultiplier = selectedSize.priceMultiplier || 1.0

// 3. Aplicar multiplicador de material
const materialMultiplier = selectedMaterial.priceMultiplier || 1.0

// 4. Calcular precio unitario
const unitPrice = basePrice * sizeMultiplier * materialMultiplier

// 5. Calcular descuento por volumen
const discount = calculateVolumeDiscount(quantity)

// 6. Precio total
const totalPrice = unitPrice * quantity * (1 - discount)
```

### 3. Corregir Cálculo de Descuentos

**Problema**: Los descuentos no se calculan correctamente

**Solución**:
```typescript
function calculateVolumeDiscount(quantity: number): number {
  // Descuentos progresivos
  if (quantity >= 1000) return 0.30  // 30% descuento
  if (quantity >= 500) return 0.25   // 25% descuento
  if (quantity >= 250) return 0.20   // 20% descuento
  if (quantity >= 100) return 0.15   // 15% descuento
  if (quantity >= 50) return 0.10    // 10% descuento
  if (quantity >= 25) return 0.05    // 5% descuento
  return 0                            // Sin descuento
}
```

### 4. Validar Tamaño Personalizado

**Problema**: No respeta mínimos y máximos

**Solución**:
```typescript
// En la validación:
if (config.size.custom) {
  const { width, height } = config.size.custom
  
  // Obtener tamaño mínimo (primer tamaño configurado)
  const minSize = sizes[0]
  if (width < minSize.width || height < minSize.height) {
    errors.size = `Tamaño mínimo: ${minSize.width}x${minSize.height} cm`
  }
  
  // Validar máximos si están configurados
  if (maxWidth && width > maxWidth) {
    errors.size = `Ancho máximo: ${maxWidth} cm`
  }
  if (maxHeight && height > maxHeight) {
    errors.size = `Alto máximo: ${maxHeight} cm`
  }
}
```

### 5. Ignorar Precio Base de Medusa

**Problema**: Se usa el precio del variant de Medusa

**Solución**:
```typescript
// En ProductDetailsPage.tsx o donde se muestre el precio:
if (product.metadata?.product_type === "custom_sticker") {
  // NO mostrar product.variants[0].prices
  // Mostrar "Desde €X.XX" usando el precio más bajo de quantities
  const minPrice = Math.min(...config.quantities.map(q => q.basePrice))
  return `Desde €${minPrice.toFixed(2)}`
}
```

### 6. Añadir Iconos a UI

**En StickerConfigurator.tsx**:
```tsx
{/* Formas con iconos */}
{shapes.map(shape => (
  <button>
    <span className="text-2xl">{shape.icon}</span>
    <span>{shape.name}</span>
  </button>
))}

{/* Materiales con iconos */}
{materials.map(material => (
  <button>
    {material.icon && <span className="text-xl">{material.icon}</span>}
    <span>{material.name}</span>
  </button>
))}
```

## 📋 Orden de Implementación

### Fase 1: Backend Widget (30 min)
1. Eliminar categorías del widget
2. Actualizar UI de formas con iconos
3. Añadir campo icono a materiales
4. Añadir campo priceMultiplier a tamaños

### Fase 2: Frontend Hook (45 min)
1. Actualizar `useStickerConfigurator` para recibir config del producto
2. Corregir cálculo de precio con multiplicadores
3. Corregir cálculo de descuentos
4. Validar tamaño personalizado con mín/máx

### Fase 3: Frontend UI (30 min)
1. Actualizar `StickerConfigurator` para mostrar iconos
2. Ignorar precio base de Medusa
3. Mostrar "Desde €X.XX" en listados
4. Actualizar preview de precio

### Fase 4: Testing (15 min)
1. Probar cálculos de precio
2. Probar validaciones
3. Probar con diferentes configuraciones
4. Verificar descuentos

## 🎯 Resultado Esperado

- ✅ Tamaños con multiplicador de precio (4x4 ≠ 5x5)
- ✅ Tamaño personalizado respeta mín/máx
- ✅ Precio base de Medusa ignorado
- ✅ Descuentos calculados correctamente
- ✅ Iconos en materiales y formas
- ✅ Sin categorías en widget (usa las de Medusa)

## 📝 Notas

- El widget del backend necesita ser actualizado manualmente debido al autoformat
- El frontend necesita cambios en múltiples archivos
- Priorizar corrección de cálculos de precio (más crítico)
- Los iconos son mejora visual (menos crítico)
