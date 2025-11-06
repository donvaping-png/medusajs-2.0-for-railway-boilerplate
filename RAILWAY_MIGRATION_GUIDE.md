# Guía para Ejecutar Migraciones en Railway

## 🎯 Método Recomendado: Modificar Start Command Temporalmente

### Paso 1: Acceder a Railway Dashboard
1. Ve a https://railway.app
2. Selecciona tu proyecto "considerate-creation"
3. Haz clic en el servicio "Backend"

### Paso 2: Modificar el Start Command
1. Ve a la pestaña **Settings**
2. Busca la sección **Deploy**
3. Encuentra **Custom Start Command** o **Start Command**
4. Cambia el comando actual por:
   ```bash
   pnpm migrate && pnpm start
   ```
   O si no funciona, usa:
   ```bash
   npx medusa db:migrate && pnpm start
   ```

### Paso 3: Hacer Redeploy
1. Ve a la pestaña **Deployments**
2. Haz clic en **Deploy** o **Redeploy**
3. Espera a que termine el deployment
4. Revisa los logs para confirmar que la migración se ejecutó

### Paso 4: Restaurar el Start Command Original
1. Una vez que veas en los logs que la migración se completó exitosamente
2. Vuelve a **Settings** → **Deploy** → **Start Command**
3. Restaura el comando original:
   ```bash
   pnpm start
   ```
4. Guarda los cambios

## 🔧 Método Alternativo: Railway CLI con Shell

Si prefieres usar Railway CLI:

```bash
# Desde tu terminal local
railway shell --service Backend

# Dentro del shell de Railway, ejecuta:
cd backend
npx medusa db:migrate
exit
```

## 📋 Verificar que la Migración Funcionó

Después de ejecutar la migración, verifica en los logs que aparezca algo como:

```
✅ Migration completed successfully
✅ Applied migration: variant_images_table
```

## ⚠️ Notas Importantes

1. **Backup**: Railway hace backups automáticos, pero es buena práctica verificar
2. **Downtime**: El método del start command causará un breve downtime durante el redeploy
3. **Una sola vez**: Solo necesitas ejecutar la migración una vez
4. **Verificación**: Después de la migración, el admin dashboard mostrará la nueva sección de "Variant Images"

## 🎨 Después de la Migración

Una vez completada la migración:

1. Accede al admin dashboard: https://backend-production-a29d.up.railway.app/app
2. Ve a cualquier producto
3. Selecciona una variante
4. Deberías ver una nueva sección llamada "Variant Images"
5. Ahí podrás subir imágenes específicas para cada variante

## 🆘 Si Algo Sale Mal

Si la migración falla:

1. Revisa los logs en Railway Dashboard
2. Verifica que las variables de entorno estén correctas (DATABASE_URL)
3. Asegúrate de que el servicio de PostgreSQL esté corriendo
4. Contacta si necesitas ayuda para revertir cambios

## 📚 Recursos

- [Railway Docs - Running Commands](https://docs.railway.app/guides/running-commands)
- [MedusaJS Migrations](https://docs.medusajs.com/learn/fundamentals/data-models/migrations)
