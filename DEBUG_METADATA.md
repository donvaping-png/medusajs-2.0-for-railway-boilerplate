# 🔍 Debug: Metadata no se Muestra

## Problema

Las opciones configuradas en metadata no aparecen en el configurador.

## Causa Probable

El metadata no se está guardando correctamente en Medusa o no se está parseando como JSON.

## Solución: Verificar Metadata

### Paso 1: Ver el Metadata del Producto

Abre la consola del navegador (F12) y ejecuta:

```javascript
// En la página del producto
console.log(window.__NEXT_DATA__.props.pageProps)
```

O añade esto temporalmente al código para ver qué llega:

```typescript
console.log("Product metadata:", prod.metadata)
console.log("Product config:", prod.metadata?.config)
```

### Paso 2: Formato Correcto del Metadata

En Medusa Admin, el metadata debe ser **un objeto JSON**, no un string.

#### ❌ INCORRECTO (como string):
```
Key: config
Value: "{"shapes":["contorneado"]}"
```

#### ✅ CORRECTO (como objeto):

**Opción A: En Medusa v2, añadir campo por campo**

```
Key: config.shapes
Value: ["contorneado", "cuadrado", "circular"]

Key: config.materials
Value: [{"id":"vinilo","name":"Vinilo","priceMultiplier":1.0}]

Key: config.sizes
Value: [{"label":"30x15 cm","width":30,"height":15}]

Key: config.quantities
Value: [{"qty":10,"basePrice":50.00}]

Key: config.allowCustomSize
Value: false

Key: config.minQuantity
Value: 10
```

**Opción B: Si Medusa permite JSON directo**

```
Key: config
Value: (pegar el JSON sin comillas)
{
  "shapes": ["contorneado", "cuadrado", "circular"],
  "materials": [
    {"id": "vinilo", "name": "Vinilo", "priceMultiplier": 1.0}
  ],
  "sizes": [
    {"label": "30x15 cm", "width": 30, "height": 15}
  ],
  "quantities": [
    {"qty": 10, "basePrice": 50.00}
  ],
  "allowCustomSize": false,
  "minQuantity": 10
}
```

### Paso 3: Verificar en la API

Prueba la API directamente:

```bash
curl http://localhost:9000/store/products/tu-handle
```

Busca en la respuesta el campo `metadata` y verifica que tenga `config`.

## Solución Alternativa: Usar API

Si el Admin no permite JSON complejo, usa la API:

```bash
curl -X POST http://localhost:9000/admin/products/{product_id} \
  -H "Authorization: Bearer {tu_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "metadata": {
      "product_type": "custom_sticker",
      "config": {
        "shapes": ["contorneado", "cuadrado", "circular"],
        "materials": [
          {"id": "vinilo", "name": "Vinilo", "priceMultiplier": 1.0}
        ],
        "sizes": [
          {"label": "30x15 cm", "width": 30, "height": 15}
        ],
        "quantities": [
          {"qty": 10, "basePrice": 50.00}
        ],
        "allowCustomSize": false,
        "minQuantity": 10
      }
    }
  }'
```

## Verificar que Funciona

1. Guarda el producto
2. Recarga la página del producto
3. Abre la consola (F12)
4. Deberías ver logs con la configuración
5. El configurador debe mostrar las opciones

## Si Aún No Funciona

Añade esto temporalmente al archivo `ProductDetailsPage.tsx`:

```typescript
// Después de la línea: const productConfig = prod.metadata?.config as any

console.log("=== DEBUG METADATA ===")
console.log("Full metadata:", prod.metadata)
console.log("Product config:", productConfig)
console.log("Shapes:", productConfig?.shapes)
console.log("Materials:", productConfig?.materials)
console.log("Sizes:", productConfig?.sizes)
console.log("Quantities:", productConfig?.quantities)
console.log("======================")
```

Esto te mostrará exactamente qué está llegando.
