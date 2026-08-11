import { useEffect } from 'react'

/** Sets document.title for the lifetime of a route and restores it after. */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previous = document.title
    document.title = title
    return () => {
      document.title = previous
    }
  }, [title])
}
