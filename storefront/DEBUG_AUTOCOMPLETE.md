# 🔍 Debug del Autocompletado de Direcciones

## Cómo Verificar que Funciona

### 1. Abre la Consola del Navegador
- Presiona `F12` o `Ctrl+Shift+I` (Windows/Linux)
- Presiona `Cmd+Option+I` (Mac)
- Ve a la pestaña "Console"

### 2. Ve al Checkout
- Navega a `/checkout`
- Haz click en el campo "Address"

### 3. Escribe una Dirección
- Empieza a escribir una dirección real
- Selecciona una opción del dropdown de Google

### 4. Verifica los Logs
Deberías ver dos mensajes en la consola:

```
Extracted address data: {
  address: "123 Main St",
  city: "New York",
  province: "New York",
  postalCode: "10001",
  countryCode: "us"
}

Place selected: {
  address: "123 Main St",
  city: "New York",
  province: "New York",
  postalCode: "10001",
  countryCode: "us"
}
```

## ✅ Si Ves los Logs

Significa que el autocompletado está funcionando correctamente. Los campos deberían llenarse automáticamente.

## ❌ Si NO Ves los Logs

### Problema 1: No aparece "Extracted address data"
- El listener de Google Maps no se está ejecutando
- Verifica que ambas APIs estén habilitadas (Places API + Maps JavaScript API)
- Recarga la página con `Ctrl+Shift+R` (hard reload)

### Problema 2: Aparece "Extracted address data" pero NO "Place selected"
- El callback no se está ejecutando
- Esto es un bug de React - reinicia el servidor: `npm run dev`

### Problema 3: Aparecen ambos logs pero los campos no se llenan
- El estado no se está actualizando
- Verifica que los nombres de los campos coincidan
- Reinicia el servidor

## 🔧 Soluciones Rápidas

### Solución 1: Hard Reload
```
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

### Solución 2: Limpiar Cache y Reiniciar
```bash
# Detén el servidor (Ctrl+C)
rm -rf .next
npm run dev
```

### Solución 3: Verificar que los Datos se Extraen Correctamente

Si ves los logs pero algunos campos están vacíos, puede ser que Google no esté devolviendo esos datos para esa dirección específica. Prueba con diferentes direcciones.

## 📊 Qué Datos Extrae Google

Dependiendo de la dirección, Google puede devolver:

✅ **Siempre disponible:**
- address (calle y número)
- country (país)

⚠️ **A veces disponible:**
- city (ciudad)
- province (estado/provincia)
- postalCode (código postal)

Algunas direcciones no tienen todos los componentes. Por ejemplo:
- Direcciones rurales pueden no tener código postal
- Algunas ciudades pequeñas pueden no estar en la base de datos

## 🧪 Direcciones de Prueba

Prueba con estas direcciones que tienen todos los componentes:

**Estados Unidos:**
```
1600 Amphitheatre Parkway, Mountain View, CA
```

**España:**
```
Calle Gran Vía 1, Madrid
```

**México:**
```
Avenida Paseo de la Reforma 222, Ciudad de México
```

**Argentina:**
```
Avenida Corrientes 1234, Buenos Aires
```

## 🐛 Errores Comunes

### Error: "Cannot read property 'getPlace' of null"
- El autocomplete no se inicializó correctamente
- Espera a que cargue completamente la página
- Verifica que la API key sea correcta

### Error: "place.address_components is undefined"
- Seleccionaste una opción antes de que Google terminara de cargar
- Vuelve a seleccionar la dirección

### Los campos se llenan pero con valores incorrectos
- Google puede estar interpretando mal la dirección
- Prueba con una dirección más específica
- Agrega el número de la calle

## 💡 Tips

1. **Sé específico**: Escribe el número de la calle para mejores resultados
2. **Espera las sugerencias**: No presiones Enter, selecciona del dropdown
3. **Verifica los logs**: Siempre revisa la consola para ver qué datos se extrajeron
4. **Prueba diferentes direcciones**: Algunas tienen más información que otras

## 🆘 Aún No Funciona?

Si después de todo esto no funciona:

1. Verifica que tengas las dos APIs habilitadas:
   - Places API ✓
   - Maps JavaScript API ✓

2. Verifica tu `.env.local`:
   ```bash
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_key_real
   ```

3. Reinicia completamente:
   ```bash
   # Detén el servidor
   rm -rf .next node_modules/.cache
   npm run dev
   ```

4. Prueba en modo incógnito del navegador

5. Revisa si hay errores en la consola del navegador
