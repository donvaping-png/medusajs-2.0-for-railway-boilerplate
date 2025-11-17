# 🗺️ Rutas del Configurador

## ⚠️ Importante

El configurador **NO usa** las rutas de productos normales de Medusa.

## ❌ Ruta Incorrecta

```
http://localhost:3000/es/products/configuracion-personalizada
```

Esta es la página de producto normal de Medusa. No es el configurador.

## ✅ Rutas Correctas del Configurador

### Pegatinas

```
http://localhost:3000/es/pegatinas
→ Muestra todas las subcategorías de pegatinas

http://localhost:3000/es/pegatinas/holograficas
→ Configurador de pegatinas holográficas

http://localhost:3000/es/pegatinas/broqueladas
→ Configurador de pegatinas broqueladas

http://localhost:3000/es/pegatinas/transfer
→ Configurador de pegatinas transfer

http://localhost:3000/es/pegatinas/hojas
→ Configurador de hojas de pegatinas

http://localhost:3000/es/pegatinas/paquetes
→ Configurador de paquetes

http://localhost:3000/es/pegatinas/servicio-impresado
→ Configurador de servicio impresado

http://localhost:3000/es/pegatinas/etiquetas-colgantes
→ Configurador de etiquetas colgantes
```

### Etiquetas

```
http://localhost:3000/es/etiquetas
→ Muestra todas las subcategorías de etiquetas

http://localhost:3000/es/etiquetas/metalicas
→ Configurador de etiquetas metálicas

http://localhost:3000/es/etiquetas/nino-blanco
→ Configurador de etiquetas nino blanco

http://localhost:3000/es/etiquetas/alfa-verdes
→ Configurador de etiquetas alfa verdes
```

## 🎯 Prueba el Configurador

```bash
# 1. Asegúrate de que el frontend está corriendo
cd storefront
npm run dev

# 2. Abre tu navegador en:
http://localhost:3000/es/pegatinas/holograficas
```

## 🔗 Relación con los Productos de Medusa

El configurador **SÍ necesita** los productos en Medusa, pero:

1. Los productos se usan **internamente** cuando el usuario añade al carrito
2. El usuario **nunca ve** la página de producto normal (`/products/...`)
3. El usuario **siempre usa** el configurador (`/pegatinas/...`)

### Flujo Correcto:

```
Usuario → /pegatinas/holograficas (configurador)
       → Configura el producto
       → Hace clic en "Añadir al Carrito"
       → Se usa el producto "custom-sticker-pegatinas-holograficas" de Medusa
       → Se añade al carrito con la configuración personalizada
```

## 📦 Handles de Productos Necesarios

Para que el configurador funcione, necesitas estos productos en Medusa:

```
custom-sticker-pegatinas-holograficas
custom-sticker-pegatinas-broqueladas
custom-sticker-pegatinas-transfer
custom-sticker-pegatinas-hojas
custom-sticker-pegatinas-paquetes
custom-sticker-pegatinas-servicio-impresado
custom-sticker-pegatinas-etiquetas-colgantes
custom-sticker-etiquetas-metalicas
custom-sticker-etiquetas-nino-blanco
custom-sticker-etiquetas-alfa-verdes
```

## 🔍 Verificar que Funciona

1. **Ve al configurador:**
   ```
   http://localhost:3000/es/pegatinas/holograficas
   ```

2. **Deberías ver:**
   - Imagen grande a la izquierda
   - Formulario de configuración a la derecha
   - Dropdowns, radio buttons, tabla de precios, etc.

3. **Si ves un error 404:**
   - Verifica que el frontend está corriendo
   - Verifica que la ruta es correcta (con `/pegatinas/`, no `/products/`)

## 💡 Resumen

- ✅ Usa: `/pegatinas/holograficas` (configurador)
- ❌ No uses: `/products/configuracion-personalizada` (página normal)
- 📦 Los productos en Medusa son necesarios pero se usan internamente
- 🎨 El usuario siempre interactúa con el configurador personalizado
