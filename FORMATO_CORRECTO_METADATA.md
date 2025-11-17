# ✅ Formato Correcto de Metadata en Medusa

## Problema Resuelto

Medusa guarda el metadata con puntos en las keys, no como objetos anidados.

## Formato Correcto

### En Medusa Admin, añade estos campos:

#### 1. product_type
```
Key: product_type
Value: custom_sticker
```

#### 2. config.shapes
```
Key: config.shapes
Value: ["contorneado","cuadrado","circular","esquinas_redondeadas"]
```

#### 3. config.materials
```
Key: config.materials
Value: [{"id":"vinilo","name":"Vinilo","priceMultiplier":1.0}]
```

#### 4. config.sizes
```
Key: config.sizes
Value: [{"label":"30x15 cm","width":30,"height":15},{"label":"40x20 cm","width":40,"height":20}]
```

#### 5. config.quantities
```
Key: config.quantities
Value: [{"qty":10,"basePrice":50.00},{"qty":25,"basePrice":110.00},{"qty":50,"basePrice":200.00}]
```

#### 6. config.allowCustomSize
```
Key: config.allowCustomSize
Value: true
```

#### 7. config.minQuantity
```
Key: config.minQuantity
Value: 10
```

#### 8. config.maxWidth (opcional)
```
Key: config.maxWidth
Value: 50
```

#### 9. config.maxHeight (opcional)
```
Key: config.maxHeight
Value: 50
```

## Ejemplo Completo

Para "Pegatinas para el Suelo":

```
product_type: custom_sticker

config.shapes: ["contorneado","cuadrado","circular","esquinas_redondeadas"]

config.materials: [{"id":"vinilo_antideslizante","name":"Vinilo Antideslizante","priceMultiplier":1.0}]

config.sizes: [{"label":"30x15 cm","width":30,"height":15},{"label":"40x20 cm","width":40,"height":20},{"label":"50x25 cm","width":50,"height":25}]

config.quantities: [{"qty":10,"basePrice":50.00},{"qty":25,"basePrice":110.00},{"qty":50,"basePrice":200.00}]

config.allowCustomSize: false

config.minQuantity: 10
```

## Verificar

1. Guarda el producto
2. Recarga: `http://localhost:3000/es/products/pegatinas-suelo`
3. Abre consola (F12)
4. Busca "=== DEBUG CONFIGURADOR ==="
5. Verifica que aparezcan tus configuraciones parseadas

## Resultado Esperado

Deberías ver en el configurador:
- ✅ 4 formas (contorneado, cuadrado, circular, esquinas redondeadas)
- ✅ 1 material (Vinilo Antideslizante)
- ✅ 3 tamaños (30x15, 40x20, 50x25)
- ✅ Tabla de precios con 3 cantidades
- ✅ Opción de tamaño personalizado (si allowCustomSize es true)

¡Ahora debería funcionar! 🎉
