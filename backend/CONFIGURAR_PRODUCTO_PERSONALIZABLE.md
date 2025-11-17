# 🎨 Configurar Producto Personalizable en Medusa

## ✅ Ahora el Configurador Aparece en la Página de Producto

He modificado el sistema para que el configurador aparezca automáticamente en la página de producto cuando detecta que es un producto personalizable.

## Cómo Configurar el Producto

### 1. Información Básica

```
Title: Pegatinas Holográficas Personalizadas
Handle: custom-sticker-pegatinas-holograficas
Description: Pegatinas con efecto holográfico brillante y llamativo
Status: Published
```

### 2. Variante

```
Title: Configuración Personalizada
SKU: CUSTOM-STICKER-HOLO
☐ Manage Inventory    ← DESACTIVADO
☑ Allow Backorder     ← ACTIVADO
Price: 10.00 EUR
```

### 3. Metadata (IMPORTANTE)

Añade estos 3 campos de metadata:

```
product_type: custom_sticker
category: pegatinas
subcategory: holograficas
```

**Cómo añadir metadata:**
1. En la página de edición del producto
2. Busca la sección "Metadata" o "Custom Attributes"
3. Añade cada campo:
   - Key: `product_type`, Value: `custom_sticker`
   - Key: `category`, Value: `pegatinas`
   - Key: `subcategory`, Value: `holograficas`

## Valores Válidos para Metadata

### category
- `pegatinas`
- `etiquetas`

### subcategory (para pegatinas)
- `holograficas`
- `broqueladas`
- `transfer`
- `hojas`
- `paquetes`
- `servicio_impresado`
- `etiquetas_colgantes`

### subcategory (para etiquetas)
- `metalicas`
- `nino_blanco`
- `alfa_verdes`

## Verificar que Funciona

1. Guarda el producto
2. Ve a: `http://localhost:3000/es/products/custom-sticker-pegatinas-holograficas`
3. Deberías ver el configurador completo

## Ejemplo Completo

```json
{
  "title": "Pegatinas Holográficas Personalizadas",
  "handle": "custom-sticker-pegatinas-holograficas",
  "description": "Pegatinas con efecto holográfico",
  "status": "published",
  "metadata": {
    "product_type": "custom_sticker",
    "category": "pegatinas",
    "subcategory": "holograficas"
  },
  "variants": [{
    "title": "Configuración Personalizada",
    "sku": "CUSTOM-STICKER-HOLO",
    "manage_inventory": false,
    "allow_backorder": true,
    "prices": [{ "amount": 1000, "currency_code": "eur" }]
  }]
}
```
