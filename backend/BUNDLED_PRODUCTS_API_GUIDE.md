# Bundled Products - Guía de API

## ¿Por qué no hay UI en el Admin?

La UI personalizada del admin causaba conflictos con las dependencias de `@medusajs/ui` durante el build en Railway. Para mantener la estabilidad del deploy, los bundles se gestionan completamente por API.

## Crear un Bundle

### Opción 1: Desde la consola del navegador en el Admin

1. Abre el Admin Dashboard en tu navegador
2. Abre la consola de desarrollador (F12)
3. Ejecuta este código:

```javascript
fetch('/admin/bundled-products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    title: "Kit de Stickers Premium",
    product: {
      title: "Kit de Stickers Premium",
      status: "published",
      options: [{
        title: "Default",
        values: ["default"]
      }],
      variants: [{
        title: "Kit de Stickers Premium",
        options: { "Default": "default" },
        manage_inventory: false,
        prices: [{
          amount: 2999,
          currency_code: "usd"
        }]
      }]
    },
    items: [
      { product_id: "prod_01XXXXX", quantity: 5 },
      { product_id: "prod_01YYYYY", quantity: 3 }
    ]
  })
})
.then(r => r.json())
.then(data => {
  console.log('Bundle creado:', data)
})
.catch(err => {
  console.error('Error:', err)
})
```

### Opción 2: Usando cURL

```bash
curl -X POST https://tu-backend.railway.app/admin/bundled-products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "title": "Kit de Stickers Premium",
    "product": {
      "title": "Kit de Stickers Premium",
      "status": "published",
      "options": [{"title": "Default", "values": ["default"]}],
      "variants": [{
        "title": "Kit de Stickers Premium",
        "options": {"Default": "default"},
        "manage_inventory": false,
        "prices": [{"amount": 2999, "currency_code": "usd"}]
      }]
    },
    "items": [
      {"product_id": "prod_01XXXXX", "quantity": 5},
      {"product_id": "prod_01YYYYY", "quantity": 3}
    ]
  }'
```

### Opción 3: Script Node.js

```javascript
const fetch = require('node-fetch')

async function createBundle() {
  const response = await fetch('https://tu-backend.railway.app/admin/bundled-products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_ADMIN_TOKEN'
    },
    body: JSON.stringify({
      title: "Kit de Stickers Premium",
      product: {
        title: "Kit de Stickers Premium",
        status: "published",
        options: [{title: "Default", values: ["default"]}],
        variants: [{
          title: "Kit de Stickers Premium",
          options: {"Default": "default"},
          manage_inventory: false,
          prices: [{amount: 2999, currency_code: "usd"}]
        }]
      },
      items: [
        {product_id: "prod_01XXXXX", quantity: 5},
        {product_id: "prod_01YYYYY", quantity: 3}
      ]
    })
  })

  const data = await response.json()
  console.log('Bundle creado:', data)
}

createBundle()
```

## Listar Bundles

```javascript
fetch('/admin/bundled-products', {
  credentials: 'include'
})
.then(r => r.json())
.then(data => {
  console.log('Bundles:', data.bundled_products)
})
```

## Obtener un Bundle específico

```javascript
fetch('/admin/bundled-products/bundle_01XXXXX', {
  credentials: 'include'
})
.then(r => r.json())
.then(data => {
  console.log('Bundle:', data.bundled_product)
})
```

## Actualizar un Bundle

```javascript
fetch('/admin/bundled-products/bundle_01XXXXX', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    title: "Nuevo título del bundle"
  })
})
.then(r => r.json())
.then(data => {
  console.log('Bundle actualizado:', data)
})
```

## Eliminar un Bundle

```javascript
fetch('/admin/bundled-products/bundle_01XXXXX', {
  method: 'DELETE',
  credentials: 'include'
})
.then(r => r.json())
.then(data => {
  console.log('Bundle eliminado:', data)
})
```

## Pasos después de crear un Bundle

1. **Configurar precio**: El bundle crea un producto automáticamente. Ve a Products en el admin y configura el precio del bundle.

2. **Asignar Sales Channel**: Asegúrate de que el producto del bundle esté asignado al sales channel correcto (ej: "Default Sales Channel").

3. **Configurar Shipping**: Asigna un shipping profile al producto del bundle.

4. **Agregar imágenes**: Sube imágenes del bundle en la sección de productos.

5. **Publicar**: Asegúrate de que el status del producto sea "published".

## Obtener IDs de Productos

Para saber qué product_id usar en los items del bundle:

```javascript
fetch('/admin/products?limit=100', {
  credentials: 'include'
})
.then(r => r.json())
.then(data => {
  data.products.forEach(p => {
    console.log(`${p.title}: ${p.id}`)
  })
})
```

## Ejemplo Completo

```javascript
// 1. Obtener productos disponibles
const products = await fetch('/admin/products?limit=100', {
  credentials: 'include'
}).then(r => r.json())

console.log('Productos disponibles:')
products.products.forEach(p => {
  console.log(`- ${p.title} (${p.id})`)
})

// 2. Crear bundle con productos específicos
const bundle = await fetch('/admin/bundled-products', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  credentials: 'include',
  body: JSON.stringify({
    title: "Kit Completo de Stickers",
    product: {
      title: "Kit Completo de Stickers",
      description: "Bundle con los mejores stickers",
      status: "published",
      options: [{title: "Default", values: ["default"]}],
      variants: [{
        title: "Kit Completo",
        options: {"Default": "default"},
        manage_inventory: false,
        prices: [{
          amount: 4999, // $49.99
          currency_code: "usd"
        }]
      }]
    },
    items: [
      {product_id: products.products[0].id, quantity: 10},
      {product_id: products.products[1].id, quantity: 5},
      {product_id: products.products[2].id, quantity: 3}
    ]
  })
}).then(r => r.json())

console.log('Bundle creado:', bundle)
```

## Troubleshooting

### Error: "Product not found"
- Verifica que los product_id existan y sean correctos
- Usa el endpoint `/admin/products` para listar productos disponibles

### Error: "Unauthorized"
- Asegúrate de estar autenticado en el admin
- Si usas API externa, incluye el token de autorización

### El bundle no aparece en el storefront
- Verifica que el producto del bundle esté publicado (status: "published")
- Asegúrate de que esté asignado al sales channel correcto
- Configura el precio del producto del bundle

### No puedo agregar el bundle al carrito
- Verifica que todos los productos del bundle existan
- Asegúrate de que el bundle tenga un producto asociado
- Revisa que el producto del bundle tenga variantes configuradas
