# 🚀 Guía de Integración del Configurador de Precios

## Archivos Creados

### Backend
- `backend/CONFIGURADOR_PRECIOS.md` - Documentación del sistema
- `backend/src/admin/widgets/product-pricing-configurator.tsx` - Widget del Admin

### Frontend
- `storefront/src/types/pricing-configurator.ts` - Tipos TypeScript
- `storefront/src/lib/helpers/pricing-calculator.ts` - Motor de cálculo
- `storefront/src/hooks/usePricingCalculator.ts` - Hook React
- `storefront/src/components/molecules/PriceBreakdown/` - Componente de desglose

## Paso 1: Configurar Precios en el Admin

### Opción A: Usar Plantillas Rápidas

1. Ve al Admin de Medusa: `http://localhost:9000/app`
2. Edita un producto
3. Busca el widget "💰 Configurador de Precios"
4. Click en una plantilla:
   - **🏢 Pegatinas Suelo**: Tabla fija de precios
   - **📐 Vinilos por m²**: Precio por metro cuadrado
   - **⭐ Premium Híbrido**: Sistema híbrido avanzado
5. Ajusta los valores según necesites
6. Click en "💾 Guardar Precios"

### Opción B: Configurar Manualmente

#### Tabla Fija
```json
{
  "mode": "fixed_table",
  "quantities": [
    { "qty": 10, "basePrice": 50.00 },
    { "qty": 25, "basePrice": 110.00 },
    { "qty": 50, "basePrice": 200.00 }
  ],
  "min_quantity": 10
}
```

#### Por Metro Cuadrado
```json
{
  "mode": "per_sqm",
  "base_price_per_sqm": 25.00,
  "min_price": 15.00,
  "min_area": 0.01,
  "volume_discounts": [
    { "min_qty": 10, "discount_percent": 5 },
    { "min_qty": 25, "discount_percent": 10 }
  ],
  "shape_multipliers": {
    "contorneado": 1.3,
    "cuadrado": 1.0,
    "circular": 1.15
  }
}
```

#### Híbrido
```json
{
  "mode": "hybrid",
  "base_price_per_sqm": 30.00,
  "size_tiers": [
    { "max_area": 10, "price_per_sqm": 50.00 },
    { "max_area": 50, "price_per_sqm": 35.00 },
    { "max_area": null, "price_per_sqm": 20.00 }
  ],
  "quantity_multipliers": [
    { "min_qty": 1, "multiplier": 1.0 },
    { "min_qty": 50, "multiplier": 0.9 },
    { "min_qty": 100, "multiplier": 0.8 }
  ],
  "min_price": 5.00
}
```

## Paso 2: Integrar en el Configurador

### Actualizar el Hook del Configurador

```typescript
// storefront/src/hooks/useStickerConfigurator.ts

import { usePricingCalculator } from '@/hooks/usePricingCalculator'
import type { PricingConfig } from '@/types/pricing-configurator'

export function useStickerConfigurator({
  subcategoryConfig,
  categorySlug,
  pricingConfig, // ← Nuevo parámetro
}: UseStickerConfiguratorProps) {
  // ... código existente ...

  // Obtener material actual
  const material = subcategoryConfig.allowedMaterials.find(
    (m) => m.id === config.material
  )
  const materialMultiplier = material?.priceMultiplier || 1.0

  // Usar el nuevo sistema de precios
  const pricing = usePricingCalculator({
    pricingConfig,
    width: currentDimensions.width,
    height: currentDimensions.height,
    quantity: config.quantity,
    materialMultiplier,
    shape: config.shape,
    finish: config.finish,
  })

  return {
    config,
    updateField,
    updateSize,
    updateImage,
    clearImage,
    pricing, // ← Retornar el objeto de pricing
    currentDimensions,
    validation,
  }
}
```

### Actualizar el Componente del Configurador

```typescript
// storefront/src/components/organisms/StickerConfigurator/StickerConfigurator.tsx

import { PriceBreakdown } from '@/components/molecules/PriceBreakdown'

export function StickerConfigurator({ product, subcategoryConfig }: Props) {
  // Obtener pricing config del producto
  const pricingConfig = product.metadata?.pricing
    ? JSON.parse(product.metadata.pricing)
    : null

  const {
    config,
    updateField,
    updateSize,
    updateImage,
    clearImage,
    pricing, // ← Usar el nuevo pricing
    currentDimensions,
    validation,
  } = useStickerConfigurator({
    subcategoryConfig,
    categorySlug: product.metadata?.category || 'pegatinas',
    pricingConfig, // ← Pasar la config
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Configuración */}
      <div>
        {/* ... campos del configurador ... */}
      </div>

      {/* Resumen y Precio */}
      <div>
        {/* Resumen actual */}
        <ConfiguratorSummary config={config} />

        {/* Nuevo: Desglose de Precio */}
        {pricing && (
          <PriceBreakdown
            result={pricing.result}
            discounts={pricing.discounts}
            savings={pricing.savings}
            nextDiscount={pricing.nextDiscount}
            className="mt-4"
          />
        )}

        {/* Botón de añadir al carrito */}
        <button
          onClick={handleAddToCart}
          disabled={!validation.isValid}
          className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg"
        >
          Añadir al Carrito - {pricing?.formattedTotalPrice || '€0.00'}
        </button>
      </div>
    </div>
  )
}
```

