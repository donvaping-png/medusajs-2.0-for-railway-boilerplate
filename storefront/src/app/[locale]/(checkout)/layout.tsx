import { Button } from "@/components/atoms"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { CollapseIcon } from "@/icons"
import Image from "next/image"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-ui-bg-subtle">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <LocalizedClientLink href="/" className="text-2xl font-bold">
              <Image
                src="/Logo.svg"
                width={126}
                height={40}
                alt="Logo"
                priority
              />
            </LocalizedClientLink>
            <LocalizedClientLink href="/cart">
              <Button variant="tonal" className="flex items-center gap-2 text-sm">
                <CollapseIcon className="rotate-90" />
                <span>Carrito</span>
              </Button>
            </LocalizedClientLink>
          </div>
        </div>
      </header>
      {children}
    </div>
  )
}
