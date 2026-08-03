import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { PortfolioProvider } from './context/PortfolioContext.jsx'
import './index.css'
import 'react-quill-new/dist/quill.snow.css'
import './detail-pages.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PortfolioProvider>
      <App />
    </PortfolioProvider>
  </React.StrictMode>,
)
