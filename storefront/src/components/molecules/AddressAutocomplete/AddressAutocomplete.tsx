"use client"

import { Input } from "@/components/atoms"
import { useEffect, useRef, useState } from "react"
import Script from "next/script"

interface AddressAutocompleteProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onPlaceSelected: (place: {
    address: string
    city: string
    province: string
    postalCode: string
    countryCode: string
  }) => void
  label?: string
  name: string
  required?: boolean
  disabled?: boolean
}

export function AddressAutocomplete({
  value,
  onChange,
  onPlaceSelected,
  label = "Address",
  name,
  required,
  disabled,
}: AddressAutocompleteProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false)

  useEffect(() => {
    if (!apiKey || !inputRef.current || !isGoogleLoaded || !window.google) return

    try {
      // Initialize autocomplete
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["address"],
          fields: ["address_components", "formatted_address"],
        }
      )

      autocompleteRef.current = autocomplete

      // Listen for place selection
      const listener = autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace()

        if (!place?.address_components) {
          console.warn("No address components found")
          return
        }

        let address = ""
        let city = ""
        let province = ""
        let postalCode = ""
        let countryCode = ""

        // Extract address components
        place.address_components.forEach((component) => {
          const types = component.types

          if (types.includes("street_number")) {
            address = component.long_name + " "
          }
          if (types.includes("route")) {
            address += component.long_name
          }
          if (types.includes("locality")) {
            city = component.long_name
          }
          // For Spain: administrative_area_level_2 is the province (Barcelona, Madrid, etc.)
          // For other countries: administrative_area_level_1 is the state/province
          if (types.includes("administrative_area_level_2")) {
            province = component.long_name
          } else if (types.includes("administrative_area_level_1") && !province) {
            province = component.long_name
          }
          if (types.includes("postal_code")) {
            postalCode = component.long_name
          }
          if (types.includes("country")) {
            countryCode = component.short_name.toLowerCase()
          }
        })

        const extractedData = {
          address: address.trim() || place.formatted_address || "",
          city,
          province,
          postalCode,
          countryCode,
        }

        console.log("Extracted address data:", extractedData)
        onPlaceSelected(extractedData)
      })

      return () => {
        if (listener) {
          window.google.maps.event.removeListener(listener)
        }
      }
    } catch (error) {
      console.warn("Failed to initialize Google Places Autocomplete:", error)
    }
  }, [apiKey, isGoogleLoaded, onPlaceSelected])

  // Fallback to regular input if API key is not provided
  if (!apiKey) {
    return (
      <Input
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        autoComplete="street-address"
      />
    )
  }

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`}
        strategy="afterInteractive"
        onLoad={() => {
          console.log("Google Maps API loaded successfully")
          setIsGoogleLoaded(true)
        }}
        onError={() => {
          console.warn("Failed to load Google Maps API")
        }}
      />
      <div>
        <label className="label-md">
          {label}
          <div className="relative mt-2">
            <input
              ref={inputRef}
              name={name}
              value={value}
              onChange={onChange}
              required={required}
              disabled={disabled}
              autoComplete="off"
              className="w-full px-[16px] py-[12px] border rounded-sm bg-component-secondary focus:border-primary focus:outline-none focus:ring-0"
            />
          </div>
        </label>
      </div>
    </>
  )
}
