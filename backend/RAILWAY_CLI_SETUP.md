# Generar Migraciones con Railway CLI

## Paso 1: Instalar Railway CLI

Abre PowerShell como **Administrador** y ejecuta:

```powershell
iwr https://railway.app/install.ps1 | iex
```

O si prefieres usar npm:

```bash
npm install -g @railway/cli
```

## Paso 2: Verificar instalación

```bash
railway --version
```

Deberías ver algo como: `railway version 3.x.x`

## Paso 3: Login en Railway

```bash
railway login
```

Esto abrirá tu navegador para autenticarte.

## Paso 4: Vincular tu proyecto

Desde el directorio `backend/`:

```bash
cd backend
railway link
```

Selecciona:
1. Tu proyecto (probablemente "cortearte" o similar)
2. El servicio "backend"

## Paso 5: Generar las migraciones

```bash
railway run npx medusa db:generate bundledProduct
```

Este comando:
- Se conecta a tu base de datos de Railway
- Ejecuta el comando de generación de migraciones
- Guarda las migraciones en `src/modules/bundled-product/migrations/`

## Paso 6: Verificar las migraciones generadas

```bash
ls src/modules/bundled-product/migrations/
```

Deberías ver un archivo como: `Migration20241106XXXXXX.ts`

## Paso 7: Commitear y desplegar

```bash
git add .
git commit -m "Add bundled products migrations"
git push origin main
```

Railway detectará los cambios y:
1. Ejecutará `pnpm install`
2. Ejecutará `pnpm migrate` (que corre las migraciones)
3. Ejecutará `pnpm build`
4. Iniciará el servidor

## Paso 8: Verificar en Railway

Ve a tu proyecto en Railway y revisa los logs:

```bash
railway logs
```

O en el dashboard de Railway, busca líneas como:
```
✓ Running migrations...
✓ Migration20241106XXXXXX executed successfully
```

## Comandos Útiles de Railway CLI

### Ver logs en tiempo real
```bash
railway logs --follow
```

### Ejecutar comandos en Railway
```bash
railway run <comando>
```

### Ver variables de entorno
```bash
railway variables
```

### Abrir el dashboard
```bash
railway open
```

### Desplegar manualmente
```bash
railway up
```

## Troubleshooting

### Error: "railway: command not found"

Cierra y vuelve a abrir tu terminal después de instalar.

### Error: "No project linked"

Ejecuta `railway link` y selecciona tu proyecto.

### Error: "Authentication required"

Ejecuta `railway login` nuevamente.

### Las migraciones no se generan

Verifica que estés en el directorio `backend/` y que el módulo esté correctamente configurado en `medusa-config.js`.

### Error de conexión a la base de datos

Railway CLI usa automáticamente las variables de entorno de tu servicio, así que debería conectarse sin problemas.

## Alternativa: Si Railway CLI no funciona

Si tienes problemas con Railway CLI, puedes crear las migraciones manualmente. Ejecuta en tu terminal:

```bash
# Desde el directorio backend/
node -e "console.log('Migration' + new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14))"
```

Esto te dará un nombre como `Migration20241106144530`. Luego crea el archivo manualmente siguiendo la estructura de otras migraciones.
