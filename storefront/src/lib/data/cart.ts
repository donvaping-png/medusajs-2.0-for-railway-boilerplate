// Agregar al final del archivo existente
export async function addBundleToCart({
  bundleId,
  quantity,
  countryCode,
  items,
}: {
  bundleId: string
  quantity: number
  countryCode: string
  items: {
    item_id: string
    variant_id: string
  }[]
}) {
  if (!bundleId) {
    throw new Error("Missing bundle ID when adding to cart")
  }

  const cart = await getOrSetCart(countryCode)
  if (!cart) {
    throw new Error("Error retrieving or creating cart")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.client
    .fetch<HttpTypes.StoreCartResponse>(
      `/store/carts/${cart.id}/line-item-bundles`,
      {
        method: "POST",
        body: {
          bundle_id: bundleId,
          quantity,
          items,
        },
        headers,
      }
    )
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)
    })
    .catch(medusaError)
}

export async function removeBundleFromCart(bundleId: string) {
  const cartId = await getCartId()
  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.client
    .fetch<HttpTypes.StoreCartResponse>(
      `/store/carts/${cartId}/line-item-bundles/${bundleId}`,
      {
        method: "DELETE",
        headers,
      }
    )
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)
    })
    .catch(medusaError)
}
