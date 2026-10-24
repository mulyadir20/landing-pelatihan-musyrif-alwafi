import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import InformasiStitPage from './pages/InformasiStit/InformasiStitPage.jsx';
import './styles/tokens.css';
import './styles/global.css';

function Root() {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';
  if (path === '/informasi-stit' || path.startsWith('/informasi-stit/')) {
    return <InformasiStitPage />;
  }
  return <App />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
