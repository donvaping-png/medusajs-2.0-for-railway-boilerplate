import type { Meta, StoryObj } from "@storybook/react"

import { Hero } from "./Hero"

const meta: Meta<typeof Hero> = {
  component: Hero,
  decorators: (Story) => <Story />,
}

export default meta
type Story = StoryObj<typeof Hero>

export const FirstStory: Story = {
  args: {
    heading: "¡Imprime tus pegatinas personalizadas!",
    paragraph: "Haga sus propias pegatinas y etiquetas personalizadas. Entrega exprés en tan solo 2-4 días laborables. ¡Obtén una prueba instantánea y envío gratis!",
    image: "/images/hero/Image.jpg",
    buttons: [
      { label: "Buy now", path: "#" },
      { label: "Sell now", path: "3" },
    ],
  },
}
