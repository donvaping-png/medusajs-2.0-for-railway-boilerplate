import { defineRouteConfig } from "@medusajs/admin-sdk"
import {
  Container,
  Heading,
  Button,
  Table,
  Badge,
  FocusModal,
} from "@medusajs/ui"
import { CubeSolid, PlusMini } from "@medusajs/icons"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { CreateBundleForm } from "../../components/create-bundle-form"

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
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchBundles()
  }, [])

  const fetchBundles = async () => {
    try {
      const response = await fetch("/admin/bundled-products", {
        credentials: "include",
      })
      const data = await response.json()
      setBundles(data.bundled_products || [])
    } catch (error) {
      console.error("Error fetching bundles:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Container>
        <Heading level="h1">Bundled Products</Heading>
        <p>Cargando...</p>
      </Container>
    )
  }

  return (
    <Container>
      <div className="flex items-center justify-between mb-4">
        <Heading level="h1">Bundled Products</Heading>
        <Button
          variant="primary"
          size="small"
          onClick={() => setShowCreateModal(true)}
        >
          <PlusMini />
          Crear Bundle
        </Button>
      </div>

      <FocusModal open={showCreateModal} onOpenChange={setShowCreateModal}>
        <FocusModal.Content>
          <FocusModal.Header>
            <Heading>Crear Nuevo Bundle</Heading>
          </FocusModal.Header>
          <FocusModal.Body>
            <CreateBundleForm
              onSuccess={() => {
                setShowCreateModal(false)
                fetchBundles()
              }}
              onCancel={() => setShowCreateModal(false)}
            />
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>

      {bundles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CubeSolid className="text-ui-fg-muted mb-4" size={48} />
          <Heading level="h2" className="mb-2">
            No hay bundles creados
          </Heading>
          <p className="text-ui-fg-subtle mb-4">
            Crea tu primer bundle para agrupar productos
          </p>
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            <PlusMini />
            Crear Bundle
          </Button>
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Título</Table.HeaderCell>
              <Table.HeaderCell>Producto</Table.HeaderCell>
              <Table.HeaderCell>Items</Table.HeaderCell>
              <Table.HeaderCell>Fecha</Table.HeaderCell>
              <Table.HeaderCell>Acciones</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {bundles.map((bundle) => (
              <Table.Row key={bundle.id}>
                <Table.Cell>{bundle.title}</Table.Cell>
                <Table.Cell>
                  {bundle.product ? (
                    <Link
                      to={`/products/${bundle.product.id}`}
                      className="text-ui-fg-interactive hover:underline"
                    >
                      {bundle.product.title}
                    </Link>
                  ) : (
                    <span className="text-ui-fg-muted">Sin producto</span>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Badge size="small">{bundle.items.length} items</Badge>
                </Table.Cell>
                <Table.Cell>
                  {new Date(bundle.created_at).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <Button variant="secondary" size="small">
                    Ver detalles
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      <div className="mt-8 p-4 bg-ui-bg-subtle rounded-lg">
        <Heading level="h3" className="mb-2">
          Cómo crear un bundle
        </Heading>
        <ol className="list-decimal list-inside space-y-2 text-sm text-ui-fg-subtle">
          <li>Crea los productos individuales que formarán parte del bundle</li>
          <li>Usa la API o la consola para crear el bundle</li>
          <li>Configura el producto del bundle (precio, sales channel, shipping)</li>
          <li>El bundle estará disponible en tu storefront</li>
        </ol>
        <div className="mt-4">
          <p className="text-sm text-ui-fg-muted mb-2">
            Ejemplo de creación por consola del navegador:
          </p>
          <pre className="bg-ui-bg-base p-3 rounded text-xs overflow-x-auto">
{`fetch('/admin/bundled-products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + document.cookie.match(/auth_token=([^;]+)/)?.[1]
  },
  body: JSON.stringify({
    title: "Kit de Stickers",
    product: {
      title: "Kit de Stickers",
      status: "published",
      options: [{title: "Default", values: ["default"]}],
      variants: [{
        title: "Kit de Stickers",
        options: {"Default": "default"},
        manage_inventory: false
      }]
    },
    items: [
      {product_id: "prod_xxx", quantity: 5},
      {product_id: "prod_yyy", quantity: 3}
    ]
  })
}).then(r => r.json()).then(console.log)`}
          </pre>
        </div>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Bundled Products",
  icon: CubeSolid,
})

export default BundledProductsPage
