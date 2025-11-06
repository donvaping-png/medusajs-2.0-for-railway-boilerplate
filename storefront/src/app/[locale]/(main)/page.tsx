import {
  Hero,
  HomeProductSection,
  StickerCategories,
  CustomStickerShowcase,
  FeaturesSection,
  ProcessSection,
  UseCasesSection,
  TestimonialsSection,
  CTASection,
} from "@/components/sections"

import type { Metadata } from "next"
import { headers } from "next/headers"
import Script from "next/script"
import { listRegions } from "@/lib/data/regions"
import { toHreflang } from "@/lib/helpers/hreflang"
import { listProducts } from "@/lib/data/products"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "https"
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`

  // Build alternates based on available regions (locales)
  let languages: Record<string, string> = {}
  try {
    const regions = await listRegions()
    const locales = Array.from(
      new Set(
        (regions || [])
          .map((r) => r.countries?.map((c) => c.iso_2) || [])
          .flat()
          .filter(Boolean)
      )
    ) as string[]

    languages = locales.reduce<Record<string, string>>((acc, code) => {
      const hrefLang = toHreflang(code)
      acc[hrefLang] = `${baseUrl}/${code}`
      return acc
    }, {})
  } catch {
    // Fallback: only current locale
    languages = { [toHreflang(locale)]: `${baseUrl}/${locale}` }
  }

  const title = "Pegatinas de Vinilo Personalizadas | Diseños Únicos"
  const description =
    "Crea pegatinas de vinilo personalizadas de alta calidad. Resistentes al agua y UV. Diseños únicos para laptops, coches, botellas y más. Envío rápido."
  const ogImage = "/B2C_Storefront_Open_Graph.png"
  const canonical = `${baseUrl}/${locale}`

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-video-preview": -1,
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical,
      languages: {
        ...languages,
        "x-default": baseUrl,
      },
    },
    openGraph: {
      title: `${title} | ${
        process.env.NEXT_PUBLIC_SITE_NAME ||
        "Mercur B2C Demo - Marketplace Storefront"
      }`,
      description,
      url: canonical,
      siteName:
        process.env.NEXT_PUBLIC_SITE_NAME ||
        "Mercur B2C Demo - Marketplace Storefront",
      type: "website",
      images: [
        {
          url: ogImage.startsWith("http") ? ogImage : `${baseUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt:
            process.env.NEXT_PUBLIC_SITE_NAME ||
            "Mercur B2C Demo - Marketplace Storefront",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.startsWith("http") ? ogImage : `${baseUrl}${ogImage}`],
    },
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "https"
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`

  const siteName =
    process.env.NEXT_PUBLIC_SITE_NAME ||
    "Mercur B2C Demo - Marketplace Storefront"

  // Fetch products for the home page
  let products: any[] = []
  try {
    // Try with the locale first
    let productsData = await listProducts({
      pageParam: 1,
      queryParams: { limit: 8 },
      countryCode: locale,
      forceCache: true,
    })
    products = productsData.response.products
    console.log(
      `[HOME] Fetched ${products.length} products for locale: ${locale}`
    )

    // If no products found, try with default region
    if (products.length === 0) {
      const defaultRegion =
        process.env.NEXT_PUBLIC_DEFAULT_REGION || "pl"
      console.log(
        `[HOME] No products for ${locale}, trying default region: ${defaultRegion}`
      )
      productsData = await listProducts({
        pageParam: 1,
        queryParams: { limit: 8 },
        countryCode: defaultRegion,
        forceCache: true,
      })
      products = productsData.response.products
      console.log(
        `[HOME] Fetched ${products.length} products for default region`
      )
    }
  } catch (error) {
    console.error("Error fetching products:", error)
  }

  return (
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start text-primary">
      <link
        rel="preload"
        as="image"
        href="http://console-production-4b605.up.railway.app/api/v1/download-shared-object/aHR0cDovL2J1Y2tldC5yYWlsd2F5LmludGVybmFsOjkwMDAvbWVkdXNhLW1lZGlhL2ZpbHRlcnNfcXVhbGl0eSUyODYwJTI5JTIwJTI4NCUyOS53ZWJwP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9NlgzU0pHNzBSUVBPVlVHN0hEUTklMkYyMDI1MTEwNiUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTExMDZUMTQzOTU5WiZYLUFtei1FeHBpcmVzPTQzMjAwJlgtQW16LVNlY3VyaXR5LVRva2VuPWV5SmhiR2NpT2lKSVV6VXhNaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpoWTJObGMzTkxaWGtpT2lJMldETlRTa2MzTUZKUlVFOVdWVWMzU0VSUk9TSXNJbVY0Y0NJNk1UYzJNalEzT0Rnd01pd2ljR0Z5Wlc1MElqb2lNR1I0T1dGNVozbHhaWFkwWkdjaWZRLkF3T0tMb1F5QnFpS21MOVBIdkt5bFJQcTdQdEh0c3hSZ0tFWGNOVGp2cGVTMEF4NW9sSmtyekFQMDNmSFpqcWZHZTRiR2Rxd3FXdmU3aVRieU9lVXBRJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZ2ZXJzaW9uSWQ9bnVsbCZYLUFtei1TaWduYXR1cmU9MmNlNzViZDllZTllYWZmMDZhMDNhNTAxM2NkZWU4NGZjMGQ4ZmQxZGZmNDg2ZWQ0YThlNzcyODEzOTlmMjBiZA"
        imageSrcSet="http://console-production-4b605.up.railway.app/api/v1/download-shared-object/aHR0cDovL2J1Y2tldC5yYWlsd2F5LmludGVybmFsOjkwMDAvbWVkdXNhLW1lZGlhL2ZpbHRlcnNfcXVhbGl0eSUyODYwJTI5JTIwJTI4NCUyOS53ZWJwP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9NlgzU0pHNzBSUVBPVlVHN0hEUTklMkYyMDI1MTEwNiUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTExMDZUMTQzOTU5WiZYLUFtei1FeHBpcmVzPTQzMjAwJlgtQW16LVNlY3VyaXR5LVRva2VuPWV5SmhiR2NpT2lKSVV6VXhNaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpoWTJObGMzTkxaWGtpT2lJMldETlRTa2MzTUZKUlVFOVdWVWMzU0VSUk9TSXNJbVY0Y0NJNk1UYzJNalEzT0Rnd01pd2ljR0Z5Wlc1MElqb2lNR1I0T1dGNVozbHhaWFkwWkdjaWZRLkF3T0tMb1F5QnFpS21MOVBIdkt5bFJQcTdQdEh0c3hSZ0tFWGNOVGp2cGVTMEF4NW9sSmtyekFQMDNmSFpqcWZHZTRiR2Rxd3FXdmU3aVRieU9lVXBRJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZ2ZXJzaW9uSWQ9bnVsbCZYLUFtei1TaWduYXR1cmU9MmNlNzViZDllZTllYWZmMDZhMDNhNTAxM2NkZWU4NGZjMGQ4ZmQxZGZmNDg2ZWQ0YThlNzcyODEzOTlmMjBiZA 1000w"
        imageSizes="(min-width: 1024px) 50vw, 100vw"
      />
      {/* Organization JSON-LD */}
      <Script
        id="ld-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: siteName,
            url: `${baseUrl}/${locale}`,
            logo: `${baseUrl}/favicon.ico`,
          }),
        }}
      />
      {/* WebSite JSON-LD */}
      <Script
        id="ld-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteName,
            url: `${baseUrl}/${locale}`,
            inLanguage: toHreflang(locale),
          }),
        }}
      />

      <Hero
        image="http://console-production-4b605.up.railway.app/api/v1/download-shared-object/aHR0cDovL2J1Y2tldC5yYWlsd2F5LmludGVybmFsOjkwMDAvbWVkdXNhLW1lZGlhL2ZpbHRlcnNfcXVhbGl0eSUyODYwJTI5JTIwJTI4NCUyOS53ZWJwP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9NlgzU0pHNzBSUVBPVlVHN0hEUTklMkYyMDI1MTEwNiUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTExMDZUMTQzOTU5WiZYLUFtei1FeHBpcmVzPTQzMjAwJlgtQW16LVNlY3VyaXR5LVRva2VuPWV5SmhiR2NpT2lKSVV6VXhNaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpoWTJObGMzTkxaWGtpT2lJMldETlRTa2MzTUZKUlVFOVdWVWMzU0VSUk9TSXNJbVY0Y0NJNk1UYzJNalEzT0Rnd01pd2ljR0Z5Wlc1MElqb2lNR1I0T1dGNVozbHhaWFkwWkdjaWZRLkF3T0tMb1F5QnFpS21MOVBIdkt5bFJQcTdQdEh0c3hSZ0tFWGNOVGp2cGVTMEF4NW9sSmtyekFQMDNmSFpqcWZHZTRiR2Rxd3FXdmU3aVRieU9lVXBRJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZ2ZXJzaW9uSWQ9bnVsbCZYLUFtei1TaWduYXR1cmU9MmNlNzViZDllZTllYWZmMDZhMDNhNTAxM2NkZWU4NGZjMGQ4ZmQxZGZmNDg2ZWQ0YThlNzcyODEzOTlmMjBiZA"
        heading="Pegatinas de vinilo que destacan"
        paragraph="Diseña pegatinas personalizadas de alta calidad. Resistentes, duraderas y con acabados profesionales para cualquier superficie."
        buttons={[
          { label: "Crear diseño", path: "/categories/custom-stickers" },
          {
            label: "Ver catálogo",
            path: "/categories",
          },
        ]}
      />
      <div className="px-4 lg:px-8 w-full">
        <FeaturesSection />
      </div>
      <div className="px-4 lg:px-8 w-full">
        <StickerCategories heading="TIPOS DE PEGATINAS" />
      </div>
      <div className="px-4 lg:px-8 w-full">
        <CustomStickerShowcase />
      </div>
      <div className="px-4 lg:px-8 w-full">
        <UseCasesSection />
      </div>
      <div className="px-4 lg:px-8 w-full">
        <ProcessSection />
      </div>
      <div className="px-4 lg:px-8 w-full">
        <HomeProductSection
          heading="Diseños populares"
          locale={locale}
          products={products}
          home
        />
      </div>
      <div className="px-4 lg:px-8 w-full">
        <TestimonialsSection />
      </div>
      <div className="px-4 lg:px-8 w-full">
        <CTASection />
      </div>
    </main>
  )
}
