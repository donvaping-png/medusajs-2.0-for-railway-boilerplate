import { defineWidgetConfig } from "@medusajs/admin-shared"
import { Container, Heading, Input, Label, Textarea } from "@medusajs/ui"
import { useState, useEffect } from "react"

interface ProductSeoFieldsProps {
  data?: {
    seo_title?: string
    seo_description?: string
    short_description?: string
  }
}

const ProductSeoFields = ({ data }: ProductSeoFieldsProps) => {
  const [descriptionLength, setDescriptionLength] = useState(data?.seo_description?.length || 0)

  useEffect(() => {
    setDescriptionLength(data?.seo_description?.length || 0)
  }, [data?.seo_description])

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescriptionLength(e.target.value.length)
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">SEO & Marketing</Heading>
      </div>
      <div className="flex flex-col gap-y-4 px-6 py-4">
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="seo_title" className="text-ui-fg-subtle">
            Meta Title
          </Label>
          <Input
            id="seo_title"
            name="seo_title"
            type="text"
            placeholder="Enter meta title for search engines"
            defaultValue={data?.seo_title || ""}
          />
          <p className="text-ui-fg-subtle text-xs">
            The title that appears in search engine results. Recommended: 50-60 characters.
          </p>
        </div>

        <div className="flex flex-col gap-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="seo_description" className="text-ui-fg-subtle">
              Meta Description
            </Label>
            <span className="text-ui-fg-muted text-xs">
              {descriptionLength} characters
            </span>
          </div>
          <Textarea
            id="seo_description"
            name="seo_description"
            placeholder="Enter meta description for search engines"
            defaultValue={data?.seo_description || ""}
            onChange={handleDescriptionChange}
            rows={3}
          />
          <p className="text-ui-fg-subtle text-xs">
            The description that appears in search engine results. Recommended: 150-160 characters.
          </p>
        </div>

        <div className="flex flex-col gap-y-2">
          <Label htmlFor="short_description" className="text-ui-fg-subtle">
            Short Description
          </Label>
          <Textarea
            id="short_description"
            name="short_description"
            placeholder="Enter a brief description for product listings"
            defaultValue={data?.short_description || ""}
            rows={2}
          />
          <p className="text-ui-fg-subtle text-xs">
            A brief description displayed in product listing cards on the storefront.
          </p>
        </div>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: ["product.details.after", "product.create.after"],
})

export default ProductSeoFields
