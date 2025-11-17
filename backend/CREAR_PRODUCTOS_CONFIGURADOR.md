# 🎨 Crear Productos para el Configurador

## Opción 1: Crear Manualmente en el Admin (Recomendado) ⭐

La forma más fácil es crear los productos directamente en el Admin de Medusa:

### Pasos:

1. **Accede al Admin de Medusa**
   ```
   http://localhost:9000/app
   ```

2. **Ve a Products → Add Product**

3. **Crea cada producto con esta configuración:**

#### Producto 1: Pegatinas Holográficas
```
Título: Pegatinas Holográficas Personalizadas
Handle: custom-sticker-pegatinas-holograficas
Descripción: Pegatinas con efecto holográfico brillante y llamativo
Status: Published

Variant:
  - Title: Configuración Personalizada
  - SKU: CUSTOM-STICKER-HOLO
  - Manage Inventory: NO ❌
  - Allow Backorder: YES ✅
  - Price: €10.00 (precio base, se sobrescribe)

Metadata (opcional):
  - product_type: custom_sticker
  - category: pegatinas
  - subcategory: holograficas
```

#### Producto 2: Pegatinas Broqueladas
```
Título: Pegatinas Broqueladas Personalizadas
Handle: custom-sticker-pegatinas-broqueladas
SKU: CUSTOM-STICKER-BROQ
(Misma configuración que arriba)
```

#### Producto 3: Pegatinas Transfer
```
Título: Pegatinas Transfer Personalizadas
Handle: custom-sticker-pegatinas-transfer
SKU: CUSTOM-STICKER-TRANS
```

#### Producto 4: Hojas de Pegatinas
```
Título: Hojas de Pegatinas Personalizadas
Handle: custom-sticker-pegatinas-hojas
SKU: CUSTOM-STICKER-HOJAS
```

#### Producto 5: Paquetes de Pegatinas
```
Título: Paquetes de Pegatinas Personalizadas
Handle: custom-sticker-pegatinas-paquetes
SKU: CUSTOM-STICKER-PAQ
```

#### Producto 6: Servicio Impresado
```
Título: Servicio de Impresión Profesional
Handle: custom-sticker-pegatinas-servicio-impresado
SKU: CUSTOM-STICKER-SERV
```

#### Producto 7: Etiquetas Colgantes
```
Título: Etiquetas Colgantes Personalizadas
Handle: custom-sticker-pegatinas-etiquetas-colgantes
SKU: CUSTOM-STICKER-COLG
```

#### Producto 8: Etiquetas Metálicas
```
Título: Etiquetas Metálicas Personalizadas
Handle: custom-sticker-etiquetas-metalicas
SKU: CUSTOM-LABEL-METAL
```

#### Producto 9: Etiquetas Nino Blanco
```
Título: Etiquetas de Nino Blanco Personalizadas
Handle: custom-sticker-etiquetas-nino-blanco
SKU: CUSTOM-LABEL-NINO
```

#### Producto 10: Etiquetas Alfa Verdes
```
Título: Etiquetas Alfa Verdes Personalizadas
Handle: custom-sticker-etiquetas-alfa-verdes
SKU: CUSTOM-LABEL-ALFA
```

### ⚠️ Importante:

- **Manage Inventory**: Debe estar en **NO** (desactivado)
- **Allow Backorder**: Debe estar en **YES** (activado)
- **Handle**: Debe coincidir exactamente con los handles del configurador
- **Price**: Puedes poner €10 como base, el configurador calculará el precio real

---

## Opción 2: Usar la API de Medusa

Si prefieres crear los productos programáticamente, usa este script:

### Script de Creación (Node.js)

Crea un archivo `create-products.js`:

