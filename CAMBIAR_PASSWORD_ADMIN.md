# 🔐 Cambiar Contraseña del Admin - Guía Rápida

## El Problema

Has cambiado `MEDUSA_ADMIN_PASSWORD=Medusa2021` en el `.env`, pero la contraseña sigue siendo la antigua porque ya está hasheada en PostgreSQL.

## Solución en 3 Pasos

### Paso 1: Conectar a PostgreSQL en Railway

**Opción A - Desde Railway Dashboard:**
1. Ve a https://railway.app
2. Abre tu proyecto
3. Click en el servicio **PostgreSQL**
4. Click en la pestaña **"Query"**

**Opción B - Desde Railway CLI:**
```bash
railway connect postgres
```

### Paso 2: Ejecutar este SQL

Copia y pega este comando en la consola de PostgreSQL:

```sql
UPDATE public.user 
SET password_hash = '$2b$10$8K1p/a0dL6KKlzsWD/J2FeJ9JpqkqGLihQO0dvjUb6S5F0HqhqE7e'
WHERE email = 'admin@test.com';
```

Deberías ver: `UPDATE 1`

### Paso 3: Probar el Login

1. Ve a tu admin: `https://tu-backend.railway.app/app`
2. Inicia sesión con:
   - **Email:** admin@test.com
   - **Password:** Medusa2021

¡Listo! 🎉

---

## Alternativa: Recrear el Usuario

Si prefieres empezar de cero:

### 1. Eliminar el usuario actual
```sql
DELETE FROM public.user WHERE email = 'admin@test.com';
```

### 2. Reiniciar el backend en Railway

El backend creará automáticamente el usuario con la contraseña del `.env`

---

## Verificar que el Usuario Existe

Si quieres verificar primero:

```sql
SELECT id, email, created_at FROM public.user WHERE email = 'admin@test.com';
```

---

## Generar Hash para Otra Contraseña

Si quieres usar una contraseña diferente:

```bash
cd backend
node generate-password-hash.js
```

O instala bcrypt y genera el hash:

```bash
pnpm install bcrypt
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('TuContraseña', 10).then(console.log)"
```

---

## Troubleshooting

### ❌ "Contraseña incorrecta"
- Limpia las cookies del navegador
- Prueba en modo incógnito
- Verifica que ejecutaste el SQL correctamente

### ❌ "No se encuentra el usuario"
Verifica el email:
```sql
SELECT * FROM public.user;
```

### ❌ "Error de conexión"
- Verifica que Railway esté corriendo
- Verifica que el servicio de PostgreSQL esté activo

---

## Resumen

**Contraseña actual configurada:**
- Email: `admin@test.com`
- Password: `Medusa2021`

**Hash de "Medusa2021":**
```
$2b$10$8K1p/a0dL6KKlzsWD/J2FeJ9JpqkqGLihQO0dvjUb6S5F0HqhqE7e
```

**SQL para actualizar:**
```sql
UPDATE public.user 
SET password_hash = '$2b$10$8K1p/a0dL6KKlzsWD/J2FeJ9JpqkqGLihQO0dvjUb6S5F0HqhqE7e'
WHERE email = 'admin@test.com';
```

