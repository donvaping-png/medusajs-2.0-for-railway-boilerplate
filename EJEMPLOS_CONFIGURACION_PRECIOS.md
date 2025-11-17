# 📚 Ejemplos de Configuración de Precios

## Ejemplo 1: Pegatinas para Suelo (Tabla Fija)

### Caso de Uso
Pegatinas antideslizantes con precios fijos por cantidad. No se venden por área sino por unidades completas.

### Configuración en Medusa Admin

**Metadata Key:** `pricing`

**Metadata Value:**
```json
{
  "mode": "fixed_table",
  "quantities": [
    { "qty": 10, "basePrice": 50.00 },
    { "qty": 25, "basePrice": 110.00 },
    { "qty": 50, "basePrice": 200.00 },
    { "qty": 100, "basePrice": 350.00 },
    { "qty": 250, "basePrice": 800.00 }
  ],
  "min_quantity": 10
}
```

### Resultados Esperados

| Cantidad | Precio Total | Precio Unitario |
|----------|--------------|-----------------|
| 10       | €50.00       | €5.00           |
| 25       | €110.00      | €4.40           |
| 50       | €200.00      | €4.00           |
| 100      | €350.00      | €3.50           |
| 250      | €800.00      | €3.20           |

### Ventajas
- ✅ Precios exactos y predecibles
- ✅ Fácil de entender para el cliente
- ✅ Control total sobre márgenes

---

## Ejemplo 2: Vinilos Decorativos (Por Metro Cuadrado)

### Caso de Uso
Vinilos que se venden por área, con descuentos por volumen y multiplicadores por forma.

### Configuración en Medusa Admin

**Metadata Key:** `pricing`

**Metadata Value:**
```json
{
  "mode": "per_sqm",
  "base_price_per_sqm": 25.00,
  "min_price": 5.00,
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
    "circular": 1.15,
    "esquinas_redondeadas": 1.05
  }
}
```

### Resultados Esperados

#### Vinilo Cuadrado 10x10 cm (0.01 m²)
| Cantidad | Sin Descuento | Con Descuento | Precio Total |
|----------|---------------|---------------|--------------|
| 1        | €0.25         | €0.25         | €0.25        |
| 10       | €0.25         | €0.24 (-5%)   | €2.38        |
| 25       | €0.25         | €0.23 (-10%)  | €5.63        |
| 50       | €0.25         | €0.21 (-15%)  | €10.63       |
| 100      | €0.25         | €0.20 (-20%)  | €20.00       |

#### Vinilo Contorneado 10x10 cm (×1.3 por forma)
| Cantidad | Sin Descuento | Con Descuento | Precio Total |
|----------|---------------|---------------|--------------|
| 1        | €0.33         | €0.33         | €0.33        |
| 10       | €0.33         | €0.31 (-5%)   | €3.09        |
| 50       | €0.33         | €0.28 (-15%)  | €13.81       |

### Ventajas
- ✅ Precio justo según área real
- ✅ Incentiva compras mayores
- ✅ Refleja costos de producción

---

## Ejemplo 3: Etiquetas Premium (Híbrido)

### Caso de Uso
Etiquetas metalizadas con precios que varían según el tamaño total del pedido Y la cantidad.

### Configuración en Medusa Admin

**Metadata Key:** `pricing`

**Metadata Value:**
```json
{
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
  "min_price": 5.00,
  "shape_multipliers": {
    "contorneado": 1.2,
    "cuadrado": 1.0,
    "circular": 1.1
  }
}
```

### Resultados Esperados

#### Etiqueta 5x5 cm (0.0025 m²) - Tier: €50/m²
| Cantidad | Multiplicador | Precio Unit | Precio Total |
|----------|---------------|-------------|--------------|
| 1        | ×1.0          | €0.13       | €0.13        |
| 50       | ×0.9          | €0.11       | €5.63        |
| 100      | ×0.8          | €0.10       | €10.00       |
| 250      | ×0.7          | €0.09       | €21.88       |
| 500      | ×0.6          | €0.08       | €37.50       |

#### Etiqueta 20x20 cm (0.04 m²) - Tier: €35/m²
| Cantidad | Multiplicador | Precio Unit | Precio Total |
|----------|---------------|-------------|--------------|
| 1        | ×1.0          | €1.40       | €1.40        |
| 50       | ×0.9          | €1.26       | €63.00       |
| 100      | ×0.8          | €1.12       | €112.00      |

### Ventajas
- ✅ Máxima flexibilidad
- ✅ Precios competitivos para grandes pedidos
- ✅ Refleja economías de escala reales

---

## Ejemplo 4: Lonas Publicitarias (Por m² con Material)

### Caso de Uso
Lonas de gran formato con diferentes materiales y precios por m².

### Configuración en Medusa Admin

**Metadata Key:** `pricing`

**Metadata Value:**
```json
{
  "mode": "per_sqm",
  "base_price_per_sqm": 12.00,
  "min_price": 20.00,
  "min_area": 0.5,
  "volume_discounts": [
    { "min_qty": 5, "discount_percent": 10 },
    { "min_qty": 10, "discount_percent": 15 },
    { "min_qty": 20, "discount_percent": 20 }
  ]
}
```

