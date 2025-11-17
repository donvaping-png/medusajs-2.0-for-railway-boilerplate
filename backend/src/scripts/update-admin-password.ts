/**
 * Script para actualizar la contraseña del usuario admin
 * Ejecutar con: npx medusa exec ./src/scripts/update-admin-password.ts
 */

import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function updateAdminPassword(container: MedusaContainer) {
  console.log("🔐 Actualizando contraseña del usuario admin...")

  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  try {
    // Buscar el usuario admin
    const { data: users } = await query.graph({
      entity: "user",
      fields: ["id", "email"],
      filters: {
        email: "admin@test.com"
      }
    })

    if (!users || users.length === 0) {
      console.error("❌ No se encontró el usuario admin@test.com")
      console.log("💡 Verifica que el email sea correcto en MEDUSA_ADMIN_EMAIL")
      return
    }

    const adminUser = users[0]
    console.log(`✅ Usuario encontrado: ${adminUser.email} (ID: ${adminUser.id})`)

    // La nueva contraseña
    const newPassword = "Medusa2021"

    // Hashear la contraseña usando bcrypt
    const bcrypt = require("bcrypt")
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Actualizar la contraseña en la base de datos
    // Nota: Esto requiere acceso directo a la base de datos
    const { MikroORM } = require("@mikro-orm/core")
    const orm = container.resolve("__mikro_orm__")
    
    if (!orm) {
      console.error("❌ No se pudo acceder a MikroORM")
      console.log("💡 Intenta actualizar la contraseña manualmente con SQL")
      console.log(`
SQL para ejecutar en PostgreSQL:

UPDATE public.user 
SET password_hash = '${hashedPassword}'
WHERE email = 'admin@test.com';
      `)
      return
    }

    const em = orm.em.fork()
    
    await em.nativeUpdate(
      "user",
      { email: "admin@test.com" },
      { password_hash: hashedPassword }
    )

    console.log("✅ Contraseña actualizada exitosamente")
    console.log(`
📧 Email: admin@test.com
🔑 Nueva contraseña: ${newPassword}
    `)

  } catch (error) {
    console.error("❌ Error al actualizar la contraseña:", error)
    console.log("\n💡 Solución alternativa: Ejecuta este SQL directamente en PostgreSQL:")
    
    const bcrypt = require("bcrypt")
    const hashedPassword = await bcrypt.hash("Medusa2021", 10)
    
    console.log(`
UPDATE public.user 
SET password_hash = '${hashedPassword}'
WHERE email = 'admin@test.com';
    `)
  }
}

