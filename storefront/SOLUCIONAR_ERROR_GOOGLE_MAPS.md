# ❌ Error: ApiNotActivatedMapError

## El Problema

Ves este error en la consola:
```
Google Maps JavaScript API error: ApiNotActivatedMapError
```

## ✅ Solución Rápida (5 minutos)

### Paso 1: Ve a Google Cloud Console
Abre: https://console.cloud.google.com/

### Paso 2: Selecciona tu proyecto
En la parte superior, asegúrate de tener seleccionado el proyecto correcto.

### Paso 3: Habilita AMBAS APIs
1. En el menú lateral, ve a **APIs & Services** > **Library**
2. Busca y habilita **"Places API"**:
   - Click en "Places API"
   - Click en "Enable"
3. Busca y habilita **"Maps JavaScript API"**:
   - Click en "Maps JavaScript API"
   - Click en "Enable"

**⚠️ IMPORTANTE**: Necesitas habilitar AMBAS APIs para que funcione el autocompletado.

### Paso 4: Espera y recarga
1. Espera 2-3 minutos para que las APIs se activen
2. Reinicia el servidor: `npm run dev`
3. Recarga la página del checkout
4. ¡Listo! El autocompletado debería funcionar

## 🔍 Verificar que está habilitada

1. Ve a **APIs & Services** > **Dashboard**
2. Deberías ver **"Places API"** en la lista de APIs habilitadas
3. Si no aparece, repite el Paso 3

## 💡 Alternativa: Desactivar el Autocompletado

Si no quieres usar Google Places API, simplemente:

1. Abre tu archivo `.env.local`
2. Comenta o elimina la línea:
   ```bash
   # NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key
   ```
3. Reinicia el servidor: `npm run dev`
4. El checkout funcionará con inputs normales (sin autocompletado)

## 📋 APIs que necesitas habilitar

Para que el autocompletado funcione correctamente:

✅ **Places API** - REQUERIDA
✅ **Maps JavaScript API** - REQUERIDA (para cargar la librería de Places)

**Opcionales:**
⚪ Geocoding API - Mejora la precisión

**NO necesitas:**
❌ Maps SDK for Android
❌ Maps SDK for iOS

## 🆘 Aún no funciona?

### Verifica tu API Key

1. Abre `.env.local`
2. Verifica que la línea sea exactamente:
   ```bash
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_real
   ```
3. NO debe tener espacios extras
4. NO debe tener comillas

### Verifica las restricciones

1. Ve a **APIs & Services** > **Credentials**
2. Click en tu API key
3. En **Application restrictions**:
   - Selecciona "HTTP referrers"
   - Agrega: `http://localhost:3000/*`
4. En **API restrictions**:
   - Selecciona "Restrict key"
   - Marca solo **Places API**
5. Guarda los cambios

### Reinicia el servidor

```bash
# Detén el servidor (Ctrl+C)
npm run dev
```

## 💰 Costos

No te preocupes por los costos:
- Google da **$200 USD gratis al mes**
- Autocompletado cuesta $2.83 por 1,000 solicitudes
- Con el crédito gratuito = **~70,000 autocompletados gratis/mes**

Para un e-commerce pequeño/mediano, esto es más que suficiente.

## 📞 Soporte

Si sigues teniendo problemas:
1. Revisa la consola del navegador (F12)
2. Busca el error exacto en Google
3. Verifica que tu cuenta de Google Cloud esté activa
4. Asegúrate de tener una forma de pago agregada (aunque no te cobrarán si no excedes el límite gratuito)
