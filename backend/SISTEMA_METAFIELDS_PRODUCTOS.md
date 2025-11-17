# 🎨 Sistema de Metafields para Productos - Tipo Shopify

## Concepto

Sistema que permite definir metafields personalizados para productos, similar a Shopify Metafields, usando el sistema de metadata que ya tienes implementado.

## Ventajas

1. ✅ **Sin editar metadata manualmente**: UI amigable en el Admin
2. ✅ **Definiciones reutilizables**: Define una vez, usa en todos los productos
3. ✅ **Validación automática**: El sistema valida tipos y formatos
4. ✅ **Valores por defecto**: Nuevos productos heredan configuración base
5. ✅ **Tipo Shopify**: Interfaz similar a Shopify Metafields

## Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    ADMIN UI                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Widget: Configurador de Producto                │  │
│  │  - Tipo de producto (select)                     │  │
│  │  - Formas (checkboxes)                           │  │
│  │  - Materiales (JSON editor)                      │  │
│  │  - Tamaños (JSON editor)                         │  │
│  │  - Cantidades/Precios (JSON editor)              │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              META DEFINITIONS (Esquema)                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │  product_type: select                            │  │
│  │  config.shapes: json                             │  │
│  │  config.materials: json                          │  │
│  │  config.sizes: json                              │  │
│  │  config.quantities: json                         │  │
│  │  config.finishes: json                           │  │
│  │  config.allowCustomSize: boolean                 │  │
│  │  config.minQuantity: number                      │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              META VALUES (Datos)                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Producto A:                                     │  │
│  │    config.shapes: ["contorneado", "cuadrado"]   │  │
│  │    config.materials: [{...}]                     │  │
│  │                                                   │  │
│  │  Producto B:                                     │  │
│  │    config.shapes: ["circular"]                   │  │
│  │    config.materials: [{...}]                     │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Implementación

### Paso 1: Ejecutar Script de Seed

```bash
cd backend
npm run seed:product-metafields
```

Esto crea 10 definiciones de metafields:
- `product_type`
- `config.shapes`
- `config.materials`
- `config.sizes`
- `config.quantities`
- `config.finishes`
- `config.allowCustomSize`
- `config.minQuantity`
- `config.maxWidth`
- `config.maxHeight`

### Paso 2: Verificar Definiciones

```bash
curl http://localhost:9000/admin/meta/definitions?scope=product \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Deberías ver las 10 definiciones creadas.

### Paso 3: Usar en el Admin

1. Ve al Admin de Medusa: `http://localhost:9000/app`
2. Edita un producto
3. Verás el widget "Configurador de Producto"
4. Selecciona "Pegatina Personalizable"
5. Configura las opciones
6. Guarda

## Uso Avanzado: API

### Configurar un Producto Completo

```bash
curl -X POST http://localhost:9000/admin/products/{product_id}/meta \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product_type": "custom_sticker",
    "config.shapes": ["contorneado", "cuadrado", "circular"],
    "config.materials": [
      {"id": "vinilo", "name": "Vinilo", "priceMultiplier": 1.0},
      {"id": "holografico", "name": "Holográfico", "priceMultiplier": 1.5}
    ],
    "config.sizes": [
      {"label": "5x5 cm", "width": 5, "height": 5},
      {"label": "10x10 cm", "width": 10, "height": 10}
    ],
    "config.quantities": [
      {"qty": 50, "basePrice": 25.00},
      {"qty": 100, "basePrice": 45.00}
    ],
    "config.finishes": [
      {"id": "mate", "name": "Mate"},
      {"id": "brillante", "name": "Brillante"}
    ],
    "config.allowCustomSize": true,
    "config.minQuantity": 50,
    "config.maxWidth": 30,
    "config.maxHeight": 30
  }'
```

### Obtener Configuración de un Producto

```bash
curl http://localhost:9000/admin/products/{product_id}/meta \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Plantillas Predefinidas

### Plantilla 1: Pegatinas para el Suelo

```json
{
  "product_type": "custom_sticker",
  "config.shapes": ["contorneado", "cuadrado", "circular", "esquinas_redondeadas"],
  "config.materials": [
    {"id": "vinilo_antideslizante", "name": "Vinilo Antideslizante", "priceMultiplier": 1.0}
  ],
  "config.sizes": [
    {"label": "30x15 cm", "width": 30, "height": 15},
    {"label": "40x20 cm", "width": 40, "height": 20}
  ],
  "config.quantities": [
    {"qty": 10, "basePrice": 50.00},
    {"qty": 25, "basePrice": 110.00}
  ],
  "config.allowCustomSize": false,
  "config.minQuantity": 10
}
```

### Plantilla 2: Pegatinas Holográficas

```json
{
  "product_type": "custom_sticker",
  "config.shapes": ["contorneado", "cuadrado", "circular"],
  "config.materials": [
    {"id": "holografico_plata", "name": "Holográfico Plata", "priceMultiplier": 1.5},
    {"id": "holografico_oro", "name": "Holográfico Oro", "priceMultiplier": 1.6}
  ],
  "config.sizes": [
    {"label": "5x5 cm", "width": 5, "height": 5},
    {"label": "10x10 cm", "width": 10, "height": 10}
  ],
  "config.quantities": [
    {"qty": 50, "basePrice": 30.00},
    {"qty": 100, "basePrice": 55.00}
  ],
  "config.finishes": [
    {"id": "lustroso", "name": "Lustroso"},
    {"id": "satinado", "name": "Satinado"}
  ],
  "config.allowCustomSize": true,
  "config.maxWidth": 30,
  "config.maxHeight": 30,
  "config.minQuantity": 50
}
```

## Añadir Nuevos Metafields

Para añadir un nuevo campo (ej: "config.colores"):

```bash
curl -X POST http://localhost:9000/admin/meta/definitions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "scope": "product",
    "key": "config.colores",
    "label": "Colores Disponibles",
    "type": "json",
    "required": false,
    "default_value": null,
    "validations": {
      "description": "Array de objetos: [{\"id\": \"rojo\", \"name\": \"Rojo\", \"hex\": \"#FF0000\"}]"
    }
  }'
```

## Ventajas vs Metadata Manual

| Aspecto | Metadata Manual | Sistema Metafields |
|---------|----------------|-------------------|
| Facilidad | ❌ Editar JSON | ✅ UI amigable |
| Validación | ❌ Manual | ✅ Automática |
| Reutilización | ❌ Copiar/pegar | ✅ Definiciones globales |
| Documentación | ❌ Externa | ✅ En el sistema |
| Valores por defecto | ❌ Manual | ✅ Automático |
| Escalabilidad | ❌ Difícil | ✅ Fácil |

## Próximos Pasos

1. **Ejecutar seed**: `npm run seed:product-metafields`
2. **Verificar en Admin**: Ver los nuevos campos
3. **Configurar productos**: Usar el widget o la API
4. **Crear plantillas**: Guardar configuraciones comunes
5. **Extender**: Añadir más metafields según necesites

## Archivos Creados

- `backend/src/scripts/seed-product-configurator-metafields.ts` - Script de seed
- `backend/src/admin/widgets/product-configurator-widget.tsx` - Widget del Admin
- `backend/SISTEMA_METAFIELDS_PRODUCTOS.md` - Esta guía

¡El sistema está listo para usar! 🎉
