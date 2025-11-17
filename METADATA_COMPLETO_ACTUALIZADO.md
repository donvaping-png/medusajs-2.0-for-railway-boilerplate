# 📝 Metadata Completo - Todas las Opciones

## Campos Disponibles

Todos los campos son opcionales excepto los marcados con ⭐

### 1. product_type ⭐
```
Key: product_type
Value: custom_sticker
```

### 2. config.shapes ⭐
```
Key: config.shapes
Value: ["contorneado","cuadrado","circular","esquinas_redondeadas"]
```

Valores posibles:
- `contorneado` - Corte contorneado
- `cuadrado` - Cuadrado
- `circular` - Círculo
- `esquinas_redondeadas` - Esquinas redondeadas

### 3. config.materials ⭐
```
Key: config.materials
Value: [{"id":"vinilo","name":"Vinilo","priceMultiplier":1.0}]
```

Estructura:
```json
[
  {
    "id": "identificador_unico",
    "name": "Nombre visible",
    "priceMultiplier": 1.0
  }
]
```

### 4. config.sizes ⭐
```
Key: config.sizes
Value: [{"label":"30x15 cm","width":30,"height":15}]
```

Estructura:
```json
[
  {
    "label": "Texto visible",
    "width": 30,
    "height": 15
  }
]
```

### 5. config.quantities ⭐
```
Key: config.quantities
Value: [{"qty":10,"basePrice":50.00}]
```

Estructura:
```json
[
  {
    "qty": 10,
    "basePrice": 50.00
  }
]
```

### 6. config.finishes (Opcional)
```
Key: config.finishes
Value: [{"id":"lustroso","name":"Lustroso"},{"id":"satinado","name":"Satinado"}]
```

Estructura:
```json
[
  {
    "id": "identificador",
    "name": "Nombre visible"
  }
]
```

**Si no se incluye:** No aparecerá la sección de Acabado

### 7. config.allowCustomSize (Opcional)
```
Key: config.allowCustomSize
Value: true
```

**Si es `true`:** Muestra campos para ancho y alto personalizados
**Si es `false` o no existe:** Solo tamaños predefinidos

### 8. config.minQuantity (Opcional)
```
Key: config.minQuantity
Value: 10
```

**Default:** 10

### 9. config.maxWidth (Opcional)
```
Key: config.maxWidth
Value: 50
```

Solo aplica si `allowCustomSize` es `true`

### 10. config.maxHeight (Opcional)
```
Key: config.maxHeight
Value: 50
```

Solo aplica si `allowCustomSize` es `true`

## Ejemplo Completo: Pegatinas para el Suelo

```
product_type: custom_sticker

config.shapes: ["contorneado","cuadrado","circular","esquinas_redondeadas"]

config.materials: [{"id":"vinilo_antideslizante","name":"Vinilo Antideslizante","priceMultiplier":1.0}]

config.sizes: [{"label":"30x15 cm","width":30,"height":15},{"label":"40x20 cm","width":40,"height":20},{"label":"50x25 cm","width":50,"height":25}]

config.quantities: [{"qty":10,"basePrice":50.00},{"qty":25,"basePrice":110.00},{"qty":50,"basePrice":200.00}]

config.finishes: [{"id":"mate","name":"Mate"},{"id":"brillante","name":"Brillante"}]

config.allowCustomSize: false

config.minQuantity: 10
```

## Ejemplo: Pegatinas Holográficas (Con Acabados)

```
product_type: custom_sticker

config.shapes: ["contorneado","cuadrado","circular"]

config.materials: [{"id":"holografico_plata","name":"Holográfico Plata","priceMultiplier":1.5},{"id":"holografico_oro","name":"Holográfico Oro","priceMultiplier":1.6}]

config.sizes: [{"label":"5x5 cm","width":5,"height":5},{"label":"10x10 cm","width":10,"height":10}]

config.quantities: [{"qty":50,"basePrice":30.00},{"qty":100,"basePrice":55.00}]

config.finishes: [{"id":"lustroso","name":"Lustroso"},{"id":"satinado","name":"Satinado"}]

config.allowCustomSize: true

config.maxWidth: 30

config.maxHeight: 30

config.minQuantity: 50
```

## Ejemplo: Pegatinas Transfer (Sin Acabados)

```
product_type: custom_sticker

config.shapes: ["contorneado"]

config.materials: [{"id":"vinilo_transfer","name":"Vinilo Transfer","priceMultiplier":1.2}]

config.sizes: [{"label":"10x10 cm","width":10,"height":10},{"label":"20x20 cm","width":20,"height":20}]

config.quantities: [{"qty":25,"basePrice":20.00},{"qty":50,"basePrice":35.00}]

config.allowCustomSize: true

config.minQuantity: 25
```

**Nota:** No tiene `config.finishes`, por lo que no aparecerá la sección de Acabado.

## Secciones que se Ocultan Automáticamente

- **Producto (Tipo):** Se oculta si solo hay 1 tipo
- **Acabado:** Se oculta si no hay `config.finishes` o está vacío
- **Tamaño Personalizado:** Se oculta si `allowCustomSize` es `false`

## Resultado

El configurador mostrará **solo** las opciones que configures en el metadata. No hay opciones hardcodeadas.
