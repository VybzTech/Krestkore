import { useEffect } from 'react'

interface SeoOptions {
  title: string
  description: string
  /** Path only, e.g. '/services/networking'. Origin is added at runtime. */
  path: string
}

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

/**
 * Per-route title, description and canonical URL.
 *
 * This is a client-rendered site, so crawlers that do not execute JavaScript
 * only ever see index.html. Google renders JS and will pick these up; most
 * social scrapers do not, which is why index.html carries sensible defaults of
 * its own rather than relying on this.
 */
export function useSeo({ title, description, path }: SeoOptions) {
  useEffect(() => {
    document.title = title

    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)

    const url = `${window.location.origin}${path}`
    setMeta('meta[property="og:url"]', 'property', 'og:url', url)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url
  }, [title, description, path])
}
