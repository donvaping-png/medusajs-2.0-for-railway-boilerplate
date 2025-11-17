# Integración del Configurador con Medusa

## 📦 Preparación en el Backend (Medusa)

### 1. Crear Producto Base para Pegatinas Personalizadas

En el admin de Medusa, crea un producto especial para pegatinas personalizadas:

```
Título: Pegatina Personalizada
Handle: custom-sticker
Descripción: Pegatina personalizada con configuración avanzada
```

Crea variantes para cada subcategoría:
- `custom-sticker-pegatinas-holograficas`
- `custom-sticker-pegatinas-broqueladas`
- etc.

### 2. Extender el Modelo de Line Item

Necesitas permitir metadata personalizada en los line items del carrito.

Crea un archivo `backend/src/models/line-item.ts`:

```typescript
import { LineItem as MedusaLineItem } from "@medusajs/medusa"
import { Column, Entity } from "typeorm"

@Entity()
export class LineItem extends MedusaLineItem {
  @Column({ type: "jsonb", nullable: true })
  custom_metadata?: {
    configurationType?: string
    category?: string
    subcategory?: string
    type?: string
    shape?: string
    material?: string
    finish?: string
    width?: number
    height?: number
    customQuantity?: number
    imageUrl?: string
  }
}
```

### 3. Crear Endpoint para Subir Imágenes

Crea `backend/src/api/store/custom-stickers/upload/route.ts`:

```typescript
import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import { MedusaError } from "@medusajs/utils"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const fileService = req.scope.resolve("fileService")
    
    // Obtener el archivo del request
    const files = req.files as Express.Multer.File[]
    
    if (!files || files.length === 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "No file provided"
      )
    }

    const file = files[0]
    
    // Validar tipo de archivo
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"]
    if (!allowedTypes.includes(file.mimetype)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Invalid file type. Only JPG and PNG are allowed"
      )
    }

    // Subir archivo
    const result = await fileService.upload(file)

    res.json({
      url: result.url,
      key: result.key,
    })
  } catch (error) {
    res.status(400).json({
      message: error.message,
    })
  }
}
```

### 4. Crear Endpoint para Calcular Precios

Crea `backend/src/api/store/custom-stickers/calculate-price/route.ts`:

```typescript
import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa"

interface PriceCalculationRequest {
  width: number
  height: number
  quantity: number
  material: string
  category: string
  subcategory: string
}

export async function POST(
  req: MedusaRequest<PriceCalculationRequest>,
  res: MedusaResponse
): Promise<void> {
  const { width, height, quantity, material, category, subcategory } = req.body

  // Lógica de cálculo de precios
  const area = width * height
  const basePrice = 0.5 // €0.50 por cm²

  // Obtener multiplicador de material desde configuración
  const materialMultipliers: Record<string, number> = {
    holografico: 1.5,
    vinilo_broquelado: 1.3,
    vinilo_transfer: 1.2,
    metalizado_plata: 1.6,
    metalizado_oro: 1.7,
    // ... más materiales
  }

  const materialMultiplier = materialMultipliers[material] || 1.0

  // Calcular precio por unidad
  let pricePerUnit = area * basePrice * materialMultiplier

  // Descuentos por volumen
  let discountPercentage = 0
  if (quantity >= 1000) discountPercentage = 30
  else if (quantity >= 500) discountPercentage = 25
  else if (quantity >= 250) discountPercentage = 20
  else if (quantity >= 100) discountPercentage = 15
  else if (quantity >= 50) discountPercentage = 10
  else if (quantity >= 25) discountPercentage = 5

  const discount = (pricePerUnit * discountPercentage) / 100
  pricePerUnit -= discount

  // Precio mínimo
  pricePerUnit = Math.max(pricePerUnit, 0.5)

  const totalPrice = pricePerUnit * quantity

  res.json({
    unitPrice: Math.round(pricePerUnit * 100) / 100,
    totalPrice: Math.round(totalPrice * 100) / 100,
    discount: Math.round(discount * quantity * 100) / 100,
    discountPercentage,
  })
}
```

## 🎨 Actualización del Frontend

### 1. Actualizar Hook para Usar API de Precios

Modifica `storefront/src/hooks/useStickerConfigurator.ts`:

```typescript
// Añadir al hook
const [isCalculatingPrice, setIsCalculatingPrice] = useState(false)

// Reemplazar calculatePrice con llamada a API
const fetchPrice = useCallback(async () => {
  setIsCalculatingPrice(true)
  try {
    const response = await fetch('/api/custom-stickers/calculate-price', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        width: currentDimensions.width,
        height: currentDimensions.height,
        quantity: config.quantity,
        material: config.material,
        category: categorySlug,
        subcategory: subcategoryConfig.slug,
      }),
    })
    
    const data = await response.json()
    return data.totalPrice
  } catch (error) {
    console.error('Error calculating price:', error)
    return 0
  } finally {
    setIsCalculatingPrice(false)
  }
}, [config, currentDimensions, categorySlug, subcategoryConfig])

// Usar useEffect para actualizar precio cuando cambie la configuración
useEffect(() => {
  fetchPrice().then(setCurrentPrice)
}, [fetchPrice])
```

