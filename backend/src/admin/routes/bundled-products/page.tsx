import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading } from "@medusajs/ui"
import { CubeSolid } from "@medusajs/icons"

const BundledProductsPage = () => {
  return (
    <Container>
      <Heading level="h1">Bundled Products</Heading>
      <p>Gestiona tus productos agrupados aquí.</p>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Bundled Products",
  icon: CubeSolid,
})

export default BundledProductsPage
