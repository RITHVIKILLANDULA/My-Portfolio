import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// StrictMode intentionally omitted: it double-invokes effects in dev, which
// breaks the WebGL/GPGPU setup→teardown→re-setup of the Data Observatory.
createRoot(document.getElementById('root')).render(<App />)
