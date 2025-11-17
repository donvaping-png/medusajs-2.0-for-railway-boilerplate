# 🚀 Solución Rápida - Configurador

## Tu Problema

1. ✅ Creaste un producto en Medusa
2. ❌ Aparece "fuera de stock"
3. ❌ No carga la página de configuración

## Solución en 3 Pasos

### Paso 1: Arreglar el Stock (2 minutos)

1. Ve al Admin de Medusa: `http://localhost:9000/app`
2. Products → Busca tu producto → Editar
3. En la sección **Variants**, edita la variante:
   ```
   ☐ Manage Inventory    ← DESACTIVA (quita el check)
   ☑ Allow Backorder     ← ACTIVA (pon el check)
   ```
4. Guarda

**¿Por qué?** Los productos personalizados se fabrican bajo demanda, no tienen stock físico.

### Paso 2: Cambiar el Handle del Producto (1 minuto)

El handle debe ser exactamente:
```
custom-sticker-pegatinas-holograficas
```

No puede ser `configuracion-personalizada` u otro nombre.

**Cómo cambiarlo:**
1. En el mismo producto, busca el campo **Handle**
2. Cámbialo a: `custom-sticker-pegatinas-holograficas`
3. Guarda

### Paso 3: Usar la Ruta Correcta

**NO uses:**
```
❌ http://localhost:3000/es/products/configuracion-personalizada
```

**USA:**
```
✅ http://localhost:3000/es/pegatinas/holograficas
```

## Verificar que Funciona

```bash
# 1. Frontend corriendo
cd storefront
npm run dev

# 2. Abre en el navegador
http://localhost:3000/es/pegatinas/holograficas
```

**Deberías ver:**
- Imagen grande a la izquierda
- Formulario de configuración a la derecha
- Dropdowns, materiales, tabla de precios, etc.

## Si Aún No Funciona

### Problema: Error 404 en el configurador

**Causa:** El frontend no está corriendo o la ruta es incorrecta

**Solución:**
```bash
cd storefront
npm run dev
# Espera a que diga "Ready"
# Luego ve a: http://localhost:3000/es/pegatinas/holograficas
```

### Problema: "Fuera de stock" en /products/...

**Causa:** Estás viendo la página de producto normal, no el configurador

**Solución:** No uses `/products/...`, usa `/pegatinas/holograficas`

### Problema: El configurador carga pero no añade al carrito

**Causa:** El handle del producto no coincide

**Solución:** Verifica que el handle sea exactamente:
```
custom-sticker-pegatinas-holograficas
```

## Resumen

1. ✅ Desactiva "Manage Inventory"
2. ✅ Activa "Allow Backorder"
3. ✅ Handle: `custom-sticker-pegatinas-holograficas`
4. ✅ Usa ruta: `/pegatinas/holograficas`

## Crear Más Productos

Si quieres crear productos para las otras subcategorías:

```
Pegatinas Broqueladas
Handle: custom-sticker-pegatinas-broqueladas
Ruta: /pegatinas/broqueladas

Pegatinas Transfer
Handle: custom-sticker-pegatinas-transfer
Ruta: /pegatinas/transfer

Etiquetas Metálicas
Handle: custom-sticker-etiquetas-metalicas
Ruta: /etiquetas/metalicas

... etc
```

Ver lista completa en: `backend/CREAR_PRODUCTOS_CONFIGURADOR.md`

## ¿Necesitas Ayuda?

1. Verifica que el frontend está corriendo
2. Usa la ruta correcta: `/pegatinas/holograficas`
3. Verifica el handle del producto en Medusa
4. Verifica que "Manage Inventory" está desactivado

¡Listo! El configurador debería funcionar ahora. 🎉
