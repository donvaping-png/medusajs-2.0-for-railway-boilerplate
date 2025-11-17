# 💰 Configurador de Precios - Sistema Avanzado

## Concepto

Sistema de gestión de precios flexible que permite configurar precios de múltiples formas:
- **Precio por m²**: Ideal para productos que se venden por área
- **Tablas de precios**: Precios fijos por cantidad
- **Multiplicadores**: Ajustes por material, acabado, forma
- **Descuentos por volumen**: Automáticos según cantidad
- **Precios mínimos**: Garantiza rentabilidad

## Tipos de Configuración de Precios

### 1. Precio Fijo por Cantidad (Actual)
```json
{
  "pricing_mode": "fixed_table",
  "quantities": [
    { "qty": 10, "basePrice": 50.00 },
    { "qty": 25, "basePrice": 110.00 },
    { "qty": 50, "basePrice": 200.00 }
  ]
}
```

### 2. Precio por Metro Cuadrado
```json
{
  "pricing_mode": "per_sqm",
  "base_price_per_sqm": 15.00,
  "min_price": 10.00,
  "volume_discounts": [
    { "min_qty": 50, "discount_percent": 5 },
    { "min_qty": 100, "discount_percent": 10 },
    { "min_qty": 250, "discount_percent": 15 }
  ]
}
```

### 3. Precio Híbrido (Tabla + m²)
```json
{
  "pricing_mode": "hybrid",
  "base_price_per_sqm": 15.00,
  "size_tiers": [
    { "max_area": 25, "price_per_sqm": 20.00 },
    { "max_area": 100, "price_per_sqm": 15.00 },
    { "max_area": 500, "price_per_sqm": 12.00 },
    { "max_area": null, "price_per_sqm": 10.00 }
  ],
  "quantity_multipliers": [
    { "min_qty": 1, "multiplier": 1.0 },
    { "min_qty": 50, "multiplier": 0.9 },
    { "min_qty": 100, "multiplier": 0.85 },
    { "min_qty": 250, "multiplier": 0.75 }
  ]
}
```

## Multiplicadores

### Por Material
```json
{
  "materials": [
    { "id": "vinilo", "name": "Vinilo", "priceMultiplier": 1.0 },
    { "id": "holografico", "name": "Holográfico", "priceMultiplier": 1.5 },
    { "id": "metalizado", "name": "Metalizado", "priceMultiplier": 1.8 }
  ]
}
```

### Por Forma
```json
{
  "shape_multipliers": {
    "contorneado": 1.2,
    "cuadrado": 1.0,
    "circular": 1.1,
    "esquinas_redondeadas": 1.05
  }
}
```

### Por Acabado
```json
{
  "finish_multipliers": {
    "mate": 1.0,
    "brillante": 1.1,
    "satinado": 1.05
  }
}
```

## Ejemplos Completos

### Ejemplo 1: Pegatinas para Suelo (Precio Fijo)
```json
{
  "product_type": "custom_sticker",
  "pricing": {
    "mode": "fixed_table",
    "quantities": [
      { "qty": 10, "basePrice": 50.00 },
      { "qty": 25, "basePrice": 110.00 },
      { "qty": 50, "basePrice": 200.00 },
      { "qty": 100, "basePrice": 350.00 }
    ],
    "min_quantity": 10
  },
  "config": {
    "shapes": ["contorneado", "cuadrado", "circular"],
    "materials": [
      { "id": "vinilo_antideslizante", "name": "Vinilo Antideslizante", "priceMultiplier": 1.0 }
    ],
    "sizes": [
      { "label": "30x15 cm", "width": 30, "height": 15 },
      { "label": "40x20 cm", "width": 40, "height": 20 }
    ],
    "allowCustomSize": false
  }
}
```

