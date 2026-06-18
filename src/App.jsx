// Importa os componentes de roteamento do React Router v6
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// Importa o contexto de autenticação (login/logout/sessão)
import { AuthProvider, useAuth } from './context/AuthContext';
// Importa o componente que bloqueia rotas sem login
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
// Importa a barra de navegação
import Header from './components/Header/Header';
// Importa todas as páginas da aplicação
import Login from './pages/Login/Login';
import Cervejas from './pages/Cervejas/Cervejas';
import Clientes from './pages/Clientes/Clientes';
import Contatos from './pages/Contatos/Contatos';
import Vendas from './pages/Vendas/Vendas';
import Relatorio from './pages/Relatorio/Relatorio';
// Importa os estilos compartilhados (cards, botões, formulários)
import './App.css';

// Componente auxiliar: envolve qualquer página com o Header acima e o conteúdo abaixo
// Evita repetir <Header /> em cada rota individualmente
function ComHeader({ children }) {
  return (
    <>
      {/* Barra de navegação fixa no topo */}
      <Header />
      {/* Conteúdo da página (o que for passado dentro de <ComHeader>) */}
      <main>{children}</main>
    </>
  );
}

// Componente que define todas as rotas da aplicação
function Rotas() {
  // Lê o estado do usuário logado a partir do contexto de autenticação
  const { usuario } = useAuth();

  return (
    <Routes>
      {/* Rota pública: se já logado vai para /cervejas, senão exibe o Login */}
      <Route
        path="/login"
        element={usuario ? <Navigate to="/cervejas" replace /> : <Login />}
      />

      {/* Rota protegida: ProtectedRoute verifica login; sem login redireciona para /login */}
      <Route
        path="/cervejas"
        element={
          <ProtectedRoute>
            <ComHeader><Cervejas /></ComHeader>
          </ProtectedRoute>
        }
      />

      {/* Rota protegida para a página de Clientes */}
      <Route
        path="/clientes"
        element={
          <ProtectedRoute>
            <ComHeader><Clientes /></ComHeader>
          </ProtectedRoute>
        }
      />

      {/* Rota protegida para a página de Contatos */}
      <Route
        path="/contatos"
        element={
          <ProtectedRoute>
            <ComHeader><Contatos /></ComHeader>
          </ProtectedRoute>
        }
      />

      {/* Rota protegida para a página de Vendas */}
      <Route
        path="/vendas"
        element={
          <ProtectedRoute>
            <ComHeader><Vendas /></ComHeader>
          </ProtectedRoute>
        }
      />

      {/* Rota protegida para o Relatório com JOIN simulado */}
      <Route
        path="/relatorio"
        element={
          <ProtectedRoute>
            <ComHeader><Relatorio /></ComHeader>
          </ProtectedRoute>
        }
      />

      {/* Rota curinga (*): captura qualquer URL desconhecida */}
      {/* Logado → vai para /cervejas | Não logado → vai para /login */}
      <Route
        path="*"
        element={<Navigate to={usuario ? '/cervejas' : '/login'} replace />}
      />
    </Routes>
  );
}

// Componente raiz — ponto de entrada montado pelo main.jsx
export default function App() {
  return (
    // BrowserRouter habilita o sistema de rotas baseado na URL do navegador
    <BrowserRouter>
      {/* AuthProvider disponibiliza login/logout/usuário para todos os componentes filhos */}
      <AuthProvider>
        {/* Rotas decide qual componente renderizar para cada URL */}
        <Rotas />
      </AuthProvider>
    </BrowserRouter>
  );
}
