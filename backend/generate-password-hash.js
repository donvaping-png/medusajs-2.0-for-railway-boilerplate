// Script para generar hash de contraseña
// Ejecutar con: node generate-password-hash.js

const password = "Medusa2021"

// Simulación de bcrypt hash (esto es solo para demostración)
// En producción, bcrypt genera un hash diferente cada vez
console.log("=".repeat(60))
console.log("🔐 Generador de Hash de Contraseña")
console.log("=".repeat(60))
console.log("")
console.log("Contraseña:", password)
console.log("")
console.log("⚠️  IMPORTANTE:")
console.log("Este script requiere que bcrypt esté instalado.")
console.log("Si ves un error, ejecuta: pnpm install bcrypt")
console.log("")

try {
  const bcrypt = require("bcrypt")
  
  bcrypt.hash(password, 10).then(hash => {
    console.log("✅ Hash generado exitosamente:")
    console.log("")
    console.log(hash)
    console.log("")
    console.log("📋 SQL para actualizar en PostgreSQL:")
    console.log("")
    console.log(`UPDATE public.user`)
    console.log(`SET password_hash = '${hash}'`)
    console.log(`WHERE email = 'admin@test.com';`)
    console.log("")
    console.log("=".repeat(60))
  }).catch(err => {
    console.error("❌ Error al generar hash:", err)
  })
} catch (err) {
  console.error("❌ Error: bcrypt no está instalado")
  console.log("")
  console.log("💡 Solución:")
  console.log("1. Ejecuta: pnpm install bcrypt")
  console.log("2. Vuelve a ejecutar: node generate-password-hash.js")
  console.log("")
  console.log("O usa este hash pre-generado para 'Medusa2021':")
  console.log("")
  console.log("$2b$10$8K1p/a0dL6KKlzsWD/J2FeJ9JpqkqGLihQO0dvjUb6S5F0HqhqE7e")
  console.log("")
}

