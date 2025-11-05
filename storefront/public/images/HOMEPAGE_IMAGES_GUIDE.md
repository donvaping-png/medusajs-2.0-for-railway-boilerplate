# Guía de Imágenes para Homepage de Pegatinas de Vinilo

Para que la homepage funcione correctamente, necesitas agregar las siguientes imágenes en las carpetas correspondientes:

## Estructura de Carpetas Requerida

```
storefront/public/images/
├── hero/
│   └── Image.jpg (700x600px) - Imagen principal del hero
├── custom-stickers/
│   └── showcase.jpg - Pegatinas personalizadas en uso
├── use-cases/
│   ├── business.jpg - Pegatinas de branding empresarial
│   ├── personal.jpg - Decoración personal
│   ├── vehicles.jpg - Pegatinas para vehículos
│   └── events.jpg - Pegatinas para eventos
```

## Especificaciones de Imágenes

### Hero Section (hero/Image.jpg)
- **Dimensiones recomendadas**: 700x600px o superior
- **Formato**: JPG optimizado
- **Contenido sugerido**: Collage de pegatinas de vinilo coloridas, o laptop/botella con pegatinas personalizadas
- **Peso máximo**: 200KB (optimizado)

### Custom Sticker Showcase (custom-stickers/showcase.jpg)
- **Dimensiones**: Aspecto cuadrado o 4:3
- **Contenido sugerido**: Laptop, botella de agua o superficie con pegatinas personalizadas aplicadas
- **Calidad**: Alta resolución para mostrar detalles del vinilo

### Use Cases (use-cases/)

#### business.jpg
- **Contenido**: Pegatinas con logos empresariales, packaging con branding
- **Dimensiones**: Aspecto cuadrado (1:1)

#### personal.jpg
- **Contenido**: Laptop, teléfono o botella con pegatinas decorativas personales
- **Dimensiones**: Aspecto cuadrado (1:1)

#### vehicles.jpg
- **Contenido**: Coche, moto o bicicleta con pegatinas de vinilo aplicadas
- **Dimensiones**: Aspecto cuadrado (1:1)

#### events.jpg
- **Contenido**: Pegatinas personalizadas para bodas, fiestas o eventos corporativos
- **Dimensiones**: Aspecto cuadrado (1:1)

## Imágenes Placeholder

Si no tienes las imágenes aún, puedes usar servicios como:
- **Unsplash**: https://unsplash.com/s/photos/stickers
- **Pexels**: https://www.pexels.com/search/vinyl%20stickers/
- **Placeholder**: https://placehold.co/ (para desarrollo)

## Optimización

Recuerda optimizar todas las imágenes antes de subirlas:
- Usa herramientas como TinyPNG, ImageOptim o Squoosh
- Formato WebP cuando sea posible (Next.js lo convierte automáticamente)
- Mantén el peso de cada imagen bajo 200KB

## Nota Importante

Las imágenes actuales en `/images/hero/`, `/images/banner-section/`, etc. son del template original. 
Reemplázalas con imágenes relevantes para tu negocio de pegatinas de vinilo.
