# Generar Migraciones en Railway

## Opción 1: Usar Railway CLI (Recomendado)

Railway CLI te permite ejecutar comandos directamente en tu servicio de Railway.

### Paso 1: Instalar Railway CLI

```bash
# Windows (PowerShell como administrador)
iwr https://railway.app/install.ps1 | iex

# O con npm
npm install -g @railway/cli
```

### Paso 2: Login en Railway

```bash
railway login
```

### Paso 3: Vincular tu proyecto

```bash
cd backend
railway link
```

Selecciona tu proyecto y servicio de backend.

### Paso 4: Ejecutar el comando de generación

```bash
railway run npx medusa db:generate bundledProduct
```

Este comando:
1. Se conecta a tu base de datos de Railway
2. Genera las migraciones
3. Las guarda en `src/modules/bundled-product/migrations/`

### Paso 5: Commitear y desplegar

```bash
git add .
git commit -m "Add bundled products migrations"
git push origin main
```

Railway ejecutará automáticamente `pnpm migrate` al desplegar.

## Opción 2: Generar Localmente con Docker (Más Simple)

Si prefieres no instalar Railway CLI, usa Docker localmente:

### Windows

```bash
cd backend
.\scripts\generate-migrations-local.bat
```

### Linux/Mac

```bash
cd backend
chmod +x scripts/generate-migrations-local.sh
./scripts/generate-migrations-local.sh
```

Esto:
1. Crea un contenedor temporal de PostgreSQL
2. Genera las migraciones
3. Limpia el contenedor
4. Las migraciones quedan listas para commitear

## Verificar que las Migraciones se Ejecutaron

Después de desplegar, verifica en los logs de Railway:

```bash
railway logs
```

Deberías ver algo como:
```
Running migrations...
✓ Migration executed successfully
```
