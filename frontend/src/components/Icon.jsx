import * as LucideIcons from 'lucide-react'

/**
 * Icon — resolves an icon name string to the matching Lucide component.
 * Falls back gracefully if the icon name is unknown.
 */
export function Icon({ name, size = 16, className = '', ...rest }) {
  const Component = LucideIcons[name]
  if (!Component) return null
  return <Component size={size} className={className} aria-hidden="true" {...rest} />
}
