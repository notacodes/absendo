import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import AppRoutes from './routes.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <AppRoutes />
    </ChakraProvider>
  </StrictMode>,
)
