"use client"

import { Heading, Text, useToggleState } from "@medusajs/ui"
import { setAddresses } from "@/lib/data/cart"
import compareAddresses from "@/lib/helpers/compare-addresses"
import { HttpTypes } from "@medusajs/types"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState, useEffect } from "react"
import { Button } from "@/components/atoms"
import ErrorMessage from "@/components/molecules/ErrorMessage/ErrorMessage"
import Spinner from "@/icons/spinner"
import ShippingAddress from "@/components/organisms/ShippingAddress/ShippingAddress"
import { CheckCircleSolid } from "@medusajs/icons"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"

export const CartAddressSection = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isAddress = Boolean(
    cart?.shipping_address &&
      cart?.shipping_address.first_name &&
      cart?.shipping_address.last_name &&
      cart?.shipping_address.address_1 &&
      cart?.shipping_address.city &&
      cart?.shipping_address.postal_code &&
      cart?.shipping_address.country_code
  )
  const isOpen = searchParams.get("step") === "address" || !isAddress

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const [message, formAction] = useActionState(setAddresses, sameAsBilling)

  useEffect(() => {
    if (!isAddress) {
      router.replace(pathname + "?step=address")
    }
  }, [isAddress])

  const handleEdit = () => {
    router.replace(pathname + "?step=address")
  }

  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
            isAddress ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}>
            {isAddress ? '✓' : '1'}
          </div>
          <Heading level="h2" className="text-xl font-semibold">
            Información de Contacto
          </Heading>
        </div>
        {!isOpen && isAddress && (
          <Button onClick={handleEdit} variant="tonal" className="text-sm">
            Cambiar
          </Button>
        )}
      </div>
      <form
        action={async (data) => {
          await formAction(data)
          router.replace(`${pathname}?step=delivery`)
          router.refresh()
        }}
      >
        {isOpen ? (
          <div className="mt-4">
            <ShippingAddress
              customer={customer}
              checked={sameAsBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
            />
            <Button
              className="mt-6 w-full"
              data-testid="submit-address-button"
              variant="tonal"
            >
              Continuar al Envío
            </Button>
            <ErrorMessage
              error={message !== "success" && message}
              data-testid="address-error-message"
            />
          </div>
        ) : (
          <div className="mt-4">
            <div className="bg-gray-50 rounded-md p-4">
              {cart && cart.shipping_address ? (
                <div className="space-y-1">
                  <Text className="font-medium">
                    {cart.shipping_address.first_name}{" "}
                    {cart.shipping_address.last_name}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {cart.email}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {cart.shipping_address.address_1}
                    {cart.shipping_address.address_2 && `, ${cart.shipping_address.address_2}`}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {cart.shipping_address.city}, {cart.shipping_address.postal_code}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {cart.shipping_address.country_code?.toUpperCase()}
                  </Text>
                  {cart.shipping_address.phone && (
                    <Text className="text-sm text-gray-600">
                      {cart.shipping_address.phone}
                    </Text>
                  )}
                </div>
              ) : (
                <div>
                  <Spinner />
                </div>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
