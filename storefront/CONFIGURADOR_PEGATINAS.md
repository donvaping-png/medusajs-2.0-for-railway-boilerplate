# Configurador de Pegatinas - Guía de Implementación

## 📋 Resumen

Se ha implementado un configurador avanzado de pegatinas tipo StickerApp que permite a los usuarios personalizar completamente sus productos antes de añadirlos al carrito.

## 🗂️ Estructura de Archivos

### Configuración
- `src/config/sticker-categories.ts` - Configuración central de categorías y subcategorías

### Tipos TypeScript
- `src/types/sticker-configurator.ts` - Tipos para el configurador

### Hooks
- `src/hooks/useStickerConfigurator.ts` - Hook principal para manejar el estado del configurador

### Componentes
- `src/components/organisms/StickerConfigurator/`
  - `StickerConfigurator.tsx` - Componente principal
  - `ConfiguratorSection.tsx` - Sección reutilizable
  - `ConfiguratorSummary.tsx` - Resumen del pedido
  - `index.ts` - Exports

### Páginas
- `src/app/[locale]/(main)/pegatinas/page.tsx` - Listado de subcategorías de pegatinas
- `src/app/[locale]/(main)/pegatinas/[subcategory]/page.tsx` - Configurador de pegatinas
- `src/app/[locale]/(main)/etiquetas/page.tsx` - Listado de subcategorías de etiquetas
- `src/app/[locale]/(main)/etiquetas/[subcategory]/page.tsx` - Configurador de etiquetas

### Helpers
- `src/lib/helpers/sticker-cart.ts` - Funciones para añadir al carrito
- `src/lib/helpers/sticker-pricing.ts` - Cálculo de precios

## 🎯 Características Implementadas

### 1. Categorías y Subcategorías

**Pegatinas:**
- Holográficas
- Broqueladas
- Transfer
- Hojas de Pegatinas
- Paquetes de Pegatinas
- C-Servicio Impresado
- Etiquetas Colgantes

**Etiquetas:**
- Etiquetas Metálicas
- Etiquetas de Nino Blanco
- Etiquetas Alfa Verdes

### 2. Configurador

Cada subcategoría tiene un configurador con:

#### Tipo
- Hojas de Pegatinas
- Pegatinas de Etiquetas Colgantes
- Pegatinas de Nojas
- (Configurable por subcategoría)

#### Forma
- Contorneada
- Cuadrada
- Circular
- Esquinas Redondeadas

#### Material
- Específico por subcategoría (ej: Holográfico, Vinilo, Metalizado)
- Con multiplicador de precio

#### Acabado
- Lustroso (brillante)
- Satinado (mate)

#### Tamaño
- Tamaños predefinidos (4x4, 5x5, 7x7, 10x10, 15x15 cm)
- Tamaño personalizado con validación de límites

#### Cantidad
- Cantidades predefinidas (10, 25, 50, 100, 250, 500, 1000)
- Cantidad personalizada con mínimo configurable
- Descuentos por volumen automáticos

#### Imagen
- Subida de archivo (JPG/PNG)
- Preview de la imagen
- Validación de tamaño (máx 10MB)

### 3. Cálculo de Precios

El sistema calcula precios basándose en:
- Área (ancho × alto)
- Cantidad
- Material (multiplicador)
- Descuentos por volumen:
  - 25+ unidades: 5% descuento
  - 50+ unidades: 10% descuento
  - 100+ unidades: 15% descuento
  - 250+ unidades: 20% descuento
  - 500+ unidades: 25% descuento
  - 1000+ unidades: 30% descuento

### 4. Validación

El configurador valida:
- Todos los campos obligatorios completados
- Dimensiones dentro de los límites
- Cantidad mínima respetada
- Formato y tamaño de imagen

## 🚀 Rutas Disponibles

