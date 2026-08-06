import { useCallback, useMemo, useRef, type ReactNode } from 'react'
import {
  EnquiryContext,
  type Enquiry,
  type EnquiryContextValue,
  type EnquiryListener,
} from './enquiry-context'

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const listeners = useRef(new Set<EnquiryListener>())

  const subscribe = useCallback((listener: EnquiryListener) => {
    listeners.current.add(listener)
    return () => {
      listeners.current.delete(listener)
    }
  }, [])

  const handOff = useCallback((enquiry: Enquiry) => {
    listeners.current.forEach((listener) => listener(enquiry))
    // Let the form paint the new values before scrolling to them.
    requestAnimationFrame(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  const value = useMemo<EnquiryContextValue>(
    () => ({ handOff, subscribe }),
    [handOff, subscribe],
  )

  return <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>
}
