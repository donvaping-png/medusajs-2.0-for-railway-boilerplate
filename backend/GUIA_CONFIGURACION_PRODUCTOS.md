# 🎨 Guía Completa: Configurar Productos desde el Backend

## Sistema Implementado

Ahora puedes configurar **TODO** desde el metadata del producto en Medusa:
- ✅ Formas disponibles
- ✅ Materiales permitidos
- ✅ Tamaños específicos
- ✅ Precios por cantidad
- ✅ Tamaño personalizado (sí/no)

## Cómo Crear un Producto Configurable

### Paso 1: Crear Producto en Medusa Admin

```
Title: Pegatinas para el Suelo
Handle: pegatinas-suelo
Description: Pegatinas antideslizantes para suelo
Status: Published
```

### Paso 2: Configurar Variante

```
☐ Manage Inventory    ← DESACTIVADO
☑ Allow Backorder     ← ACTIVADO
Price: 50.00 EUR (precio base, se sobrescribe)
```

### Paso 3: Añadir Metadata

**Campo 1:**
```
Key: product_type
Value: custom_sticker
```

**Campo 2 (JSON):**
```
Key: config
Value: (ver ejemplos abajo)
```

## Ejemplos de Configuración

### Ejemplo 1: Pegatinas para el Suelo
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

### Ejemplo 2: Pegatinas Holográficas
```json
{
  "shapes": ["contorneado", "cuadrado", "circular", "esquinas_redondeadas"],
  "materials": [
    {
      "id": "holografico",
      "name": "Holográfico",
      "priceMultiplier": 1.5
    },
    {
      "id": "holografico_espejo",
      "name": "Holográfico Espejo",
      "priceMultiplier": 1.8
    }
  ],
  "sizes": [
    { "label": "5x5 cm", "width": 5, "height": 5 },
    { "label": "10x10 cm", "width": 10, "height": 10 },
    { "label": "15x15 cm", "width": 15, "height": 15 }
  ],
  "allowCustomSize": true,
  "maxWidth": 30,
  "maxHeight": 30,
  "quantities": [
    { "qty": 50, "basePrice": 30.00 },
    { "qty": 100, "basePrice": 55.00 },
    { "qty": 250, "basePrice": 120.00 },
    { "qty": 500, "basePrice": 220.00 }
  ],
  "minQuantity": 50
}
```

### Ejemplo 3: Pegatinas Transfer (Solo Contorneado)
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
    { "label": "20x20 cm", "width": 20, "height": 20 },
    { "label": "30x30 cm", "width": 30, "height": 30 }
  ],
  "allowCustomSize": true,
  "maxWidth": 50,
  "maxHeight": 50,
  "quantities": [
    { "qty": 25, "basePrice": 20.00 },
    { "qty": 50, "basePrice": 35.00 },
    { "qty": 100, "basePrice": 65.00 }
  ],
  "minQuantity": 25
}
```

### Ejemplo 4: Adhesivas Frontales (Múltiples Materiales)
```json
{
  "shapes": ["cuadrado", "circular"],
  "materials": [
    {
      "id": "vinilo",
      "name": "Vinilo Blanco",
      "priceMultiplier": 1.0
    },
    {
      "id": "vinilo_transparente",
      "name": "Vinilo Transparente",
      "priceMultiplier": 1.1
    },
    {
      "id": "brillante",
      "name": "Brillante",
      "priceMultiplier": 1.3
    }
  ],
  "sizes": [
    { "label": "3x3 cm", "width": 3, "height": 3 },
    { "label": "5x5 cm", "width": 5, "height": 5 },
    { "label": "7x7 cm", "width": 7, "height": 7 }
  ],
  "allowCustomSize": false,
  "quantities": [
    { "qty": 100, "basePrice": 15.00 },
    { "qty": 250, "basePrice": 32.00 },
    { "qty": 500, "basePrice": 58.00 },
    { "qty": 1000, "basePrice": 100.00 }
  ],
  "minQuantity": 100
}
```

## Referencia de Campos

### shapes (array)
Formas disponibles. Valores posibles:
- `"contorneado"` - Corte contorneado
- `"cuadrado"` - Cuadrado
- `"circular"` - Círculo
- `"esquinas_redondeadas"` - Esquinas redondeadas

### materials (array de objetos)
```json
{
  "id": "identificador_unico",
  "name": "Nombre visible",
  "priceMultiplier": 1.0
}
```

### sizes (array de objetos)
```json
{
  "label": "Texto visible",
  "width": 10,
  "height": 10
}
```

### allowCustomSize (boolean)
- `true`: Permite tamaño personalizado
- `false`: Solo tamaños predefinidos

### maxWidth / maxHeight (number, opcional)
Límites para tamaño personalizado

### quantities (array de objetos)
```json
{
  "qty": 50,
  "basePrice": 30.00
}
```

### minQuantity (number)
Cantidad mínima permitida

## Probar el Producto

Después de configurar:
```
http://localhost:3000/es/products/pegatinas-suelo
```

Deberías ver:
- ✅ Solo las formas que configuraste
- ✅ Solo los materiales que configuraste
- ✅ Solo los tamaños que configuraste
- ✅ Precios exactos de tu tabla
- ✅ Tamaño personalizado si lo activaste

## Ventajas

1. **Sin código**: Todo desde el Admin
2. **Flexible**: Cada producto es único
3. **Precios exactos**: No hay cálculos, usas tus precios
4. **Control total**: Decides qué opciones mostrar
5. **Fácil de mantener**: Cambias metadata y listo