```
/[locale]/pegatinas                          → Listado de subcategorías
/[locale]/pegatinas/holograficas            → Configurador
/[locale]/pegatinas/broqueladas             → Configurador
/[locale]/pegatinas/transfer                → Configurador
/[locale]/pegatinas/hojas                   → Configurador
/[locale]/pegatinas/paquetes                → Configurador
/[locale]/pegatinas/servicio-impresado      → Configurador
/[locale]/pegatinas/etiquetas-colgantes     → Configurador

/[locale]/etiquetas                          → Listado de subcategorías
/[locale]/etiquetas/metalicas               → Configurador
/[locale]/etiquetas/nino-blanco             → Configurador
/[locale]/etiquetas/alfa-verdes             → Configurador
```

## 🔧 Cómo Añadir Nuevas Subcategorías

1. Edita `src/config/sticker-categories.ts`
2. Añade la nueva subcategoría al objeto correspondiente:

```typescript
nueva_subcategoria: {
  id: "nueva_subcategoria",
  name: "Nueva Subcategoría",
  slug: "nueva-subcategoria",
  description: "Descripción de la subcategoría",
  allowedTypes: COMMON_TYPES,
  allowedShapes: COMMON_SHAPES,
  allowedMaterials: [
    { id: "material_especial", name: "Material Especial", priceMultiplier: 1.5 },
  ],
  allowedFinishes: COMMON_FINISHES,
  presetSizes: COMMON_PRESET_SIZES,
  allowCustomSize: true,
  quantitySteps: COMMON_QUANTITY_STEPS,
  minQuantity: 10,
  maxWidth: 50,
  maxHeight: 50,
}
```

3. La ruta se generará automáticamente

## 🔌 Integración Pendiente con Medusa

### 1. Carrito

Actualizar `src/lib/helpers/sticker-cart.ts`:

```typescript
export async function addCustomStickerToCart(payload: AddToCartPayload) {
  const response = await fetch('/api/cart/line-items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      variant_id: payload.productId,
      quantity: payload.quantity,
      metadata: payload.metadata,
    }),
  })
  
  return await response.json()
}
```

### 2. Subida de Imágenes

Actualizar `src/lib/helpers/sticker-cart.ts`:

```typescript
export async function uploadStickerImage(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })
  
  const data = await response.json()
  return { success: true, url: data.url }
}
```

### 3. Precios Dinámicos

Crear endpoint en Medusa para calcular precios:

```typescript
// backend/src/api/store/custom-stickers/price/route.ts
export async function POST(req: Request) {
  const { width, height, quantity, material } = await req.json()
  
  // Lógica de cálculo de precios desde Medusa
  const price = calculatePrice({ width, height, quantity, material })
  
  return Response.json({ price })
}
```

Luego actualizar el hook para usar este endpoint.

## 📱 Responsive

El configurador es completamente responsive:
- Mobile: Layout de 1 columna
- Desktop: 2 columnas para configurador + 1 columna sticky para resumen

## 🎨 Estilos

Usa Tailwind CSS y mantiene consistencia con el resto del proyecto:
- Colores: `text-primary`, `bg-primary`
- Bordes: `border`, `rounded-lg`
- Transiciones: `transition-all`, `hover:scale-105`

## ✅ Testing

Para probar el configurador:

1. Navega a `/es/pegatinas` (o tu locale)
2. Selecciona una subcategoría (ej: Holográficas)
3. Configura todos los campos
4. Sube una imagen de prueba
5. Verifica el resumen de precios
6. Haz clic en "Añadir al Carrito"
7. Revisa la consola del navegador para ver el payload

## 🔄 Próximos Pasos

1. **Integrar con API de Medusa:**
   - Conectar `addCustomStickerToCart` con el carrito real
   - Implementar subida de imágenes a S3/MinIO
   - Conectar cálculo de precios con backend

2. **Mejorar UX:**
   - Añadir preview 3D de la pegatina
   - Implementar editor de diseño básico
   - Añadir galería de plantillas

3. **Optimizaciones:**
   - Lazy loading de imágenes
   - Caché de configuraciones
   - Guardar configuración en localStorage

4. **Analytics:**
   - Tracking de configuraciones iniciadas
   - Tracking de conversiones
   - Análisis de opciones más populares

## 📝 Notas

- Todos los precios son mock y deben ser reemplazados por la lógica real
- Las imágenes subidas se guardan temporalmente en memoria
- El sistema está preparado para escalar a más categorías y opciones
- La configuración es centralizada y fácil de mantener
