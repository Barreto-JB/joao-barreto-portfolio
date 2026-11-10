import { createRoot, hydrateRoot } from 'react-dom/client'
import { App } from './App'
import './styles/index.css'

const root = document.getElementById('root')!
if (root.firstElementChild) hydrateRoot(root, <App />)
else createRoot(root).render(<App />)