**Metadata Key:** `config`

**Metadata Value:**
```json
{
  "materials": [
    { "id": "lona_standard", "name": "Lona Standard", "priceMultiplier": 1.0 },
    { "id": "lona_premium", "name": "Lona Premium", "priceMultiplier": 1.4 },
    { "id": "lona_mesh", "name": "Lona Mesh", "priceMultiplier": 1.2 }
  ]
}
```

### Resultados Esperados

#### Lona 100x200 cm (2 m²) - Material Standard
| Cantidad | Sin Descuento | Con Descuento | Precio Total |
|----------|---------------|---------------|--------------|
| 1        | €24.00        | €24.00        | €24.00       |
| 5        | €24.00        | €21.60 (-10%) | €108.00      |
| 10       | €24.00        | €20.40 (-15%) | €204.00      |
| 20       | €24.00        | €19.20 (-20%) | €384.00      |

#### Lona 100x200 cm (2 m²) - Material Premium (×1.4)
| Cantidad | Sin Descuento | Con Descuento | Precio Total |
|----------|---------------|---------------|--------------|
| 1        | €33.60        | €33.60        | €33.60       |
| 5        | €33.60        | €30.24 (-10%) | €151.20      |
| 10       | €33.60        | €28.56 (-15%) | €285.60      |

### Ventajas
- ✅ Precio mínimo garantiza rentabilidad
- ✅ Diferentes materiales con multiplicadores
- ✅ Descuentos por volumen

---

## Ejemplo 5: Paquetes Mixtos (Tabla Fija con Materiales)

### Caso de Uso
Paquetes de pegatinas variadas con precios fijos pero diferentes materiales.

### Configuración en Medusa Admin

**Metadata Key:** `pricing`

**Metadata Value:**
```json
{
  "mode": "fixed_table",
  "quantities": [
    { "qty": 25, "basePrice": 15.00 },
    { "qty": 50, "basePrice": 28.00 },
    { "qty": 100, "basePrice": 50.00 },
    { "qty": 250, "basePrice": 110.00 }
  ],
  "min_quantity": 25
}
```

**Metadata Key:** `config`

**Metadata Value:**
```json
{
  "materials": [
    { "id": "vinilo", "name": "Vinilo", "priceMultiplier": 1.0 },
    { "id": "holografico", "name": "Holográfico", "priceMultiplier": 1.5 },
    { "id": "metalizado", "name": "Metalizado", "priceMultiplier": 1.8 }
  ]
}
```

### Resultados Esperados

#### Paquete de 50 unidades
| Material     | Precio Base | Multiplicador | Precio Final |
|--------------|-------------|---------------|--------------|
| Vinilo       | €28.00      | ×1.0          | €28.00       |
| Holográfico  | €28.00      | ×1.5          | €42.00       |
| Metalizado   | €28.00      | ×1.8          | €50.40       |

### Ventajas
- ✅ Precios fijos fáciles de comunicar
- ✅ Multiplicadores por material premium
- ✅ Incentiva compras de paquetes grandes

---

## Comparativa de Modos

| Característica | Tabla Fija | Por m² | Híbrido |
|----------------|------------|--------|---------|
| Complejidad | ⭐ Baja | ⭐⭐ Media | ⭐⭐⭐ Alta |
| Flexibilidad | ⭐⭐ Media | ⭐⭐⭐ Alta | ⭐⭐⭐⭐ Muy Alta |
| Transparencia | ⭐⭐⭐⭐ Muy Alta | ⭐⭐⭐ Alta | ⭐⭐ Media |
| Control Precios | ⭐⭐⭐⭐ Total | ⭐⭐⭐ Alto | ⭐⭐⭐⭐ Total |
| Escalabilidad | ⭐⭐ Media | ⭐⭐⭐⭐ Muy Alta | ⭐⭐⭐⭐ Muy Alta |

## Recomendaciones

### Usa Tabla Fija cuando:
- Los costos de producción son fijos por lote
- Quieres precios simples y predecibles
- Vendes paquetes predefinidos
- No hay variación significativa por tamaño

### Usa Por m² cuando:
- El costo depende directamente del área
- Vendes productos de tamaño variable
- Quieres incentivar compras mayores
- El material es el factor principal de costo

### Usa Híbrido cuando:
- Tienes economías de escala complejas
- El precio varía por tamaño Y cantidad
- Vendes productos premium
- Necesitas máxima flexibilidad

## Consejos de Pricing

1. **Empieza Simple**: Usa tabla fija al principio
2. **Analiza Costos**: Calcula tu costo real por m²
3. **Prueba Descuentos**: Experimenta con diferentes niveles
4. **Monitorea Conversión**: Ajusta según comportamiento
5. **Comunica Valor**: Muestra el ahorro en descuentos

¡Usa estos ejemplos como base y ajústalos a tu negocio! 🚀

