"use client"

import ErrorMessage from "@/components/molecules/ErrorMessage/ErrorMessage"
import { initiatePaymentSession } from "@/lib/data/cart"
import { RadioGroup } from "@headlessui/react"
import {
  isStripe as isStripeFunc,
  paymentInfoMap,
} from "../../../lib/constants"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { Container, Heading, Text } from "@medusajs/ui"
import PaymentContainer, {
  StripeCardContainer,
} from "../../organisms/PaymentContainer/PaymentContainer"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/atoms"

type StoreCardPaymentMethod = any & {
  service_zone?: {
    fulfillment_set: {
      type: string
    }
  }
}

const CartPaymentSection = ({
  cart,
  availablePaymentMethods,
}: {
  cart: any
  availablePaymentMethods: StoreCardPaymentMethod[] | null
}) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  const isStripe = isStripeFunc(selectedPaymentMethod)

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    if (isStripeFunc(method)) {
      await initiatePaymentSession(cart, {
        provider_id: method,
      })
    }
  }

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const shouldInputCard =
        isStripeFunc(selectedPaymentMethod) && !activeSession

      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }

      if (!shouldInputCard) {
        return router.push(
          pathname + "?" + createQueryString("step", "review"),
          {
            scroll: false,
          }
        )
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  const isComplete = paymentReady && !isOpen

  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
            isComplete ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}>
            {isComplete ? '✓' : '3'}
          </div>
          <Heading level="h2" className="text-xl font-semibold">
            Pago
          </Heading>
        </div>
        {!isOpen && paymentReady && (
          <Button onClick={handleEdit} variant="tonal" className="text-sm">
            Cambiar
          </Button>
        )}
      </div>
      <div>
        <div className={isOpen ? "block" : "hidden"}>
          <div className="mt-4">
            {!paidByGiftcard && availablePaymentMethods?.length && (
              <>
                <RadioGroup
                  value={selectedPaymentMethod}
                  onChange={(value: string) => setPaymentMethod(value)}
                  className="space-y-3"
                >
                  {availablePaymentMethods.map((paymentMethod) => (
                    <div key={paymentMethod.id}>
                      {isStripeFunc(paymentMethod.id) ? (
                        <StripeCardContainer
                          paymentProviderId={paymentMethod.id}
                          selectedPaymentOptionId={selectedPaymentMethod}
                          paymentInfoMap={paymentInfoMap}
                          setCardBrand={setCardBrand}
                          setError={setError}
                          setCardComplete={setCardComplete}
                        />
                      ) : (
                        <PaymentContainer
                          paymentInfoMap={paymentInfoMap}
                          paymentProviderId={paymentMethod.id}
                          selectedPaymentOptionId={selectedPaymentMethod}
                        />
                      )}
                    </div>
                  ))}
                </RadioGroup>
              </>
            )}

            {paidByGiftcard && (
              <div className="bg-gray-50 rounded-md p-4">
                <Text className="font-medium mb-1">
                  Método de pago
                </Text>
                <Text
                  className="text-sm text-gray-600"
                  data-testid="payment-method-summary"
                >
                  Tarjeta regalo
                </Text>
              </div>
            )}

            <ErrorMessage
              error={error}
              data-testid="payment-method-error-message"
            />

            <Button
              onClick={handleSubmit}
              variant="tonal"
              className="w-full mt-6"
              loading={isLoading}
              disabled={
                (isStripe && !cardComplete) ||
                (!selectedPaymentMethod && !paidByGiftcard)
              }
            >
              {!activeSession && isStripeFunc(selectedPaymentMethod)
                ? "Introducir Datos de Tarjeta"
                : "Revisar Pedido"}
            </Button>
          </div>
        </div>

        <div className={isOpen ? "hidden" : "block"}>
          <div className="mt-4 bg-gray-50 rounded-md p-4">
            {cart && paymentReady && activeSession ? (
              <div className="space-y-3">
                <div>
                  <Text className="font-medium mb-1">
                    Método de pago
                  </Text>
                  <Text
                    className="text-sm text-gray-600"
                    data-testid="payment-method-summary"
                  >
                    {paymentInfoMap[activeSession?.provider_id]?.title ||
                      activeSession?.provider_id}
                  </Text>
                </div>
                <div>
                  <Text className="font-medium mb-1">
                    Detalles de pago
                  </Text>
                  <div
                    className="flex gap-2 text-sm text-gray-600 items-center"
                    data-testid="payment-details-summary"
                  >
                    <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                      {paymentInfoMap[selectedPaymentMethod]?.icon || (
                        <CreditCard />
                      )}
                    </Container>
                    <Text>
                      {isStripeFunc(selectedPaymentMethod) && cardBrand
                        ? cardBrand
                        : "Listo para pagar"}
                    </Text>
                  </div>
                </div>
              </div>
            ) : paidByGiftcard ? (
              <div>
                <Text className="font-medium mb-1">
                  Método de pago
                </Text>
                <Text
                  className="text-sm text-gray-600"
                  data-testid="payment-method-summary"
                >
                  Tarjeta regalo
                </Text>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPaymentSection
