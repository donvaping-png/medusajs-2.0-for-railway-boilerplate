# ✅ Tareas de Integración del Configurador de Precios

## Estado: Sistema Creado - Pendiente de Integración

## Archivos Creados ✅

### Backend
- [x] `backend/CONFIGURADOR_PRECIOS.md` - Documentación completa
- [x] `backend/src/admin/widgets/product-pricing-configurator.tsx` - Widget del Admin

### Frontend
- [x] `storefront/src/types/pricing-configurator.ts` - Tipos TypeScript
- [x] `storefront/src/lib/helpers/pricing-calculator.ts` - Motor de cálculo
- [x] `storefront/src/hooks/usePricingCalculator.ts` - Hook React
- [x] `storefront/src/components/molecules/PriceBreakdown/` - Componente UI

### Documentación
- [x] `GUIA_INTEGRACION_PRECIOS.md` - Guía paso a paso
- [x] `EJEMPLOS_CONFIGURACION_PRECIOS.md` - Ejemplos prácticos
- [x] `CONFIGURADOR_PRECIOS_RESUMEN.md` - Resumen ejecutivo
- [x] `TAREAS_INTEGRACION_PRECIOS.md` - Este archivo

## Tareas Pendientes

### Fase 1: Configuración Backend (30 min)

#### 1.1 Registrar Widget en el Admin
- [ ] Verificar que el widget aparece en el Admin de Medusa
- [ ] Si no aparece, añadir al archivo de configuración de widgets
- [ ] Probar que se puede guardar metadata de pricing

**Archivo a revisar:**
```typescript
// backend/src/admin/routes.tsx o similar
// Asegurarse de que los widgets se cargan correctamente
```

#### 1.2 Probar Plantillas
- [ ] Abrir Admin: `http://localhost:9000/app`
- [ ] Editar un producto de prueba
- [ ] Probar plantilla "Pegatinas Suelo"
- [ ] Probar plantilla "Vinilos por m²"
- [ ] Probar plantilla "Premium Híbrido"
- [ ] Verificar que se guarda en metadata

#### 1.3 Configurar Productos Existentes
- [ ] Listar todos los productos configurables
- [ ] Decidir qué modo de precio usar para cada uno
- [ ] Configurar pricing metadata en cada producto

### Fase 2: Integración Frontend (1-2 horas)

#### 2.1 Actualizar Hook del Configurador
- [ ] Abrir `storefront/src/hooks/useStickerConfigurator.ts`
- [ ] Añadir parámetro `pricingConfig`
- [ ] Importar y usar `usePricingCalculator`
- [ ] Retornar objeto `pricing` en el return

**Código a añadir:**
```typescript
import { usePricingCalculator } from '@/hooks/usePricingCalculator'
import type { PricingConfig } from '@/types/pricing-configurator'

interface UseStickerConfiguratorProps {
  subcategoryConfig: SubcategoryConfig
  categorySlug: string
  pricingConfig?: PricingConfig // ← Añadir
}

export function useStickerConfigurator({
  subcategoryConfig,
  categorySlug,
  pricingConfig, // ← Añadir
}: UseStickerConfiguratorProps) {
  // ... código existente ...

  // Obtener material actual
  const material = subcategoryConfig.allowedMaterials.find(
    (m) => m.id === config.material
  )
  const materialMultiplier = material?.priceMultiplier || 1.0

  // Usar el nuevo sistema de precios
  const pricing = pricingConfig ? usePricingCalculator({
    pricingConfig,
    width: currentDimensions.width,
    height: currentDimensions.height,
    quantity: config.quantity,
    materialMultiplier,
    shape: config.shape,
    finish: config.finish,
  }) : null

  return {
    config,
    updateField,
    updateSize,
    updateImage,
    clearImage,
    pricing, // ← Añadir
    currentDimensions,
    validation,
  }
}
```

