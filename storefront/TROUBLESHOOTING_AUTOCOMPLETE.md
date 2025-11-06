# 🔧 Troubleshooting - Autocompletado No Funciona

## Síntoma: No aparece el autocompletado

### ✅ Solución Rápida

1. **Abre la consola del navegador** (F12)
2. **Busca este mensaje**: "Google Maps API loaded successfully"
3. **Si NO aparece**, sigue estos pasos:

#### Paso 1: Verifica la API Key

```bash
# Abre storefront/.env.local
# Verifica que la línea sea exactamente así (sin espacios, sin comillas):
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...tu_key_completa
```

#### Paso 2: Verifica las APIs Habilitadas

Ve a: https://console.cloud.google.com/apis/dashboard

Deberías ver AMBAS:
- ✅ Places API
- ✅ Maps JavaScript API

Si no están, ve a Library y habilítalas.

#### Paso 3: Hard Reload

```
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

#### Paso 4: Limpia Cache y Reinicia

```bash
# Detén el servidor (Ctrl+C)
rm -rf .next
npm run dev
```

## Síntoma: Aparece el autocompletado pero no llena los campos

### ✅ Solución

1. **Abre la consola** (F12)
2. **Selecciona una dirección**
3. **Busca estos mensajes**:
   - "Extracted address data: {...}"
   - "Place selected: {...}"

#### Si NO ves "Extracted address data"
- El listener no se está ejecutando
- Reinicia el servidor: `npm run dev`
- Prueba con otra dirección

#### Si ves "Extracted address data" pero NO "Place selected"
- El callback no se está ejecutando
- Verifica que no haya errores en la consola
- Reinicia el servidor

#### Si ves ambos mensajes pero los campos no se llenan
- Verifica que los datos extraídos no estén vacíos
- Algunas direcciones no tienen todos los componentes
- Prueba con una dirección más completa

## Direcciones de Prueba Completas

Usa estas direcciones que tienen TODOS los componentes:

**Estados Unidos:**
```
1600 Amphitheatre Parkway, Mountain View, CA 94043
```

**España:**
```
Calle de Alcalá 1, 28014 Madrid
```

**México:**
```
Avenida Paseo de la Reforma 222, Juárez, 06600 Ciudad de México
```

**Argentina:**
```
Avenida Corrientes 1234, C1043 CABA, Buenos Aires
```

## Errores Comunes en la Consola

### "ApiNotActivatedMapError"
**Solución**: Habilita Maps JavaScript API
- Ve a: https://console.cloud.google.com/apis/library
- Busca: "Maps JavaScript API"
- Click en "Enable"
- Espera 2-3 minutos
- Reinicia: `npm run dev`

### "RefererNotAllowedMapError"
**Solución**: Agrega tu dominio a las restricciones
- Ve a: https://console.cloud.google.com/apis/credentials
- Click en tu API Key
- Application restrictions > HTTP referrers
- Agrega: `http://localhost:3000/*`
- Guarda

### "Failed to initialize Google Places Autocomplete"
**Solución**: Google Maps no se cargó correctamente
- Verifica tu conexión a internet
- Verifica que la API key sea correcta
- Recarga la página con Ctrl+Shift+R

## Checklist Completo

Verifica TODOS estos puntos:

- [ ] API Key configurada en `.env.local`
- [ ] Places API habilitada en Google Cloud
- [ ] Maps JavaScript API habilitada en Google Cloud
- [ ] Servidor reiniciado después de cambios
- [ ] Cache del navegador limpiado (Ctrl+Shift+R)
- [ ] Consola del navegador abierta para ver logs
- [ ] No hay errores en la consola
- [ ] Mensaje "Google Maps API loaded successfully" aparece
- [ ] Probado con direcciones completas

## Última Opción: Desactivar Temporalmente

Si nada funciona y necesitas que el checkout funcione YA:

```bash
# En .env.local, comenta la línea:
# NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...

# Reinicia:
npm run dev
```

El checkout funcionará con inputs normales (sin autocompletado).

## Logs Esperados

Cuando TODO funciona correctamente, deberías ver en la consola:

```
Google Maps API loaded successfully
Extracted address data: {
  address: "1600 Amphitheatre Parkway",
  city: "Mountain View",
  province: "California",
  postalCode: "94043",
  countryCode: "us"
}
Place selected: {
  address: "1600 Amphitheatre Parkway",
  city: "Mountain View",
  province: "California",
  postalCode: "94043",
  countryCode: "us"
}
```

Y los campos del formulario se llenan automáticamente.

## ¿Aún No Funciona?

1. Toma un screenshot de la consola del navegador
2. Verifica que no haya errores rojos
3. Verifica que aparezca "Google Maps API loaded successfully"
4. Prueba en modo incógnito del navegador
5. Prueba en otro navegador
