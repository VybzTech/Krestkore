import { useContext } from 'react'
import { EnquiryContext, type EnquiryContextValue } from './enquiry-context'

export function useEnquiry(): EnquiryContextValue {
  return useContext(EnquiryContext)
}
