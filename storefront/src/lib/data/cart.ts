"use server"

import { fetchQuery, sdk } from "../config"
import medusaError from "@/lib/helpers/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { revalidatePath, revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
  removeCartId,
  setCartId,
} from "./cookies"

export async function retrieveCart() {
  const cartId = await getCartId()

  if (!cartId) {
    return null
  }

  const headers = await getAuthHeaders()
  
  return await sdk.store.cart
    .retrieve(cartId, {}, headers)
    .then(({ cart }) => cart)
    .catch(() => {
      return null
    })
}

export async function getOrSetCart(countryCode: string) {
  let cart = await retrieveCart()
  const region = cart?.region

  if (!region) {
    cart = await createCart({ regionId: undefined }).then((cart) => cart)
  }

  if (cart && cart?.region?.countries && countryCode) {
    const cartCountryCode = cart.region.countries[0].iso_2

    if (cartCountryCode !== countryCode) {
      await updateCart(cart.id, { region_id: undefined })
    }
  }

  return cart
}

export async function createCart(data = {}) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.cart
    .create(data, {}, headers)
    .then(async ({ cart }) => {
      await setCartId(cart.id)
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      return cart
    })
    .catch(medusaError)
}

export async function updateCart(cartId: string, data: HttpTypes.StoreUpdateCart) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.cart
    .update(cartId, data, {}, headers)
    .then(async ({ cart }) => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      return cart
    })
    .catch(medusaError)
}

export async function addToCart({
  variantId,
  quantity,
  countryCode,
}: {
  variantId: string
  quantity: number
  countryCode: string
}) {
  if (!variantId) {
    throw new Error("Missing variant ID when adding to cart")
  }

  const cart = await getOrSetCart(countryCode)
  if (!cart) {
    throw new Error("Error retrieving or creating cart")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.cart
    .createLineItem(
      cart.id,
      {
        variant_id: variantId,
        quantity,
      },
      {},
      headers
    )
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)
    })
    .catch(medusaError)
}

export async function updateLineItem({
  lineId,
  quantity,
}: {
  lineId: string
  quantity: number
}) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when updating line item")
  }

  const cartId = await getCartId()
  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.cart
    .updateLineItem(cartId!, lineId, { quantity }, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)
    })
    .catch(medusaError)
}

export async function deleteLineItem(lineId: string) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when deleting line item")
  }

  const cartId = await getCartId()
  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.cart
    .deleteLineItem(cartId!, lineId, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)
    })
    .catch(medusaError)
}

export async function enrichLineItems(
  lineItems:
    | HttpTypes.StoreCartLineItem[]
    | HttpTypes.StoreOrderLineItem[]
    | null,
  regionId: string
) {
  if (!lineItems) return []

  const queryParams = {
    ids: lineItems.map((lineItem) => lineItem.product_id!),
    region_id: regionId,
  }

  const { products } = await sdk.store.product.list(queryParams)

  if (!products) {
    return []
  }

  const enrichedItems = lineItems.map((item) => {
    const product = products.find((p: any) => p.id === item.product_id)
    const variant = product?.variants?.find(
      (v: any) => v.id === item.variant_id
    )

    if (!product || !variant) {
      return item
    }

    return {
      ...item,
      variant: {
        ...variant,
        product: {
          ...product,
          thumbnail: product.thumbnail,
        },
      },
    }
  }) as HttpTypes.StoreCartLineItem[]

  return enrichedItems
}

export async function setShippingMethod({
  cartId,
  shippingMethodId,
}: {
  cartId: string
  shippingMethodId: string
}) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.cart
    .addShippingMethod(cartId, { option_id: shippingMethodId }, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)
    })
    .catch(medusaError)
}

export async function removeShippingMethod({
  cartId,
  shippingMethodId,
}: {
  cartId: string
  shippingMethodId: string
}) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  // Use the update method to remove shipping method
  return sdk.store.cart
    .update(cartId, { shipping_methods: [] } as any, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)
    })
    .catch(medusaError)
}

export async function initiatePaymentSession(
  cart: HttpTypes.StoreCart,
  data: {
    provider_id: string
    context?: Record<string, unknown>
  }
) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.payment
    .initiatePaymentSession(cart, data, {}, headers)
    .then(async (resp) => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      return resp
    })
    .catch(medusaError)
}

