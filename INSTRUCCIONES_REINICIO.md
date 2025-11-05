# Instrucciones para Ver los Cambios en la Homepage

## El problema
Los cambios están guardados correctamente, pero Next.js necesita recompilar la aplicación para mostrarlos.

## Solución: Reinicia el servidor de desarrollo

### Opción 1: Reinicio completo (Recomendado)
1. **Detén el servidor** actual (Ctrl+C en la terminal donde corre `npm run dev`)
2. **Limpia la caché de Next.js**:
   ```bash
   cd storefront
   rm -rf .next
   ```
   O en Windows:
   ```cmd
   cd storefront
   rmdir /s /q .next
   ```
3. **Inicia el servidor de nuevo**:
   ```bash
   npm run dev
   ```

### Opción 2: Reinicio rápido
1. Detén el servidor (Ctrl+C)
2. Inicia de nuevo:
   ```bash
   cd storefront
   npm run dev
   ```

### Opción 3: Hard Refresh en el navegador
Si el servidor ya está corriendo:
1. Abre la página de inicio
2. Presiona **Ctrl+Shift+R** (Windows/Linux) o **Cmd+Shift+R** (Mac)
3. Esto forzará una recarga completa sin caché

## Verificación

Después de reiniciar, deberías ver:

1. **Hero actualizado** con el texto: "Pegatinas de vinilo que destacan"
2. **Sección de características** con 6 beneficios (diseño ilimitado, calidad premium, etc.)
3. **Carrusel de categorías** de pegatinas
4. **Sección de personalización** con lista de beneficios
5. **Casos de uso** en grid de 4 columnas
6. **Proceso en 4 pasos**
7. **Productos populares**
8. **Testimonios** de clientes
9. **CTA final** con fondo de color

## Si aún no ves los cambios

Revisa la consola del navegador (F12) y la terminal donde corre el servidor para ver si hay errores de compilación.

### Errores comunes:

1. **Error de importación**: Verifica que todas las carpetas existan
2. **Error de sintaxis**: Revisa la consola del navegador
3. **Puerto ocupado**: Asegúrate de que solo hay una instancia del servidor corriendo

## Comandos útiles

```bash
# Ver procesos de Node corriendo
tasklist | findstr node

# Matar todos los procesos de Node (Windows)
taskkill /F /IM node.exe

# Luego reinicia el servidor
cd storefront
npm run dev
```
