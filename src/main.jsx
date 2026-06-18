// Importa o modo estrito do React — ajuda a detectar problemas durante o desenvolvimento
import { StrictMode } from 'react'
// Importa a função que cria a raiz do React no HTML
import { createRoot } from 'react-dom/client'
// Importa o CSS global (fundo gradiente, fontes)
import './index.css'
// Importa o componente raiz da aplicação
import App from './App.jsx'

// Seleciona o elemento <div id="root"> do index.html e monta o React dentro dele
createRoot(document.getElementById('root')).render(
  // StrictMode ativa avisos extras durante o desenvolvimento (não afeta a versão final)
  <StrictMode>
    <App />
  </StrictMode>,
)
