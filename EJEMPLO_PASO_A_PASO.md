# 📝 Ejemplo Paso a Paso: Crear Pegatinas para el Suelo

## Paso 1: Crear Producto en Medusa Admin

1. Ve a: `http://localhost:9000/app`
2. Click en **Products** → **Add Product**

## Paso 2: Información Básica

```
Title: Pegatinas para el Suelo
Handle: pegatinas-suelo
Description: Pegatinas antideslizantes de alta resistencia para suelo
Status: Published
```

## Paso 3: Configurar Variante

```
Title: Configuración Personalizada
SKU: STICKER-FLOOR
☐ Manage Inventory    ← DESACTIVADO
☑ Allow Backorder     ← ACTIVADO
Price: 50.00 EUR
```

## Paso 4: Añadir Metadata

### Metadata 1:
```
Key: product_type
Value: custom_sticker
```

### Metadata 2:
```
Key: config
Value: (copiar el JSON de abajo)
```

```json
{
  "shapes": ["contorneado", "cuadrado", "circular", "esquinas_redondeadas"],
  "materials": [
    {
      "id": "vinilo_antideslizante",
      "name": "Vinilo Antideslizante",
      "priceMultiplier": 1.0
    }
  ],
  "sizes": [
    { "label": "30x15 cm", "width": 30, "height": 15 },
    { "label": "40x20 cm", "width": 40, "height": 20 },
    { "label": "50x25 cm", "width": 50, "height": 25 }
  ],
  "allowCustomSize": false,
  "quantities": [
    { "qty": 10, "basePrice": 50.00 },
    { "qty": 25, "basePrice": 110.00 },
    { "qty": 50, "basePrice": 200.00 },
    { "qty": 100, "basePrice": 350.00 }
  ],
  "minQuantity": 10
}
```

## Paso 5: Guardar

Click en **Save** o **Publish**

## Paso 6: Probar

Ve a: `http://localhost:3000/es/products/pegatinas-suelo`

### Deberías Ver:

**Formas:**
- ☑ Corte contorneado
- ☑ Cuadrado
- ☑ Circular
- ☑ Esquinas redondeadas

**Materiales:**
- ☑ Vinilo Antideslizante (único)

**Tamaños:**
- ☑ 30x15 cm
- ☑ 40x20 cm
- ☑ 50x25 cm
- ☐ Tamaño personalizado (desactivado)

**Cantidades y Precios:**
| Cantidad | Precio |
|----------|--------|
| 10 uts   | €50.00 |
| 25 uts   | €110.00|
| 50 uts   | €200.00|
| 100 uts  | €350.00|

## Más Ejemplos

### Pegatinas Holográficas (Múltiples Materiales)

```json
{
  "shapes": ["contorneado", "cuadrado", "circular"],
  "materials": [
    {
      "id": "holografico_plata",
      "name": "Holográfico Plata",
      "priceMultiplier": 1.5
    },
    {
      "id": "holografico_oro",
      "name": "Holográfico Oro",
      "priceMultiplier": 1.6
    },
    {
      "id": "holografico_espejo",
      "name": "Holográfico Espejo",
      "priceMultiplier": 1.8
    }
  ],
  "sizes": [
    { "label": "5x5 cm", "width": 5, "height": 5 },
    { "label": "10x10 cm", "width": 10, "height": 10 }
  ],
  "allowCustomSize": true,
  "maxWidth": 30,
  "maxHeight": 30,
  "quantities": [
    { "qty": 50, "basePrice": 30.00 },
    { "qty": 100, "basePrice": 55.00 },
    { "qty": 250, "basePrice": 120.00 }
  ],
  "minQuantity": 50
}
```

### Pegatinas Transfer (Solo Contorneado)

```json
{
  "shapes": ["contorneado"],
  "materials": [
    {
      "id": "vinilo_transfer",
      "name": "Vinilo Transfer",
      "priceMultiplier": 1.2
    }
  ],
  "sizes": [
    { "label": "10x10 cm", "width": 10, "height": 10 },
    { "label": "20x20 cm", "width": 20, "height": 20 }
  ],
  "allowCustomSize": true,
  "quantities": [
    { "qty": 25, "basePrice": 20.00 },
    { "qty": 50, "basePrice": 35.00 }
  ],
  "minQuantity": 25
}
```

¡Listo! Ahora puedes crear cualquier tipo de pegatina con su propia configuración. 🎨
