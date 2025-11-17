# 📝 Cómo Añadir Metadata en Medusa Admin

## Método 1: Campo por Campo (Recomendado)

En Medusa v2, el metadata se añade campo por campo:

### 1. product_type
```
Key: product_type
Value: custom_sticker
Type: string
```

### 2. config.shapes (Array)
```
Key: config.shapes
Value: ["contorneado","cuadrado","circular","esquinas_redondeadas"]
Type: array
```

### 3. config.materials (Array de objetos)
```
Key: config.materials
Value: [{"id":"vinilo","name":"Vinilo","priceMultiplier":1.0}]
Type: array
```

### 4. config.sizes (Array de objetos)
```
Key: config.sizes
Value: [{"label":"30x15 cm","width":30,"height":15},{"label":"40x20 cm","width":40,"height":20}]
Type: array
```

### 5. config.quantities (Array de objetos)
```
Key: config.quantities
Value: [{"qty":10,"basePrice":50.00},{"qty":25,"basePrice":110.00}]
Type: array
```

### 6. config.allowCustomSize (Boolean)
```
Key: config.allowCustomSize
Value: false
Type: boolean
```

### 7. config.minQuantity (Number)
```
Key: config.minQuantity
Value: 10
Type: number
```

## Método 2: Usando la API de Medusa

Si el Admin no funciona bien con JSON, usa la API:

### Paso 1: Obtener Token de Admin

```bash
curl -X POST http://localhost:9000/admin/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@medusa-test.com",
    "password": "supersecret"
  }'
```

Copia el `token` de la respuesta.

### Paso 2: Actualizar Producto

```bash
curl -X POST http://localhost:9000/admin/products/{PRODUCT_ID} \
  -H "Authorization: Bearer {TU_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "metadata": {
      "product_type": "custom_sticker",
      "config": {
        "shapes": ["contorneado", "cuadrado", "circular", "esquinas_redondeadas"],
        "materials": [
          {
            "id": "vinilo",
            "name": "Vinilo",
            "priceMultiplier": 1.0
          }
        ],
        "sizes": [
          {"label": "30x15 cm", "width": 30, "height": 15},
          {"label": "40x20 cm", "width": 40, "height": 20}
        ],
        "quantities": [
          {"qty": 10, "basePrice": 50.00},
          {"qty": 25, "basePrice": 110.00}
        ],
        "allowCustomSize": false,
        "minQuantity": 10
      }
    }
  }'
```

## Método 3: Script Node.js

Crea un archivo `update-product.js`:

```javascript
const axios = require('axios')

const MEDUSA_URL = 'http://localhost:9000'
const ADMIN_EMAIL = 'admin@medusa-test.com'
const ADMIN_PASSWORD = 'supersecret'
const PRODUCT_ID = 'prod_xxx' // Tu product ID

async function updateProduct() {
  // 1. Login
  const loginRes = await axios.post(`${MEDUSA_URL}/admin/auth`, {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD
  })
  
  const token = loginRes.data.user.api_token
  
  // 2. Actualizar producto
  const res = await axios.post(
    `${MEDUSA_URL}/admin/products/${PRODUCT_ID}`,
    {
      metadata: {
        product_type: 'custom_sticker',
        config: {
          shapes: ['contorneado', 'cuadrado', 'circular', 'esquinas_redondeadas'],
          materials: [
            {
              id: 'vinilo',
              name: 'Vinilo',
              priceMultiplier: 1.0
            }
          ],
          sizes: [
            { label: '30x15 cm', width: 30, height: 15 },
            { label: '40x20 cm', width: 40, height: 20 }
          ],
          quantities: [
            { qty: 10, basePrice: 50.00 },
            { qty: 25, basePrice: 110.00 }
          ],
          allowCustomSize: false,
          minQuantity: 10
        }
      }
    },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  
  console.log('✅ Producto actualizado:', res.data.product.metadata)
}

updateProduct()
```

Ejecutar:
```bash
node update-product.js
```

## Verificar

1. Recarga la página del producto
2. Abre la consola del navegador (F12)
3. Busca los logs que empiezan con "=== DEBUG CONFIGURADOR ==="
4. Verifica que aparezcan tus configuraciones

## Ejemplo Completo de Metadata

```json
{
  "product_type": "custom_sticker",
  "config": {
    "shapes": [
      "contorneado",
      "cuadrado",
      "circular",
      "esquinas_redondeadas"
    ],
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
      { "label": "40x20 cm", "width": 40, "height": 20 },
      { "label": "50x25 cm", "width": 50, "height": 25 }
    ],
    "quantities": [
      { "qty": 10, "basePrice": 50.00 },
      { "qty": 25, "basePrice": 110.00 },
      { "qty": 50, "basePrice": 200.00 }
    ],
    "allowCustomSize": false,
    "minQuantity": 10
  }
}
```

¡Con esto debería funcionar! 🎉
