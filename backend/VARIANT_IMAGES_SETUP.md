# Integración de Medusa Variant Images

## ✅ Completado

1. **Instalación del plugin**: ✅
   ```bash
   pnpm add medusa-variant-images
   ```
   - Versión instalada: 1.1.4

2. **Configuración en medusa-config.js**: ✅
   - El plugin ha sido agregado a la sección `plugins`

## 📋 Pasos Pendientes

### 1. Ejecutar Migraciones de Base de Datos

Asegúrate de tener tu base de datos PostgreSQL corriendo y las variables de entorno configuradas en tu archivo `.env`:

```bash
cd backend
npx medusa db:migrate
```

Esto creará una nueva tabla en tu base de datos para almacenar la configuración de imágenes de variantes.

### 2. Reiniciar el Backend

Después de ejecutar las migraciones, reinicia tu servidor de desarrollo:

```bash
pnpm dev
```

## 🎨 Uso en el Admin Dashboard

Una vez completados los pasos anteriores, podrás:

1. **Acceder al dashboard**: `http://localhost:9000/app`
2. **Ir a un producto** y seleccionar una variante
3. **Ver la nueva sección "Variant Images"** donde podrás:
   - Subir imágenes específicas para cada variante
   - Ordenar las imágenes (se muestra el número al hacer clic)
   - Usar la opción de "base option" para subir imágenes a múltiples variantes simultáneamente
   - Hacer clic en los 3 puntos (⋮) en la esquina superior derecha para opciones avanzadas

### Ejemplo: Subir Imágenes por Opción Base

Si tienes una tienda de ropa y quieres subir imágenes a todas las variantes con el color "marrón":

1. Haz clic en los **3 puntos** (⋮) en la sección de imágenes de variante
2. Selecciona la opción base (ej: "Color")
3. Elige el valor (ej: "Marrón")
4. Sube las imágenes - se aplicarán a todas las variantes con ese color

## 🔧 Uso en el Storefront

### Actualizar las Peticiones de Productos

En tu storefront, necesitas agregar el campo `+metadata` a tus peticiones de productos para acceder a las imágenes de variantes.

#### Ejemplo en `storefront/src/lib/data/products.ts`:

```typescript
// Antes
const products = await sdk.client.fetch(`/store/products`, {
  query: {
    fields: 'id,title,handle,thumbnail,variants',
  },
});

// Después - Agregar +metadata
const products = await sdk.client.fetch(`/store/products`, {
  query: {
    fields: 'id,title,handle,thumbnail,variants,+metadata',
  },
});
```

### Acceder a las Imágenes de Variantes

Una vez agregado `+metadata`, podrás acceder a las imágenes desde los metadatos de cada variante:

```typescript
type VariantImage = {
  url: string;
};

// Acceder a la imagen thumbnail de la variante
const thumbnail: string | null | undefined = variant.metadata?.thumbnail;

// Acceder a todas las imágenes de la variante
const images: VariantImage[] | undefined = variant.metadata?.images;

// Ejemplo de uso en un componente
{variant.metadata?.images?.map((image, index) => (
  <img 
    key={index}
    src={image.url} 
    alt={`${variant.title} - Image ${index + 1}`}
  />
))}
```

## 📝 Notas Importantes

- Las imágenes de variantes se almacenan en el campo `metadata` de cada variante
- El plugin permite ordenar las imágenes y muestra el número de orden
- Puedes subir imágenes de forma masiva usando la opción de "base option"
- Las imágenes se gestionan completamente desde el admin dashboard
- No necesitas modificar tu código de backend, solo agregar `+metadata` en las peticiones del frontend

## 🔍 Verificación

Para verificar que todo funciona correctamente:

1. Sube imágenes a una variante desde el admin
2. En tu storefront, haz una petición con `+metadata`
3. Inspecciona `variant.metadata.images` en la consola
4. Deberías ver un array con objetos `{ url: "..." }`

## 📚 Documentación Oficial

- [Medusa Variant Images - NPM](https://www.npmjs.com/package/medusa-variant-images)
- [MedusaJS Documentation](https://docs.medusajs.com/)
