import { createContext } from 'react'

export interface Enquiry {
  name: string
  email: string
  service: string
  message: string
}

export type EnquiryListener = (enquiry: Enquiry) => void

export interface EnquiryContextValue {
  /** Kris calls this when a conversation is qualified. */
  handOff: (enquiry: Enquiry) => void
  /** The contact form subscribes; returns an unsubscribe function. */
  subscribe: (listener: EnquiryListener) => () => void
}

/*
 * A subscription rather than shared state: the hand-off is a one-off event,
 * not a value the form should keep re-deriving. It also keeps the form's
 * setState inside an external-event callback, which is where React wants it.
 *
 * Defaults are no-ops rather than a throwing guard, so a component rendered
 * without the provider (as in unit tests) degrades to "no hand-off" instead of
 * crashing.
 */
export const EnquiryContext = createContext<EnquiryContextValue>({
  handOff: () => {},
  subscribe: () => () => {},
})
