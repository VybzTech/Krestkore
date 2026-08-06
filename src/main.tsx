import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './theme/ThemeProvider'
import { EnquiryProvider } from './enquiry/EnquiryProvider'
import { App } from './App'
import './styles/global.css'

const container = document.getElementById('root')
if (!container) throw new Error('Root element #root was not found')

createRoot(container).render(
  <StrictMode>
    <ThemeProvider>
      <EnquiryProvider>
        <App />
      </EnquiryProvider>
    </ThemeProvider>
  </StrictMode>,
)