#### 2.2 Actualizar Componente del Configurador
- [ ] Abrir `storefront/src/components/organisms/StickerConfigurator/StickerConfigurator.tsx`
- [ ] Obtener `pricingConfig` del metadata del producto
- [ ] Pasar `pricingConfig` al hook
- [ ] Importar componente `PriceBreakdown`
- [ ] Añadir `PriceBreakdown` al render
- [ ] Actualizar botón de añadir al carrito con precio dinámico

**Código a añadir:**
```typescript
import { PriceBreakdown } from '@/components/molecules/PriceBreakdown'

export function StickerConfigurator({ product, subcategoryConfig }: Props) {
  // Obtener pricing config del producto
  const pricingConfig = product.metadata?.pricing
    ? (typeof product.metadata.pricing === 'string' 
        ? JSON.parse(product.metadata.pricing)
        : product.metadata.pricing)
    : null

  const {
    config,
    updateField,
    updateSize,
    updateImage,
    clearImage,
    pricing, // ← Usar
    currentDimensions,
    validation,
  } = useStickerConfigurator({
    subcategoryConfig,
    categorySlug: product.metadata?.category || 'pegatinas',
    pricingConfig, // ← Pasar
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Configuración */}
      <div>
        {/* ... campos existentes ... */}
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

#### 2.3 Actualizar Función de Añadir al Carrito
- [ ] Abrir `storefront/src/lib/helpers/sticker-cart.ts`
- [ ] Actualizar `addCustomStickerToCart` para recibir `pricingResult`
- [ ] Usar `pricingResult.unitPrice` en lugar del precio calculado localmente
- [ ] Guardar `pricingResult.breakdown` en metadata del item

**Código a actualizar:**
```typescript
import type { PriceCalculationResult } from '@/types/pricing-configurator'