### Ejemplo 2: Vinilos Decorativos (Precio por m²)
```json
{
  "product_type": "custom_sticker",
  "pricing": {
    "mode": "per_sqm",
    "base_price_per_sqm": 25.00,
    "min_price": 15.00,
    "min_area": 0.01,
    "volume_discounts": [
      { "min_qty": 10, "discount_percent": 5 },
      { "min_qty": 25, "discount_percent": 10 },
      { "min_qty": 50, "discount_percent": 15 },
      { "min_qty": 100, "discount_percent": 20 }
    ],
    "shape_multipliers": {
      "contorneado": 1.3,
      "cuadrado": 1.0,
      "circular": 1.15
    }
  },
  "config": {
    "shapes": ["contorneado", "cuadrado", "circular"],
    "materials": [
      { "id": "vinilo_blanco", "name": "Vinilo Blanco", "priceMultiplier": 1.0 },
      { "id": "vinilo_transparente", "name": "Vinilo Transparente", "priceMultiplier": 1.2 }
    ],
    "allowCustomSize": true,
    "maxWidth": 200,
    "maxHeight": 200,
    "minQuantity": 1
  }
}
```

### Ejemplo 3: Etiquetas Premium (Híbrido)
```json
{
  "product_type": "custom_sticker",
  "pricing": {
    "mode": "hybrid",
    "base_price_per_sqm": 30.00,
    "size_tiers": [
      { "max_area": 10, "price_per_sqm": 50.00 },
      { "max_area": 50, "price_per_sqm": 35.00 },
      { "max_area": 100, "price_per_sqm": 25.00 },
      { "max_area": null, "price_per_sqm": 20.00 }
    ],
    "quantity_multipliers": [
      { "min_qty": 1, "multiplier": 1.0 },
      { "min_qty": 50, "multiplier": 0.9 },
      { "min_qty": 100, "multiplier": 0.8 },
      { "min_qty": 250, "multiplier": 0.7 },
      { "min_qty": 500, "multiplier": 0.6 }
    ],
    "min_price": 5.00
  },
  "config": {
    "shapes": ["contorneado", "cuadrado", "circular"],
    "materials": [
      { "id": "metalizado_oro", "name": "Metalizado Oro", "priceMultiplier": 1.8 },
      { "id": "metalizado_plata", "name": "Metalizado Plata", "priceMultiplier": 1.6 }
    ],
    "sizes": [
      { "label": "3x3 cm", "width": 3, "height": 3 },
      { "label": "5x5 cm", "width": 5, "height": 5 }
    ],
    "allowCustomSize": true,
    "maxWidth": 20,
    "maxHeight": 20,
    "minQuantity": 50
  }
}
```

## Cálculo de Precios

### Modo: fixed_table
```
1. Buscar en la tabla la cantidad exacta o la más cercana
2. Aplicar multiplicador de material
3. Precio final = basePrice × materialMultiplier
```

### Modo: per_sqm
```
1. Calcular área: width × height / 10000 (cm² a m²)
2. Precio base = área × base_price_per_sqm
3. Aplicar multiplicador de forma
4. Aplicar multiplicador de material
5. Aplicar descuento por volumen
6. Precio unitario = max(precio_calculado, min_price)
7. Precio total = precio_unitario × quantity
```

### Modo: hybrid
```
1. Calcular área: width × height / 10000
2. Determinar tier de tamaño
3. Precio base = área × price_per_sqm_del_tier
4. Aplicar multiplicador de cantidad
5. Aplicar multiplicador de material
6. Aplicar multiplicador de forma
7. Precio unitario = max(precio_calculado, min_price)
8. Precio total = precio_unitario × quantity
```

## Ventajas del Sistema

1. **Flexibilidad Total**: Cada producto puede usar el modo que mejor se adapte
2. **Precios Justos**: El precio por m² refleja el costo real de producción
3. **Incentivos**: Descuentos automáticos por volumen
4. **Rentabilidad**: Precios mínimos garantizan margen
5. **Transparencia**: El cliente ve cómo se calcula el precio
6. **Escalable**: Fácil añadir nuevos modos de precio

## Próximos Pasos

1. Implementar el widget de configuración de precios en el Admin
2. Crear funciones de cálculo en el frontend
3. Actualizar el configurador para mostrar precios dinámicos
4. Añadir visualización de descuentos aplicados
5. Crear plantillas de precios reutilizables

