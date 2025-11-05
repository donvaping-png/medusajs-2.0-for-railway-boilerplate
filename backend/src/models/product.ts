import { model } from "@medusajs/utils"

const Product = model.define("product", {
  seo_title: model.text().nullable(),
  seo_description: model.text().nullable(),
  short_description: model.text().nullable(),
})

export default Product