export async function addCustomStickerToCart(
  payload: AddToCartPayload,
  pricingResult?: PriceCalculationResult // ← Añadir
): Promise<{ success: boolean; message: string; cartId?: string }> {
  try {
    const response = await fetch('/api/cart/line-items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        variant_id: payload.productId,
        quantity: payload.quantity,
        unit_price: pricingResult?.unitPrice || payload.unitPrice, // ← Usar precio calculado
        metadata: {
          ...payload.metadata,
          pricing_breakdown: pricingResult?.breakdown, // ← Guardar desglose
        },
      }),
    })

    // ... resto del código ...
  }
}
```

#### 2.4 Actualizar Llamada en el Configurador
- [ ] En `StickerConfigurator.tsx`, actualizar `handleAddToCart`
- [ ] Pasar `pricing.result` a `addCustomStickerToCart`

**Código a actualizar:**
```typescript
const handleAddToCart = async () => {
  if (!validation.isValid) return

  const payload: AddToCartPayload = {
    productId: product.id,
    quantity: config.quantity,
    unitPrice: pricing?.result.unitPrice || 0,
    metadata: {
      configurationType: 'custom_sticker',
      category: config.categorySlug,
      subcategory: config.subcategorySlug,
      type: config.type,
      shape: config.shape,
      material: config.material,
      finish: config.finish,
      width: currentDimensions.width,
      height: currentDimensions.height,
      customQuantity: config.quantity,
      imageUrl: config.image?.url,
    },
  }

  const result = await addCustomStickerToCart(payload, pricing?.result) // ← Pasar pricing
  
  if (result.success) {
    // Mostrar mensaje de éxito
  }
}
```

### Fase 3: Testing (30 min)

#### 3.1 Pruebas de Tabla Fija
- [ ] Configurar un producto con modo `fixed_table`
- [ ] Probar diferentes cantidades
- [ ] Verificar que el precio coincide con la tabla
- [ ] Verificar que el multiplicador de material funciona

#### 3.2 Pruebas de Por m²
- [ ] Configurar un producto con modo `per_sqm`
- [ ] Probar diferentes tamaños
- [ ] Probar diferentes cantidades
- [ ] Verificar que los descuentos se aplican correctamente
- [ ] Verificar multiplicadores de forma

#### 3.3 Pruebas de Híbrido
- [ ] Configurar un producto con modo `hybrid`
- [ ] Probar diferentes combinaciones de tamaño y cantidad
- [ ] Verificar que los tiers se aplican correctamente
- [ ] Verificar que los multiplicadores funcionan

#### 3.4 Pruebas de UI
- [ ] Verificar que el desglose se muestra correctamente
- [ ] Verificar que los descuentos se muestran
- [ ] Verificar que el ahorro se calcula bien
- [ ] Verificar que el "próximo descuento" aparece cuando corresponde

#### 3.5 Pruebas de Carrito
- [ ] Añadir producto al carrito
- [ ] Verificar que el precio es correcto
- [ ] Verificar que el metadata se guarda
- [ ] Verificar que el checkout funciona

### Fase 4: Optimización (Opcional)

#### 4.1 Fallback para Productos Sin Pricing
- [ ] Añadir lógica para usar el sistema antiguo si no hay `pricingConfig`
- [ ] Mostrar mensaje en Admin para productos sin configurar

#### 4.2 Caché de Cálculos
- [ ] Implementar memoización adicional si es necesario
- [ ] Optimizar renders del componente

#### 4.3 Validaciones
- [ ] Añadir validaciones de pricing config en el backend
- [ ] Añadir mensajes de error claros

### Fase 5: Documentación y Capacitación

#### 5.1 Documentación Interna
- [ ] Crear guía para el equipo
- [ ] Documentar casos de uso específicos del negocio
- [ ] Crear plantillas personalizadas

#### 5.2 Capacitación
- [ ] Entrenar al equipo en el uso del Admin
- [ ] Explicar los diferentes modos de precio
- [ ] Mostrar cómo ajustar precios

## Checklist de Verificación Final

### Backend
- [ ] Widget aparece en el Admin
- [ ] Se pueden guardar configuraciones
- [ ] Las plantillas funcionan
- [ ] Todos los productos tienen pricing configurado

### Frontend
- [ ] Hook actualizado y funcionando
- [ ] Componente actualizado y renderiza correctamente
- [ ] PriceBreakdown se muestra bien
- [ ] Precios se calculan correctamente
- [ ] Carrito funciona con nuevos precios

### Testing
- [ ] Todos los modos de precio probados
- [ ] Multiplicadores funcionan
- [ ] Descuentos se aplican correctamente
- [ ] UI es clara y comprensible
- [ ] No hay errores en consola

### Producción
- [ ] Código revisado
- [ ] Tests pasando
- [ ] Documentación completa
- [ ] Equipo capacitado
- [ ] Listo para deploy

## Notas Importantes

### Compatibilidad con Sistema Actual
El nuevo sistema es **100% compatible** con el sistema actual. Si un producto no tiene `pricingConfig`, puedes:
1. Usar el cálculo antiguo como fallback
2. Configurar gradualmente los productos
3. Mantener ambos sistemas en paralelo

### Migración Gradual
No necesitas migrar todos los productos a la vez:
1. Empieza con 1-2 productos de prueba
2. Verifica que funciona correctamente
3. Migra el resto gradualmente
4. Mantén el sistema antiguo como fallback

### Rollback
Si algo falla, es fácil volver atrás:
1. El sistema antiguo sigue funcionando
2. Solo necesitas no pasar `pricingConfig` al hook
3. Los productos sin pricing usan el cálculo antiguo

## Tiempo Estimado Total

- **Fase 1 (Backend)**: 30 minutos
- **Fase 2 (Frontend)**: 1-2 horas
- **Fase 3 (Testing)**: 30 minutos
- **Fase 4 (Optimización)**: Opcional
- **Fase 5 (Documentación)**: 30 minutos

**Total**: 2.5 - 3.5 horas

## Próximo Paso Inmediato

1. **Abrir el Admin**: `http://localhost:9000/app`
2. **Editar un producto de prueba**
3. **Buscar el widget "💰 Configurador de Precios"**
4. **Probar una plantilla**
5. **Verificar que se guarda**

¡Empieza por ahí y luego continúa con las demás tareas! 🚀

