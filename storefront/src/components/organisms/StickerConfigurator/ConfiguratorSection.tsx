interface ConfiguratorSectionProps {
  title: string
  description?: string
  children: React.ReactNode
}

export function ConfiguratorSection({
  title,
  description,
  children,
}: ConfiguratorSectionProps) {
  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  )
}
