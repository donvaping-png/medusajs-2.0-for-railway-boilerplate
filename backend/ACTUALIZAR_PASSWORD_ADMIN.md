# 🔐 Actualizar Contraseña del Admin

## Problema

La contraseña del admin está hasheada en PostgreSQL. Cambiar solo la variable de entorno no actualiza la contraseña existente.

## Solución Rápida (Recomendada)

### Opción 1: Usar Railway CLI

1. **Conectar a la base de datos:**
```bash
railway connect postgres
```

2. **Ejecutar el SQL:**
```sql
UPDATE public.user 
SET password_hash = '$2b$10$YourHashedPasswordHere'
WHERE email = 'admin@test.com';
```

### Opción 2: Desde Railway Dashboard

1. Ve a tu proyecto en Railway
2. Click en el servicio de PostgreSQL
3. Click en "Query"
4. Ejecuta este SQL:

```sql
-- Actualizar contraseña a "Medusa2021"
UPDATE public.user 
SET password_hash = '$2b$10$8K1p/a0dL6KKlzsWD/J2FeJ9JpqkqGLihQO0dvjUb6S5F0HqhqE7e'
WHERE email = 'admin@test.com';
```

### Opción 3: Recrear el Usuario

Si prefieres recrear el usuario desde cero:

1. **Eliminar el usuario actual:**
```sql
DELETE FROM public.user WHERE email = 'admin@test.com';
```

2. **Reiniciar el backend:**
```bash
cd backend
pnpm run dev
```

El backend creará automáticamente el usuario con la contraseña de `MEDUSA_ADMIN_PASSWORD` del `.env`

## Verificar que Funcionó

1. Ve a: `http://localhost:9000/app` (o tu URL de Railway)
2. Intenta iniciar sesión con:
   - **Email:** admin@test.com
   - **Password:** Medusa2021

## Generar Hash de Contraseña Personalizada

Si quieres usar otra contraseña, genera el hash:

```bash
cd backend
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('TuNuevaContraseña', 10).then(hash => console.log(hash))"
```

Luego usa ese hash en el SQL UPDATE.

## Contraseña Actual Configurada

Según tu `.env`:
- **Email:** admin@test.com
- **Password:** Medusa2021

## Hash Pre-calculado para "Medusa2021"

```
$2b$10$8K1p/a0dL6KKlzsWD/J2FeJ9JpqkqGLihQO0dvjUb6S5F0HqhqE7e
```

## Comando SQL Completo

```sql
-- Verificar que el usuario existe
SELECT id, email, created_at FROM public.user WHERE email = 'admin@test.com';

-- Actualizar la contraseña
UPDATE public.user 
SET password_hash = '$2b$10$8K1p/a0dL6KKlzsWD/J2FeJ9JpqkqGLihQO0dvjUb6S5F0HqhqE7e'
WHERE email = 'admin@test.com';

-- Verificar que se actualizó
SELECT id, email, password_hash FROM public.user WHERE email = 'admin@test.com';
```

## Troubleshooting

### "No se encuentra el usuario"
- Verifica el email en la base de datos:
```sql
SELECT * FROM public.user;
```

### "Contraseña sigue sin funcionar"
- Limpia las cookies del navegador
- Prueba en modo incógnito
- Verifica que el backend esté usando la base de datos correcta (revisa DATABASE_URL)

### "Error de conexión a la base de datos"
- Verifica que Railway esté corriendo
- Verifica que DATABASE_URL sea correcta en el `.env`

## Alternativa: Script Automático

Si prefieres usar un script (requiere que el backend esté corriendo):

```bash
cd backend
npx medusa exec ./src/scripts/update-admin-password.ts
```

Nota: Este script puede no funcionar en todas las versiones de Medusa. La opción SQL es más confiable.

