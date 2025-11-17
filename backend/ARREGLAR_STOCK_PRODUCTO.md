# 🔧 Arreglar Producto "Fuera de Stock"

## Problema

El producto aparece como "fuera de stock" porque tiene el inventario activado.

## Solución

Ve al Admin de Medusa y edita el producto:

### Paso 1: Ir al Producto
```
http://localhost:9000/app
→ Products
→ Busca "Configuración Personalizada"
→ Haz clic para editar
```

### Paso 2: Editar la Variante

1. Baja hasta la sección **"Variants"**
2. Haz clic en la variante
3. Busca estas opciones:

```
☐ Manage Inventory    ← DESACTIVA ESTO (debe estar sin check)
☑ Allow Backorder     ← ACTIVA ESTO (debe tener check)
```

### Paso 3: Guardar

Haz clic en **"Save"** o **"Guardar"**

## ¿Por qué?

- **Manage Inventory = NO**: Porque son productos personalizados que se fabrican bajo demanda
- **Allow Backorder = YES**: Para permitir pedidos ilimitados sin restricciones

## Verificar

Después de guardar, el producto debería estar disponible y no mostrar "fuera de stock".

---

## Alternativa: Crear Producto Correcto desde Cero

Si prefieres crear un nuevo producto con la configuración correcta:

### En el Admin de Medusa:

```
Products → Add Product

Información General:
  Title: Pegatinas Holográficas Personalizadas
  Handle: custom-sticker-pegatinas-holograficas
  Description: Pegatinas con efecto holográfico brillante
  Status: Published

Variant:
  Title: Configuración Personalizada
  SKU: CUSTOM-STICKER-HOLO
  ☐ Manage Inventory    ← DESACTIVADO
  ☑ Allow Backorder     ← ACTIVADO
  Price: 10.00 EUR

Metadata (opcional):
  product_type: custom_sticker
  category: pegatinas
  subcategory: holograficas
```

**IMPORTANTE**: El handle debe ser exactamente `custom-sticker-pegatinas-holograficas`
