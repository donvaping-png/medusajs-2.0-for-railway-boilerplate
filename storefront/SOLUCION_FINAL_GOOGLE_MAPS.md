# ✅ Solución Final - ApiNotActivatedMapError

## El Problema Real

El error `ApiNotActivatedMapError` aparece porque Google Places Autocomplete requiere **DOS APIs**, no una:

1. ✅ **Places API** - Para el autocompletado
2. ✅ **Maps JavaScript API** - Para cargar la librería

## 🎯 Solución en 3 Pasos

### 1. Ve a Google Cloud Console
https://console.cloud.google.com/apis/library

### 2. Habilita AMBAS APIs

**Primera API:**
- Busca: "Places API"
- Click en "Places API"
- Click en "Enable"

**Segunda API:**
- Busca: "Maps JavaScript API"
- Click en "Maps JavaScript API"  
- Click en "Enable"

### 3. Espera y Reinicia

```bash
# Espera 2-3 minutos
# Luego reinicia el servidor
npm run dev
```

## ✅ Verificar que Funcionó

1. Ve a: https://console.cloud.google.com/apis/dashboard
2. Deberías ver AMBAS APIs en la lista:
   - ✓ Places API
   - ✓ Maps JavaScript API

## 🔧 Si Aún No Funciona

### Verifica tu .env.local

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...tu_key_real
```

- Sin espacios
- Sin comillas
- La key completa

### Verifica las Restricciones

1. Ve a: https://console.cloud.google.com/apis/credentials
2. Click en tu API Key
3. **Application restrictions:**
   - HTTP referrers
   - Agrega: `http://localhost:3000/*`
4. **API restrictions:**
   - Restrict key
   - Selecciona: Places API Y Maps JavaScript API
5. Guarda

### Reinicia Todo

```bash
# Detén el servidor (Ctrl+C)
# Limpia el cache
rm -rf .next
# Reinicia
npm run dev
```

## 💡 Alternativa: Sin Google Maps

Si no quieres lidiar con esto ahora:

```bash
# En .env.local, comenta la línea:
# NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
```

El checkout funcionará perfectamente con inputs normales.

## 📊 Resumen de Costos

- **Gratis**: $200 USD/mes de crédito
- **Places Autocomplete**: $2.83 por 1,000 solicitudes
- **Maps JavaScript API**: $7 por 1,000 cargas
- **Total gratis/mes**: ~25,000 autocompletados

Para un e-commerce pequeño/mediano, esto es suficiente.

## 🎓 Por Qué Necesitas Ambas APIs

- **Maps JavaScript API**: Carga la librería base de Google Maps
- **Places API**: Proporciona los datos de autocompletado

Es como necesitar tanto el navegador (Maps JS) como el contenido (Places).

---

**¿Funcionó?** Si sigues teniendo problemas, verifica:
1. Que ambas APIs estén habilitadas
2. Que la API key sea correcta
3. Que hayas esperado 2-3 minutos después de habilitar
4. Que hayas reiniciado el servidor
