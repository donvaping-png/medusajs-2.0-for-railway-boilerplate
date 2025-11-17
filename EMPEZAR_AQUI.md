# 🚀 EMPEZAR AQUÍ - Configurador de Pegatinas

## ¿Qué es esto?

Un configurador avanzado de pegatinas personalizadas para tu e-commerce. Los clientes pueden:
- Elegir tipo, forma, material, acabado, tamaño, cantidad
- Subir su diseño
- Ver el precio en tiempo real
- Añadir al carrito

## ¿Funciona ya?

**SÍ** ✅ - El configurador está 100% funcional en el frontend.

**NO necesitas crear nada en el backend para probarlo.**

## Pruébalo AHORA (2 minutos)

```bash
# 1. Inicia el frontend
cd storefront
npm run dev

# 2. Abre tu navegador
http://localhost:3000/es/pegatinas/holograficas

# 3. Configura un producto y haz clic en "Añadir al Carrito"
# 4. Verás toda la información en la consola del navegador
```

## ¿Qué rutas hay?

```
/es/pegatinas              → Ver todas las subcategorías
/es/pegatinas/holograficas → Configurador de pegatinas holográficas
/es/etiquetas              → Ver todas las subcategorías de etiquetas
/es/etiquetas/metalicas    → Configurador de etiquetas metálicas
```

**Total: 10 subcategorías configurables**

## Para Producción (Opcional)

Si quieres conectarlo con Medusa:

### 1. Crear Productos (10 minutos)

Ve al Admin de Medusa y crea 10 productos:

```
Handle: custom-sticker-pegatinas-holograficas
Manage Inventory: NO
Allow Backorder: YES
Price: €10
```

**Lista completa de handles:** Ver `backend/CREAR_PRODUCTOS_CONFIGURADOR.md`

### 2. Integrar con Medusa (30 minutos)

Implementar 3 funciones:
- Subida de imágenes
- Cálculo de precios
- Añadir al carrito

**Guía completa:** Ver `storefront/INTEGRACION_MEDUSA_CONFIGURADOR.md`

## Documentación

- `RESUMEN_CONFIGURADOR.md` - Resumen rápido
- `backend/CREAR_PRODUCTOS_CONFIGURADOR.md` - Crear productos en Medusa
- `storefront/CONFIGURADOR_README.md` - Guía técnica completa
- `storefront/INTEGRACION_MEDUSA_CONFIGURADOR.md` - Integración paso a paso
- `storefront/EJEMPLOS_USO_CONFIGURADOR.md` - Ejemplos de código

## ¿Preguntas?

1. **¿Necesito crear productos para probar?** 
   → NO, funciona en modo demo

2. **¿Cómo añado más subcategorías?**
   → Edita `storefront/src/config/sticker-categories.ts`

3. **¿Cómo cambio los precios?**
   → Edita `storefront/src/lib/helpers/sticker-pricing.ts`

4. **¿Funciona en móvil?**
   → SÍ, es completamente responsive

## ¡Empieza Ahora!

```bash
cd storefront && npm run dev
```

Luego ve a: `http://localhost:3000/es/pegatinas/holograficas`

🎨 ¡Disfruta configurando pegatinas!
