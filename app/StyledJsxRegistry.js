'use client'

import { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { StyleRegistry, createStyleRegistry } from 'styled-jsx'

// Server-renders styled-jsx <style> tags into the HTML (SSR + static export).
// Without this, every styled-jsx rule only exists in the client JS bundle and
// the whole page flashes unstyled until hydration.
export default function StyledJsxRegistry({ children }) {
  const [registry] = useState(() => createStyleRegistry())
  useServerInsertedHTML(() => {
    const styles = registry.styles()
    registry.flush()
    return <>{styles}</>
  })
  return <StyleRegistry registry={registry}>{children}</StyleRegistry>
}
