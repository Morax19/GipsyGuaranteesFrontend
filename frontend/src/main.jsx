import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Handle dynamic mobile viewport height (address mobile status/nav bars)
// This sets a CSS variable `--vh` equal to 1% of the window innerHeight.
// Use in CSS as: height: calc(var(--vh, 1vh) * 100);
function setVh() {
  try {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
  } catch (e) {
    // server-side rendering or restricted environment: ignore
  }
}
setVh()
// Re-run on common events that affect visual viewport on mobile browsers.
window.addEventListener('resize', setVh)
window.addEventListener('orientationchange', setVh)
window.addEventListener('pageshow', setVh)
window.addEventListener('load', setVh)

// Some mobile browsers report an incorrect innerHeight on the very first paint
// (address bar / chrome not yet measured). Retry a couple times after short delays
// to stabilize the CSS variable early in the session.
setTimeout(setVh, 150)
setTimeout(setVh, 750)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
