/**
 * Organisations Krestkore actually works with.
 *
 * Rendered as typographic wordmarks: none of these have an open-licensed
 * logo, and inventing one is worse than not showing one. Drop real files into
 * `public/assets/partners/` and add a `logo` path here to upgrade an entry.
 */
export interface Partner {
  name: string
  /** Short descriptor shown under the wordmark. */
  kind: string
  /** Optional path under /assets/partners/. Falls back to the wordmark. */
  logo?: string
  url?: string
}

export const partners: readonly Partner[] = [
  { name: 'African Tech Journal', kind: 'Media' },
  { name: 'Krestkore Digital', kind: 'Sister company' },
  { name: 'Badera Eats', kind: 'Hospitality' },
  { name: 'Kinlend', kind: 'Fintech' },
  { name: 'BPO', kind: 'Business services' },
]
