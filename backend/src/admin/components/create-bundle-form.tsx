import { useState, useEffect } from "react"
import {
  Button,
  Input,
  Label,
  Select,
  Heading,
  Text,
  toast,
} from "@medusajs/ui"
import { PlusMini, XMarkMini } from "@medusajs/icons"

type Product = {
  id: string
  title: string
  variants: Array<{
    id: string
    title: string
  }>
}

type BundleItem = {
  product_id: string
  quantity: number
}

type CreateBundleFormProps = {
  onSuccess: () => void
  onCancel: () => void
}

export const CreateBundleForm = ({
  onSuccess,
  onCancel,
}: CreateBundleFormProps) => {
  const [title, setTitle] = useState("")
  const [items, setItems] = useState<BundleItem[]>([
    { product_id: "", quantity: 1 },
  ])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/admin/products?limit=100", {
        credentials: "include",
      })
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error("Error fetching products:", error)
      toast.error("Error al cargar productos")
    } finally {
      setLoadingProducts(false)
    }
  }

  const addItem = () => {
    setItems([...items, { product_id: "", quantity: 1 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (
    index: number,
    field: keyof BundleItem,
    value: string | number
  ) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error("El título es requerido")
      return
    }

    if (items.some((item) => !item.product_id)) {
      toast.error("Todos los items deben tener un producto seleccionado")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/admin/bundled-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          product: {
            title,
            status: "published",
            options: [{ title: "Default", values: ["default"] }],
            variants: [
              {
                title,
                options: { Default: "default" },
                manage_inventory: false,
              },
            ],
          },
          items,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al crear bundle")
      }

      toast.success("Bundle creado exitosamente")
      onSuccess()
    } catch (error) {
      console.error("Error creating bundle:", error)
      toast.error("Error al crear el bundle")
    } finally {
      setLoading(false)
    }
  }

  if (loadingProducts) {
    return <div>Cargando productos...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Título del Bundle</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Kit de Stickers"
          required
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <Heading level="h3">Items del Bundle</Heading>
          <Button type="button" variant="secondary" size="small" onClick={addItem}>
            <PlusMini />
            Agregar Item
          </Button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex gap-4 items-end p-4 border rounded-lg"
            >
              <div className="flex-1">
                <Label>Producto</Label>
                <Select
                  value={item.product_id}
                  onValueChange={(value) =>
                    updateItem(index, "product_id", value)
                  }
                >
                  <Select.Trigger>
                    <Select.Value placeholder="Selecciona un producto" />
                  </Select.Trigger>
                  <Select.Content>
                    {products.map((product) => (
                      <Select.Item key={product.id} value={product.id}>
                        {product.title}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </div>

              <div className="w-32">
                <Label>Cantidad</Label>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(index, "quantity", parseInt(e.target.value))
                  }
                />
              </div>

              {items.length > 1 && (
                <Button
                  type="button"
                  variant="secondary"
                  size="small"
                  onClick={() => removeItem(index)}
                >
                  <XMarkMini />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-ui-bg-subtle p-4 rounded-lg">
        <Text className="text-sm text-ui-fg-subtle">
          <strong>Nota:</strong> Después de crear el bundle, debes configurar:
        </Text>
        <ul className="list-disc list-inside text-sm text-ui-fg-subtle mt-2 space-y-1">
          <li>Precio del bundle en el producto creado</li>
          <li>Sales channel donde estará disponible</li>
          <li>Shipping profile para el envío</li>
        </ul>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" isLoading={loading}>
          Crear Bundle
        </Button>
      </div>
    </form>
  )
}
