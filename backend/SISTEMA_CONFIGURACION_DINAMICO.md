# 🎨 Sistema de Configuración Dinámico para Pegatinas

## Concepto

Cada producto en Medusa tendrá su configuración completa en el metadata, permitiendo:
- Definir formas disponibles
- Definir materiales permitidos
- Definir tamaños específicos
- Definir precios por cantidad
- Todo desde el Admin de Medusa

## Estructura de Metadata

```json
{
  "product_type": "custom_sticker",
  "config": {
    "shapes": ["contorneado", "cuadrado", "circular", "esquinas_redondeadas"],
    "materials": [
      {
        "id": "vinilo",
        "name": "Vinilo",
        "priceMultiplier": 1.0
      },
      {
        "id": "holografico",
        "name": "Holográfico",
        "priceMultiplier": 1.5
      }
    ],
    "sizes": [
      { "label": "30x15 cm", "width": 30, "height": 15 },
      { "label": "40x20 cm", "width": 40, "height": 20 }
    ],
    "allowCustomSize": false,
    "quantities": [
      { "qty": 50, "basePrice": 25.00 },
      { "qty": 100, "basePrice": 45.00 },
      { "qty": 250, "basePrice": 100.00 }
    ],
    "minQuantity": 50
  }
}
```

## Ejemplos de Productos

### 1. Pegatinas para el Suelo
```json
{
  "title": "Pegatinas para el Suelo",
  "handle": "pegatinas-suelo",
  "metadata": {
    "product_type": "custom_sticker",
    "config": {
      "shapes": ["contorneado", "cuadrado", "circular", "esquinas_redondeadas"],
      "materials": [
        { "id": "vinilo", "name": "Vinilo Antideslizante", "priceMultiplier": 1.0 }
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
        { "qty": 50, "basePrice": 200.00 }
      ]
    }
  }
}
```

### 2. Pegatinas Holográficas
```json
{
  "title": "Pegatinas Holográficas",
  "handle": "pegatinas-holograficas",
  "metadata": {
    "product_type": "custom_sticker",
    "config": {
      "shapes": ["contorneado", "cuadrado", "circular", "esquinas_redondeadas"],
      "materials": [
        { "id": "holografico", "name": "Holográfico", "priceMultiplier": 1.5 }
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
        { "qty": 250, "basePrice": 120.00 }
      ]
    }
  }
}
```

### 3. Pegatinas Transfer
```json
{
  "title": "Pegatinas Transfer",
  "handle": "pegatinas-transfer",
  "metadata": {
    "product_type": "custom_sticker",
    "config": {
      "shapes": ["contorneado"],
      "materials": [
        { "id": "vinilo_transfer", "name": "Vinilo Transfer", "priceMultiplier": 1.2 }
      ],
      "sizes": [
        { "label": "10x10 cm", "width": 10, "height": 10 },
        { "label": "20x20 cm", "width": 20, "height": 20 }
      ],
      "allowCustomSize": true,
      "quantities": [
        { "qty": 25, "basePrice": 20.00 },
        { "qty": 50, "basePrice": 35.00 }
      ]
    }
  }
}
```

## Ventajas

1. ✅ **Totalmente flexible**: Cada producto tiene su propia configuración
2. ✅ **Sin código**: Se configura desde el Admin de Medusa
3. ✅ **Precios específicos**: Cada producto puede tener precios diferentes
4. ✅ **Materiales limitados**: Puedes restringir materiales por tipo
5. ✅ **Tamaños fijos o personalizados**: Configurable por producto
