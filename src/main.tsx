import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRoutes from './routes.tsx'
import {Snowfall} from "react-snowfall";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Snowfall
          style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 9999,
          }}
          snowflakeCount={200}
          />
      <AppRoutes />
  </StrictMode>,
)