### 2. Actualizar Función de Subida de Imagen

Modifica `storefront/src/lib/helpers/sticker-cart.ts`:

```typescript
export async function uploadStickerImage(file: File): Promise<{
  success: boolean
  url?: string
  error?: string
}> {
  try {
    const validation = validateImageForUpload(file)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/custom-stickers/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Error al subir la imagen')
    }

    const data = await response.json()
    return {
      success: true,
      url: data.url,
    }
  } catch (error) {
    console.error('[uploadStickerImage] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al subir imagen',
    }
  }
}
```

### 3. Actualizar Función de Añadir al Carrito

Modifica `storefront/src/lib/helpers/sticker-cart.ts`:

```typescript
export async function addCustomStickerToCart(
  payload: AddToCartPayload,
  cartId?: string
): Promise<{ success: boolean; message: string; cart?: any }> {
  try {
    // Obtener o crear carrito
    let currentCartId = cartId
    if (!currentCartId) {
      const cartResponse = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ region_id: 'tu-region-id' }),
      })
      const cartData = await cartResponse.json()
      currentCartId = cartData.cart.id
    }

    // Añadir item al carrito
    const response = await fetch(`/api/cart/${currentCartId}/line-items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        variant_id: payload.productId,
        quantity: payload.quantity,
        metadata: payload.metadata,
      }),
    })

    if (!response.ok) {
      throw new Error('Error al añadir al carrito')
    }

    const data = await response.json()
    return {
      success: true,
      message: 'Producto añadido al carrito',
      cart: data.cart,
    }
  } catch (error) {
    console.error('[addCustomStickerToCart] Error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}
```

### 4. Actualizar Componente Configurador

Modifica `storefront/src/components/organisms/StickerConfigurator/StickerConfigurator.tsx`:

```typescript
const handleAddToCart = async () => {
  if (!validation.isValid) {
    alert('Por favor completa todos los campos requeridos')
    return
  }

  try {
    // 1. Subir imagen si existe
    let imageUrl: string | undefined
    if (config.image?.file) {
      const uploadResult = await uploadStickerImage(config.image.file)
      if (!uploadResult.success) {
        alert(`Error al subir imagen: ${uploadResult.error}`)
        return
      }
      imageUrl = uploadResult.url
    }

    // 2. Preparar payload
    const payload: AddToCartPayload = {
      productId: `custom-sticker-${categorySlug}-${subcategoryConfig.slug}`,
      quantity: 1,
      unitPrice: currentPrice,
      metadata: {
        configurationType: 'custom_sticker',
        category: categorySlug,
        subcategory: subcategoryConfig.slug,
        type: config.type,
        shape: config.shape,
        material: config.material,
        finish: config.finish,
        width: currentDimensions.width,
        height: currentDimensions.height,
        customQuantity: config.quantity,
        imageUrl,
      },
    }

    // 3. Añadir al carrito
    const result = await addCustomStickerToCart(payload)
    
    if (result.success) {
      alert('¡Producto añadido al carrito!')
      // Opcional: redirigir al carrito
      // router.push('/cart')
    } else {
      alert(`Error: ${result.message}`)
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Error al añadir al carrito')
  }
}
```

## 🔄 Flujo Completo

1. Usuario configura la pegatina
2. Frontend calcula precio en tiempo real usando API
3. Usuario sube imagen → se guarda en MinIO/S3
4. Usuario hace clic en "Añadir al Carrito"
5. Frontend crea/obtiene carrito
6. Frontend añade line item con metadata personalizada
7. Backend guarda configuración en metadata del line item
8. Usuario procede al checkout normalmente

## 📝 Consideraciones

### Precio en el Carrito
El precio debe calcularse en el backend para evitar manipulación. Considera:
- Validar dimensiones y cantidad en el backend
- Recalcular precio al añadir al carrito
- Guardar configuración en metadata para referencia

### Imágenes
- Guardar referencia a la imagen en metadata
- Considerar límite de tamaño de metadata en Postgres
- Alternativamente, crear tabla separada para configuraciones

### Producción
- Validar que la imagen existe antes de procesar el pedido
- Enviar configuración al sistema de producción
- Considerar workflow de aprobación para diseños personalizados

## 🧪 Testing

```bash
# En el frontend
cd storefront
npm run dev

# Navegar a /es/pegatinas/holograficas
# Configurar producto
# Verificar que se llama a la API correctamente
# Verificar que se añade al carrito con metadata
```

## 🚀 Despliegue

1. Migrar cambios en el backend
2. Desplegar backend primero
3. Actualizar frontend con nuevas integraciones
4. Verificar que las APIs funcionan en producción
5. Monitorear errores en los primeros días
