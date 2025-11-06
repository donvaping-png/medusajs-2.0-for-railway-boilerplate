import PaymentWrapper from "@/components/organisms/PaymentContainer/PaymentWrapper"
import { CartAddressSection } from "@/components/sections/CartAddressSection/CartAddressSection"
import CartPaymentSection from "@/components/sections/CartPaymentSection/CartPaymentSection"
import CartReview from "@/components/sections/CartReview/CartReview"

import CartShippingMethodsSection from "@/components/sections/CartShippingMethodsSection/CartShippingMethodsSection"
import { retrieveCart } from "@/lib/data/cart"
import { retrieveCustomer } from "@/lib/data/customer"
import { listCartShippingMethods } from "@/lib/data/fulfillment"
import { listCartPaymentMethods } from "@/lib/data/payment"
import { retrieveRegion } from "@/lib/data/regions"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Finalizar Compra",
  description: "Página de checkout - Finalizar compra",
}

export default async function CheckoutPage({}) {
  return (
    <Suspense
      fallback={
        <div className="container flex items-center justify-center">
          Cargando...
        </div>
      }
    >
      <CheckoutPageContent />
    </Suspense>
  )
}

async function CheckoutPageContent({}) {
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const shippingMethods = await listCartShippingMethods(cart.id, false)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")
  const customer = await retrieveCustomer()

  return (
    <PaymentWrapper cart={cart}>
      <main className="bg-ui-bg-subtle min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Left side - Checkout form */}
            <div className="order-2 lg:order-1">
              <div className="mb-8">
                <h1 className="text-3xl font-semibold mb-2">Finalizar Compra</h1>
              </div>
              
              <div className="flex flex-col gap-6">
                <CartAddressSection cart={cart} customer={customer} />
                <CartShippingMethodsSection
                  cart={cart}
                  availableShippingMethods={shippingMethods as any}
                />
                <CartPaymentSection
                  cart={cart}
                  availablePaymentMethods={paymentMethods}
                />
              </div>
            </div>

            {/* Right side - Order summary */}
            <div className="order-1 lg:order-2 lg:sticky lg:top-8 lg:self-start">
              <CartReview cart={cart} />
            </div>
          </div>
        </div>
      </main>
    </PaymentWrapper>
  )
}
