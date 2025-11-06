# 🚀 Pasos Rápidos - Habilitar Autocompletado de Direcciones

## ⏱️ 5 minutos

### 1️⃣ Google Cloud Console
```
https://console.cloud.google.com/
```
- Crea un proyecto (o selecciona uno existente)

### 2️⃣ Habilitar APIs Necesarias
```
APIs & Services > Library
```
Habilita AMBAS:
1. Buscar "**Places API**" > Enable
2. Buscar "**Maps JavaScript API**" > Enable

⚠️ **IMPORTANTE**: Necesitas habilitar AMBAS APIs

### 3️⃣ Crear API Key
```
APIs & Services > Credentials > Create Credentials > API Key
```
- Copia la API key que te dan

### 4️⃣ Agregar a .env.local
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...tu_api_key_aqui
```

### 5️⃣ Reiniciar servidor
```bash
npm run dev
```

## ✅ Verificar que funciona

1. Ve a `/checkout`
2. Empieza a escribir una dirección
3. Deberían aparecer sugerencias de Google

## ❌ Si ves error "ApiNotActivatedMapError"

Significa que no habilitaste ambas APIs. Necesitas:
1. **Places API** - Para el autocompletado
2. **Maps JavaScript API** - Para cargar la librería

Ve al paso 2️⃣ y habilita AMBAS APIs.

## 💡 Opcional: Restringir API Key (Seguridad)

```
Credentials > Click en tu API Key > Application restrictions
```

**HTTP referrers:**
- `http://localhost:3000/*`
- `https://tudominio.com/*`

**API restrictions:**
- Restrict key
- Selecciona solo: Places API

## 🆓 Es gratis?

Sí, para la mayoría de casos:
- $200 USD de crédito mensual gratis
- ~70,000 autocompletados gratis al mes
- Solo pagas si excedes ese límite

## 🔧 Alternativa sin Google Maps

Si no quieres configurar Google Maps:

1. Comenta la línea en `.env.local`:
   ```bash
   # NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
   ```

2. El checkout funcionará con inputs normales (sin autocompletado)

---

**Documentación completa:**
- `GOOGLE_MAPS_SETUP.md` - Guía detallada
- `SOLUCIONAR_ERROR_GOOGLE_MAPS.md` - Troubleshooting