export async function applyPromotions(codes: string[]) {
  const cartId = await getCartId()
  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.cart
    .update(
      cartId!,
      { promo_codes: codes } as any,
      {},
      headers
    )
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
    })
    .catch(medusaError)
}

export async function applyGiftCard(code: string) {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No existing cart found")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.cart
    .update(
      cartId,
      { gift_cards: [{ code }] } as any,
      {},
      headers
    )
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
    })
    .catch(medusaError)
}

export async function removeDiscount(code: string) {
  const cartId = await getCartId()
  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.cart
    .update(
      cartId!,
      {
        promo_codes: [code],
      } as any,
      {},
      headers
    )
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
    })
    .catch(medusaError)
}

export async function removeGiftCard(
  codeToRemove: string,
  giftCards: HttpTypes.StoreCartLineItem[]
) {
  const cartId = await getCartId()
  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.cart
    .update(
      cartId!,
      {
        gift_cards: giftCards
          .filter((gc: any) => gc.code !== codeToRemove)
          .map((gc: any) => ({ code: gc.code })),
      } as any,
      {},
      headers
    )
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
    })
    .catch(medusaError)
}

export async function submitPromotionForm(
  currentState: unknown,
  formData: FormData
) {
  const code = formData.get("code") as string

  try {
    await applyPromotions([code])
  } catch (e: any) {
    return e.message
  }
}

export async function setAddresses(currentState: unknown, formData: FormData) {
  if (!formData) {
    throw new Error("No form data found when setting addresses")
  }

  try {
    const cartId = await getCartId()

    if (!cartId) {
      throw new Error("No existing cart found")
    }

    const data = {
      shipping_address: {
        first_name: formData.get("shipping_address.first_name"),
        last_name: formData.get("shipping_address.last_name"),
        address_1: formData.get("shipping_address.address_1"),
        address_2: formData.get("shipping_address.address_2") || undefined,
        company: formData.get("shipping_address.company") || undefined,
        postal_code: formData.get("shipping_address.postal_code"),
        city: formData.get("shipping_address.city"),
        country_code: formData.get("shipping_address.country_code"),
        province: formData.get("shipping_address.province") || undefined,
        phone: formData.get("shipping_address.phone") || undefined,
      },
      email: formData.get("email"),
    } as any

    const sameAsBilling = formData.get("same_as_billing")

    if (sameAsBilling === "on") {
      data.billing_address = data.shipping_address
    }

    if (sameAsBilling !== "on") {
      data.billing_address = {
        first_name: formData.get("billing_address.first_name"),
        last_name: formData.get("billing_address.last_name"),
        address_1: formData.get("billing_address.address_1"),
        address_2: formData.get("billing_address.address_2") || undefined,
        company: formData.get("billing_address.company") || undefined,
        postal_code: formData.get("billing_address.postal_code"),
        city: formData.get("billing_address.city"),
        country_code: formData.get("billing_address.country_code"),
        province: formData.get("billing_address.province") || undefined,
        phone: formData.get("billing_address.phone") || undefined,
      }
    }

    await updateCart(cartId, data)
  } catch (e: any) {
    return e.message
  }

  redirect(
    `/${formData.get("shipping_address.country_code")}/checkout?step=delivery`
  )
}

export async function placeOrder() {
  const cartId = await getCartId()
  const headers = {
    ...(await getAuthHeaders()),
  }

  const cartRes = await sdk.store.cart
    .complete(cartId!, {}, headers)
    .then(async (cartRes) => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      return cartRes
    })
    .catch(medusaError)

  if (cartRes?.type === "order") {
    const countryCode =
      cartRes.order.shipping_address?.country_code?.toLowerCase()
    await removeCartId()
    redirect(`/${countryCode}/order/confirmed/${cartRes?.order.id}`)
  }

  return cartRes?.cart
}

export async function updateRegion(countryCode: string, currentPath: string) {
  const cartId = await getCartId()
  const headers = {
    ...(await getAuthHeaders()),
  }

  if (cartId) {
    await updateCart(cartId, { region_id: undefined })
  }

  revalidatePath("/", "layout")
  redirect(`/${countryCode}${currentPath}`)
}

export async function updateRegionWithValidation(
  countryCode: string,
  currentPath: string
) {
  try {
    await updateRegion(countryCode, currentPath)
  } catch (error: any) {
    return error.toString()
  }
}

// Bundle product functions
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