## Paso 3: Actualizar la Función de Añadir al Carrito

```typescript
// storefront/src/lib/helpers/sticker-cart.ts

export async function addCustomStickerToCart(
  payload: AddToCartPayload,
  pricingResult: PriceCalculationResult // ← Nuevo parámetro
): Promise<{ success: boolean; message: string; cartId?: string }> {
  try {
    // Usar el precio calculado por el sistema
    const response = await fetch('/api/cart/line-items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        variant_id: payload.productId,
        quantity: payload.quantity,
        unit_price: pricingResult.unitPrice, // ← Precio calculado
        metadata: {
          ...payload.metadata,
          pricing_breakdown: pricingResult.breakdown, // ← Guardar desglose
        },
      }),
    })

    if (!response.ok) {
      throw new Error('Error al añadir al carrito')
    }

    const data = await response.json()
    return {
      success: true,
      message: 'Producto añadido al carrito',
      cartId: data.cart.id,
    }
  } catch (error) {
    console.error('[addCustomStickerToCart] Error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}
```

## Paso 4: Probar el Sistema

### Ejemplo 1: Pegatinas con Precio Fijo

1. Crea un producto "Pegatinas para Suelo"
2. Configura pricing mode: `fixed_table`
3. Añade precios:
   - 10 uts = €50
   - 25 uts = €110
   - 50 uts = €200
4. Prueba en el frontend:
   - Selecciona 10 unidades → Precio: €50.00
   - Selecciona 25 unidades → Precio: €110.00
   - Precio unitario se calcula automáticamente

### Ejemplo 2: Vinilos por Metro Cuadrado

1. Crea un producto "Vinilos Decorativos"
2. Configura pricing mode: `per_sqm`
3. Precio base: €25/m²
4. Descuentos:
   - 10+ uts: 5%
   - 25+ uts: 10%
   - 50+ uts: 15%
5. Prueba en el frontend:
   - 10x10 cm (0.01 m²) × 1 ud = €0.25
   - 10x10 cm × 10 uds = €2.38 (5% desc)
   - 50x50 cm (0.25 m²) × 50 uds = €265.63 (15% desc)

### Ejemplo 3: Sistema Híbrido

1. Crea un producto "Etiquetas Premium"
2. Configura pricing mode: `hybrid`
3. Tiers de tamaño:
   - 0-10 m²: €50/m²
   - 10-50 m²: €35/m²
   - 50+ m²: €20/m²
4. Multiplicadores de cantidad:
   - 1-49: ×1.0
   - 50-99: ×0.9
   - 100+: ×0.8
5. Prueba diferentes combinaciones

## Ventajas del Sistema

### 1. Flexibilidad Total
- Cada producto puede usar el modo que mejor se adapte
- Fácil cambiar entre modos sin tocar código

### 2. Precios Justos
- El precio por m² refleja el costo real
- Los descuentos incentivan compras mayores

### 3. Transparencia
- El cliente ve exactamente cómo se calcula el precio
- Desglose completo de multiplicadores y descuentos

### 4. Escalabilidad
- Fácil añadir nuevos modos de precio
- Sistema modular y extensible

### 5. Mantenibilidad
- Todo se configura desde el Admin
- No requiere cambios en el código

## Casos de Uso Recomendados

### Tabla Fija (`fixed_table`)
- ✅ Productos con precios negociados
- ✅ Paquetes predefinidos
- ✅ Promociones especiales
- ✅ Productos con costos fijos de producción

### Por Metro Cuadrado (`per_sqm`)
- ✅ Vinilos decorativos
- ✅ Lonas publicitarias
- ✅ Papel pintado
- ✅ Cualquier producto que se venda por área

### Híbrido (`hybrid`)
- ✅ Productos con economías de escala complejas
- ✅ Diferentes precios según tamaño Y cantidad
- ✅ Productos premium con múltiples variables
- ✅ Máxima flexibilidad de pricing

## Próximos Pasos

1. ✅ Configurar precios en productos existentes
2. ✅ Probar diferentes modos de precio
3. ✅ Ajustar multiplicadores según costos reales
4. ✅ Crear plantillas de precios reutilizables
5. ✅ Monitorear conversiones y ajustar precios

## Soporte

Si tienes dudas o necesitas ayuda:
1. Revisa `backend/CONFIGURADOR_PRECIOS.md` para más ejemplos
2. Consulta los tipos en `storefront/src/types/pricing-configurator.ts`
3. Revisa el código del motor en `storefront/src/lib/helpers/pricing-calculator.ts`

¡El sistema está listo para usar! 🎉

