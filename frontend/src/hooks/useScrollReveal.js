import { useEffect, useRef } from 'react'

/**
 * useScrollReveal — attaches an IntersectionObserver to the returned ref.
 * When the element enters the viewport, the "visible" class is added.
 */
export function useScrollReveal(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.12, ...options }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}

/**
 * useScrollRevealGroup — reveals all direct children with staggered delay.
 * Uses MutationObserver to support dynamically rendered children (e.g. from API).
 */
export function useScrollRevealGroup(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    let isVisible = false

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible = true
          ;[...container.children].forEach((child) => child.classList.add('visible'))
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.08, ...options }
    )

    observer.observe(container)

    // Handle children injected after the container was already revealed
    const mutObserver = new MutationObserver(() => {
      if (isVisible) {
        ;[...container.children].forEach((child) => child.classList.add('visible'))
      }
    })
    
    mutObserver.observe(container, { childList: true })

    return () => {
      observer.disconnect()
      mutObserver.disconnect()
    }
  }, [])

  return ref
}
