import { defineRouteConfig } from "@medusajs/admin-sdk"
import { useState, useEffect } from "react"

type Product = {
  id: string
  title: string
  handle: string
}

type BundleItem = {
  product_id: string
  quantity: number
}

type Bundle = {
  id: string
  title: string
  product?: {
    id: string
    title: string
  }
  items: Array<{
    id: string
    quantity: number
    product?: {
      id: string
      title: string
    }
  }>
  created_at: string
}

const BundledProductsPage = () => {
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  
  // Form state
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("2999")
  const [items, setItems] = useState<BundleItem[]>([{ product_id: "", quantity: 1 }])
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [bundlesRes, productsRes] = await Promise.all([
        fetch("/admin/bundled-products", { credentials: "include" }),
        fetch("/admin/products?limit=100", { credentials: "include" })
      ])
      
      const bundlesData = await bundlesRes.json()
      const productsData = await productsRes.json()
      
      setBundles(bundlesData.bundled_products || [])
      setProducts(productsData.products || [])
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Error al cargar datos")
    } finally {
      setLoading(false)
    }
  }

  const addItem = () => {
    setItems([...items, { product_id: "", quantity: 1 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index: number, field: keyof BundleItem, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!title.trim()) {
      setError("El título es requerido")
      return
    }

    if (items.some(item => !item.product_id)) {
      setError("Todos los items deben tener un producto seleccionado")
      return
    }

    setCreating(true)

    try {
      const response = await fetch("/admin/bundled-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          product: {
            title,
            status: "published",
            options: [{ title: "Default", values: ["default"] }],
            variants: [{
              title,
              options: { "Default": "default" },
              manage_inventory: false,
              prices: [{ amount: parseInt(price), currency_code: "usd" }]
            }]
          },
          items
        })
      })

      if (!response.ok) throw new Error("Error al crear bundle")

      alert("✅ Bundle creado exitosamente")
      setShowForm(false)
      setTitle("")
      setPrice("2999")
      setItems([{ product_id: "", quantity: 1 }])
      fetchData()
    } catch (err) {
      setError("Error al crear el bundle")
      console.error(err)
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return <div style={styles.container}>Cargando...</div>
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Bundled Products</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={styles.primaryButton}
        >
          {showForm ? "Cancelar" : "+ Crear Bundle"}
        </button>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Crear Nuevo Bundle</h2>
          
          {error && (
            <div style={styles.error}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Título del Bundle</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Kit de Stickers Premium"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Precio (en centavos)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="2999 = $29.99"
                style={styles.input}
                required
              />
              <small style={styles.hint}>
                Precio en centavos. Ej: 2999 = $29.99
              </small>
            </div>

            <div style={styles.formGroup}>
              <div style={styles.itemsHeader}>
                <label style={styles.label}>Items del Bundle</label>
                <button
                  type="button"
                  onClick={addItem}
                  style={styles.secondaryButton}
                >
                  + Agregar Item
                </button>
              </div>

              {items.map((item, index) => (
                <div key={index} style={styles.itemRow}>
                  <div style={styles.itemSelect}>
                    <label style={styles.smallLabel}>Producto</label>
                    <select
                      value={item.product_id}
                      onChange={(e) => updateItem(index, "product_id", e.target.value)}
                      style={styles.select}
                      required
                    >
                      <option value="">Selecciona un producto</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.itemQuantity}>
                    <label style={styles.smallLabel}>Cantidad</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value))}
                      style={styles.input}
                      required
                    />
                  </div>

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      style={styles.removeButton}
                      title="Eliminar item"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div style={styles.formActions}>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={styles.cancelButton}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={creating}
                style={creating ? styles.disabledButton : styles.primaryButton}
              >
                {creating ? "Creando..." : "Crear Bundle"}
              </button>
            </div>
          </form>
        </div>
      )}

      {bundles.length === 0 ? (
        <div style={styles.emptyState}>
          <h2 style={styles.emptyTitle}>No hay bundles creados</h2>
          <p style={styles.emptyText}>
            Crea tu primer bundle para agrupar productos
          </p>
        </div>
      ) : (
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Título</th>
                <th style={styles.th}>Producto</th>
                <th style={styles.th}>Items</th>
                <th style={styles.th}>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {bundles.map((bundle) => (
                <tr key={bundle.id} style={styles.tr}>
                  <td style={styles.td}>{bundle.title}</td>
                  <td style={styles.td}>
                    {bundle.product ? (
                      <a
                        href={`/app/products/${bundle.product.id}`}
                        style={styles.link}
                      >
                        {bundle.product.title}
                      </a>
                    ) : (
                      <span style={styles.muted}>Sin producto</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    <span style={styles.badge}>
                      {bundle.items.length} items
                    </span>
                  </td>
                  <td style={styles.td}>
                    {new Date(bundle.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={styles.infoCard}>
        <h3 style={styles.infoTitle}>💡 Después de crear un bundle</h3>
        <ol style={styles.infoList}>
          <li>Ve a <strong>Products</strong> y busca el bundle creado</li>
          <li>Asigna el <strong>Sales Channel</strong> correcto</li>
          <li>Configura el <strong>Shipping Profile</strong></li>
          <li>Agrega <strong>imágenes</strong> del bundle</li>
        </ol>
      </div>
    </div>
  )
}

const styles = {
  container: {
    padding: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "600",
    margin: 0,
  },
  primaryButton: {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },
  secondaryButton: {
    backgroundColor: "#f3f4f6",
    color: "#374151",
    border: "1px solid #d1d5db",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },
  cancelButton: {
    backgroundColor: "white",
    color: "#374151",
    border: "1px solid #d1d5db",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },
  disabledButton: {
    backgroundColor: "#9ca3af",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "not-allowed",
    fontSize: "14px",
    fontWeight: "500",
  },
  removeButton: {
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "20px",
  },
  formCard: {
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "24px",
    marginBottom: "24px",
  },
  formTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "20px",
    marginTop: 0,
  },
  error: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "16px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "6px",
    color: "#374151",
  },
  smallLabel: {
    display: "block",
    fontSize: "12px",
    fontWeight: "500",
    marginBottom: "4px",
    color: "#6b7280",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
    boxSizing: "border-box" as const,
  },
  select: {
    width: "100%",
    padding: "10px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
    boxSizing: "border-box" as const,
    backgroundColor: "white",
  },
  hint: {
    display: "block",
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "4px",
  },
  itemsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  itemRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "12px",
    alignItems: "flex-end",
  },
  itemSelect: {
    flex: 1,
  },
  itemQuantity: {
    width: "120px",
  },
  formActions: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "24px",
  },
  emptyState: {
    textAlign: "center" as const,
    padding: "60px 20px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
  },
  emptyTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "8px",
  },
  emptyText: {
    color: "#6b7280",
    fontSize: "14px",
  },
  tableCard: {
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    overflow: "hidden",
    marginBottom: "24px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
  },
  th: {
    backgroundColor: "#f9fafb",
    padding: "12px",
    textAlign: "left" as const,
    fontWeight: "600",
    fontSize: "14px",
    color: "#374151",
    borderBottom: "1px solid #e5e7eb",
  },
  tr: {
    borderBottom: "1px solid #e5e7eb",
  },
  td: {
    padding: "12px",
    fontSize: "14px",
    color: "#374151",
  },
  link: {
    color: "#3b82f6",
    textDecoration: "none",
  },
  muted: {
    color: "#9ca3af",
  },
  badge: {
    display: "inline-block",
    padding: "4px 8px",
    backgroundColor: "#dbeafe",
    color: "#1e40af",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "500",
  },
  infoCard: {
    backgroundColor: "#f0f9ff",
    border: "1px solid #bfdbfe",
    borderRadius: "8px",
    padding: "16px",
  },
  infoTitle: {
    fontSize: "16px",
    fontWeight: "600",
    marginTop: 0,
    marginBottom: "12px",
    color: "#1e40af",
  },
  infoList: {
    margin: 0,
    paddingLeft: "20px",
    color: "#1e40af",
    fontSize: "14px",
    lineHeight: "1.6",
  },
}

export const config = defineRouteConfig({
  label: "Bundled Products",
})

export default BundledProductsPage
