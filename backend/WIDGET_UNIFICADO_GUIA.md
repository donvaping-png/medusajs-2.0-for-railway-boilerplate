# 🎯 Widget Unificado - Guía Completa

## ¿Qué es?

Un widget profesional que combina la configuración de producto Y precios en una sola interfaz con pestañas.

## Características

### ✅ Interfaz con Pestañas
- **Configuración**: Formas, materiales, tamaños, acabados
- **Precios**: 3 modos de precio (Tabla Fija, Por m², Híbrido)

### ✅ Dark Mode
- Diseñado específicamente para Medusa Admin dark theme
- Colores y estilos profesionales

### ✅ Sin Conflictos
- Una sola fuente de verdad
- Metadata estructurada y organizada
- Compatible con el frontend existente

## Estructura de Metadata

```json
{
  "product_type": "custom_sticker",
  
  "config": {
    "shapes": [
      { "id": "contorneado", "name": "Contorneado", "icon": "🔷" }
    ],
    "materials": [
      { "id": "vinilo", "name": "Vinilo", "priceMultiplier": 1.0 }
    ],
    "sizes": [
      { "label": "10x10 cm", "width": 10, "height": 10 }
    ],
    "finishes": [
      { "id": "mate", "name": "Mate" }
    ],
    "allowCustomSize": true,
    "minQuantity": 10,
    "maxWidth": 50,
    "maxHeight": 50
  },
  
  "pricing": {
    "mode": "fixed_table",
    "quantities": [
      { "qty": 10, "basePrice": 50.00 },
      { "qty": 25, "basePrice": 110.00 }
    ],
    "min_quantity": 10
  }
}
```

## Uso

### 1. Activar el Widget

El widget se carga automáticamente en la zona `product.details.after`.

### 2. Configurar un Producto

1. Ve a Products en el Admin
2. Edita o crea un producto
3. Scroll hasta ver "⚙️ Configurador de Producto Completo"
4. Selecciona "Pegatina Personalizable"
5. Usa las pestañas para configurar

### 3. Pestaña Configuración

**Formas:**
- Selecciona las formas disponibles con checkboxes
- Contorneado, Cuadrado, Circular, Esquinas Redondeadas

**Materiales:**
- Añade materiales con ID, nombre y multiplicador de precio
- Ejemplo: Vinilo (×1.0), Holográfico (×1.5)

**Tamaños:**
- Define tamaños predefinidos con label, ancho y alto
- Ejemplo: "10x10 cm", width: 10, height: 10

**Acabados:**
- Opcional: Mate, Brillante, Satinado, etc.

**Opciones:**
- Permitir tamaño personalizado
- Cantidad mínima
- Dimensiones máximas

### 4. Pestaña Precios

**Plantillas Rápidas:**
- 🏢 Pegatinas Suelo: Tabla fija con precios predefinidos
- 📐 Vinilos por m²: Precio calculado por área
- ⭐ Premium Híbrido: Sistema avanzado con tiers

**Modo Tabla Fija:**
```
10 uts = €50.00
25 uts = €110.00
50 uts = €200.00
```

**Modo Por m²:**
```
Precio base: €25/m²
Descuentos por volumen:
- 10+ uts: -5%
- 25+ uts: -10%
- 50+ uts: -15%
```

**Modo Híbrido:**
```
Tiers de tamaño:
- 0-10 m²: €50/m²
- 10-50 m²: €35/m²
- 50+ m²: €20/m²

Multiplicadores:
- 1-49 uts: ×1.0
- 50-99 uts: ×0.9
- 100+ uts: ×0.8
```

## Ventajas vs Widgets Anteriores

| Aspecto | Widgets Antiguos | Widget Unificado |
|---------|------------------|------------------|
| Interfaz | 2 widgets separados | 1 widget con pestañas |
| Precios | Duplicados | Una sola fuente |
| Sincronización | Manual | Automática |
| UX | Confusa | Clara y profesional |
| Dark Mode | Parcial | Completo |
| Mantenimiento | Difícil | Fácil |

## Migración desde Widgets Antiguos

### Opción 1: Automática (Recomendada)

El frontend ya está preparado para leer ambos formatos:

```typescript
// Lee el nuevo formato
const pricing = product.metadata?.pricing

// Fallback al formato antiguo
const legacyPricing = product.metadata?.["config.quantities"]

// Usa el que esté disponible
const finalPricing = pricing || convertLegacyToNew(legacyPricing)
```

### Opción 2: Manual

1. Abre cada producto en el Admin
2. El widget unificado cargará la config existente
3. Haz cualquier cambio menor
4. Guarda
5. La metadata se actualizará al nuevo formato

## Desactivar Widgets Antiguos

Para evitar confusión, puedes comentar los exports de los widgets antiguos:

```typescript
// backend/src/admin/widgets/product-configurator-complete.tsx
// export const config = defineWidgetConfig({ ... })

// backend/src/admin/widgets/product-pricing-configurator.tsx
// export const config = defineWidgetConfig({ ... })
```

O simplemente eliminar los archivos.

## Frontend: Lectura de Metadata

El frontend debe priorizar el nuevo formato:

```typescript
// 1. Leer config
const config = product.metadata?.config 
  ? JSON.parse(product.metadata.config)
  : {
      shapes: product.metadata?.["config.shapes"] || [],
      materials: product.metadata?.["config.materials"] || [],
      // ... resto de campos
    }

// 2. Leer pricing
const pricing = product.metadata?.pricing
  ? JSON.parse(product.metadata.pricing)
  : {
      mode: 'fixed_table',
      quantities: product.metadata?.["config.quantities"] || []
    }
```

## Troubleshooting

### El widget no aparece
- Verifica que el archivo esté en `backend/src/admin/widgets/`
- Reinicia el servidor del backend
- Limpia la caché del navegador

### Los datos no se guardan
- Verifica la consola del navegador
- Comprueba que el producto tiene ID
- Verifica permisos de API

### Estilos se ven mal
- El widget está diseñado para dark mode
- Si usas light mode, ajusta los colores en `styles`

## Próximos Pasos

1. ✅ Probar el widget en el Admin
2. ✅ Configurar 1-2 productos de prueba
3. ✅ Verificar que el frontend lee correctamente
4. ⏳ Migrar productos existentes
5. ⏳ Desactivar widgets antiguos

## Soporte

- Documentación completa: `ANALISIS_CONFIGURADORES.md`
- Ejemplos de precios: `EJEMPLOS_CONFIGURACION_PRECIOS.md`
- Sistema de precios: `backend/CONFIGURADOR_PRECIOS.md`

¡El widget unificado está listo para usar! 🎉

