"use server"

import { sdk } from "../config"
import { sortProducts } from "@/lib/helpers/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@/types/product"
import { getAuthHeaders } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"
import { SellerProps } from "@/types/seller"

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
  category_id,
  collection_id,
  forceCache = false,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams &
    HttpTypes.StoreProductParams & {
      handle?: string[]
    }
  category_id?: string
  collection_id?: string
  countryCode?: string
  regionId?: string
  forceCache?: boolean
}): Promise<{
  response: {
    products: (HttpTypes.StoreProduct & { seller?: SellerProps })[]
    count: number
  }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = (_pageParam - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const useCached = forceCache || (limit <= 8 && !category_id && !collection_id)

  console.log('Fetching products with params:', {
    country_code: countryCode,
    category_id,
    collection_id,
    limit,
    offset,
    region_id: region?.id,
  })

  return sdk.client
    .fetch<{
      products: (HttpTypes.StoreProduct & { seller?: SellerProps })[]
      count: number
    }>(`/store/products`, {
      method: "GET",
      query: {
        country_code: countryCode,
        category_id,
        collection_id,
        limit,
        offset,
        region_id: region?.id,
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,*variants",
        ...queryParams,
      },
      next: useCached ? { revalidate: 60 } : undefined,
      cache: useCached ? "force-cache" : "no-cache",
    })
    .then(({ products: productsRaw, count }) => {
      console.log('Products received from API:', productsRaw.length, 'count:', count)
      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        response: {
          products: productsRaw,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
    .catch((error) => {
      console.error('Error fetching products:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      
      return {
        response: {
          products: [],
          count: 0,
        },
        nextPage: 0,
        queryParams,
      }
    })
}

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async ({
  page = 1,
  queryParams,
  sortBy = "created_at",
  countryCode,
  category_id,
  seller_id,
  collection_id,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string
  category_id?: string
  seller_id?: string
  collection_id?: string
}): Promise<{
  response: {
    products: HttpTypes.StoreProduct[]
    count: number
  }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  console.log('listProductsWithSort called with:', { category_id, collection_id, countryCode })
  
  const limit = queryParams?.limit || 12

  const {
    response: { products, count },
  } = await listProducts({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      limit: 100,
    },
    category_id,
    collection_id,
    countryCode,
  })
  
  console.log('listProductsWithSort received products:', products.length)

  const filteredProducts = products

  console.log('Total products fetched:', products.length)
  console.log('Products:', products.map(p => ({ 
    id: p.id, 
    title: p.title, 
    variants: p.variants?.length,
    variantsDetails: p.variants?.map(v => ({
      id: v.id,
      title: v.title,
      calculated_price: v.calculated_price
    }))
  })))

  const pricedProducts = filteredProducts.filter((prod) => {
    const hasPrice = prod.variants?.some((variant) => {
      console.log('Checking variant:', variant.id, 'calculated_price:', variant.calculated_price)
      return variant.calculated_price !== null && variant.calculated_price !== undefined
    })
    if (!hasPrice) {
      console.log('Product without price:', prod.id, prod.title, 'variants:', prod.variants)
    }
    return hasPrice
  })

  console.log('Products with prices:', pricedProducts.length)

  const sortedProducts = sortProducts(pricedProducts, sortBy)

  const pageParam = (page - 1) * limit

  const nextPage = count > pageParam + limit ? pageParam + limit : null

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

  return {
    response: {
      products: paginatedProducts,
      count,
    },
    nextPage,
    queryParams,
  }
}
