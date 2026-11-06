import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import App from './Portfolio'
import './theme.css'

hydrateRoot(document.getElementById('root'),
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