```javascript
const axios = require('axios')

const MEDUSA_URL = 'http://localhost:9000'
const ADMIN_EMAIL = 'admin@medusa-test.com'
const ADMIN_PASSWORD = 'supersecret'

const products = [
  {
    title: "Pegatinas Holográficas Personalizadas",
    handle: "custom-sticker-pegatinas-holograficas",
    description: "Pegatinas con efecto holográfico brillante",
    is_giftcard: false,
    status: "published",
    options: [{ title: "Configuración", values: ["Personalizada"] }],
    variants: [{
      title: "Configuración Personalizada",
      sku: "CUSTOM-STICKER-HOLO",
      manage_inventory: false,
      allow_backorder: true,
      prices: [{ amount: 1000, currency_code: "eur" }]
    }]
  },
  // ... más productos
]

async function createProducts() {
  try {
    // 1. Login
    const loginRes = await axios.post(`${MEDUSA_URL}/admin/auth`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    })
    
    const token = loginRes.data.user.api_token
    
    // 2. Crear productos
    for (const product of products) {
      try {
        const res = await axios.post(
          `${MEDUSA_URL}/admin/products`,
          product,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        console.log(`✅ Creado: ${product.title}`)
      } catch (error) {
        console.error(`❌ Error: ${product.title}`, error.response?.data)
      }
    }
    
    console.log('✨ Proceso completado')
  } catch (error) {
    console.error('Error:', error.message)
  }
}

createProducts()
```

Ejecutar:
```bash
node create-products.js
```

---

## Opción 3: Importar desde CSV

Puedes crear un CSV y usar la función de importación de Medusa:

```csv
title,handle,description,sku,price,manage_inventory,allow_backorder
"Pegatinas Holográficas Personalizadas","custom-sticker-pegatinas-holograficas","Pegatinas holográficas","CUSTOM-STICKER-HOLO",10.00,false,true
"Pegatinas Broqueladas Personalizadas","custom-sticker-pegatinas-broqueladas","Pegatinas broqueladas","CUSTOM-STICKER-BROQ",10.00,false,true
```

---

## 🔍 Verificar que los Productos Están Creados

### En el Admin:
1. Ve a Products
2. Busca "Pegatinas Holográficas"
3. Verifica que el handle sea: `custom-sticker-pegatinas-holograficas`

### Desde la API:
```bash
curl http://localhost:9000/store/products/custom-sticker-pegatinas-holograficas
```

---

## 🎯 Mapeo Handle → Subcategoría

El configurador usa estos handles para identificar productos:

| Subcategoría Frontend | Handle Backend |
|----------------------|----------------|
| `/pegatinas/holograficas` | `custom-sticker-pegatinas-holograficas` |
| `/pegatinas/broqueladas` | `custom-sticker-pegatinas-broqueladas` |
| `/pegatinas/transfer` | `custom-sticker-pegatinas-transfer` |
| `/pegatinas/hojas` | `custom-sticker-pegatinas-hojas` |
| `/pegatinas/paquetes` | `custom-sticker-pegatinas-paquetes` |
| `/pegatinas/servicio-impresado` | `custom-sticker-pegatinas-servicio-impresado` |
| `/pegatinas/etiquetas-colgantes` | `custom-sticker-pegatinas-etiquetas-colgantes` |
| `/etiquetas/metalicas` | `custom-sticker-etiquetas-metalicas` |
| `/etiquetas/nino-blanco` | `custom-sticker-etiquetas-nino-blanco` |
| `/etiquetas/alfa-verdes` | `custom-sticker-etiquetas-alfa-verdes` |

---

## ❓ FAQ

### ¿Por qué "Manage Inventory" debe estar desactivado?
Porque son productos personalizados que se fabrican bajo demanda. No hay stock físico.

### ¿Por qué "Allow Backorder" debe estar activado?
Para permitir pedidos ilimitados sin restricciones de inventario.

### ¿Qué precio pongo?
Puedes poner €10 como precio base. El configurador calculará el precio real basado en la configuración del cliente.

### ¿Necesito crear variantes?
Solo necesitas una variante por producto con el título "Configuración Personalizada".

### ¿Puedo cambiar los handles?
Sí, pero debes actualizar también el archivo `storefront/src/config/sticker-categories.ts` para que coincidan.

---

## ✅ Checklist

- [ ] Crear 10 productos en el Admin de Medusa
- [ ] Verificar que los handles coinciden exactamente
- [ ] Desactivar "Manage Inventory" en todos
- [ ] Activar "Allow Backorder" en todos
- [ ] Poner precio base (ej: €10)
- [ ] Verificar que aparecen en la Store API
- [ ] Probar el configurador en el frontend

---

## 🚀 Después de Crear los Productos

1. Ve al frontend: `http://localhost:3000/es/pegatinas/holograficas`
2. Configura un producto
3. Añade al carrito
4. Verifica que se crea el line item con la metadata correcta

¡Listo! Los productos están configurados y el configurador funcionará perfectamente.
