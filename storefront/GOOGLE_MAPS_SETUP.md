# Google Maps Address Autocomplete Setup

El checkout ahora incluye autocompletado de direcciones usando Google Places API. Esto permite que los usuarios escriban su dirección y automáticamente se completen los campos de ciudad, provincia, código postal y país.

## Características

- ✅ Autocompletado de direcciones en tiempo real
- ✅ Extracción automática de ciudad, provincia, código postal y país
- ✅ Funciona sin API key (fallback a input normal)
- ✅ Compatible con todos los países

## Configuración (Opcional)

Si quieres habilitar el autocompletado de direcciones, necesitas una API key de Google Maps:

### 1. Crear un proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a **APIs & Services** > **Library**
4. Busca y habilita estas APIs (AMBAS REQUERIDAS):
   - **Places API** - Para el autocompletado de direcciones
   - **Maps JavaScript API** - Para cargar la librería de Places
5. Opcional:
   - **Geocoding API** - Mejora la precisión

### 2. Crear una API Key

1. Ve a **APIs & Services** > **Credentials**
2. Click en **Create Credentials** > **API Key**
3. Copia la API key generada

### 3. Restringir la API Key (Recomendado)

Para seguridad, restringe tu API key:

1. Click en la API key que acabas de crear
2. En **Application restrictions**, selecciona **HTTP referrers**
3. Agrega tus dominios:
   - `http://localhost:3000/*` (desarrollo)
   - `https://tudominio.com/*` (producción)
4. En **API restrictions**, selecciona **Restrict key**
5. Selecciona solo **Places API**
6. Guarda los cambios

### 4. Agregar la API Key a tu proyecto

Agrega la siguiente variable de entorno a tu archivo `.env.local`:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
```

### 5. Reiniciar el servidor

```bash
npm run dev
```

## Uso

El autocompletado funciona automáticamente en el campo de dirección del checkout. Cuando el usuario empieza a escribir, aparecerán sugerencias de Google Places.

Al seleccionar una dirección, se autocompletarán:
- Dirección completa
- Ciudad
- Provincia/Estado
- Código postal
- País

## Sin API Key

Si no configuras una API key, el componente funcionará como un input normal sin autocompletado. Esto permite que el checkout funcione sin necesidad de configuración adicional.

## Costos

Google Places API tiene un nivel gratuito generoso:
- **$200 USD de crédito mensual gratis**
- Autocomplete: $2.83 por 1,000 solicitudes
- Con el crédito gratuito: ~70,000 autocompletados gratis al mes

Más información: [Google Maps Pricing](https://mapsplatform.google.com/pricing/)

## Troubleshooting

### El autocompletado no aparece

1. Verifica que la API key esté correctamente configurada en `.env.local`
2. **IMPORTANTE**: Asegúrate de habilitar **Places API** (no Maps JavaScript API) en Google Cloud Console:
   - Ve a [APIs & Services > Library](https://console.cloud.google.com/apis/library)
   - Busca "Places API"
   - Click en "Enable"
3. Revisa la consola del navegador para errores
4. Verifica que la API key no esté restringida incorrectamente

### Error: ApiNotActivatedMapError

Este error significa que no has habilitado la API correcta. Necesitas:
1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Seleccionar tu proyecto
3. Ir a **APIs & Services** > **Library**
4. Buscar "**Places API**" (NO "Maps JavaScript API")
5. Click en "**Enable**"
6. Esperar 1-2 minutos para que se active
7. Recargar la página del checkout

### Error de CORS

Si ves errores de CORS, verifica que tu dominio esté agregado en las restricciones de HTTP referrers de la API key.

### La API key no funciona

1. Verifica que Places API esté habilitada
2. Espera unos minutos después de crear la API key (puede tardar en propagarse)
3. Verifica que no hayas excedido el límite de cuota
