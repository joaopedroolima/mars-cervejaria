import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Header from './components/Header/Header';
import Login from './pages/Login/Login';
import Cervejas from './pages/Cervejas/Cervejas';
import Fornecedores from './pages/Fornecedores/Fornecedores';
import Vendas from './pages/Vendas/Vendas';
import Relatorio from './pages/Relatorio/Relatorio';
import './App.css';

function ComHeader({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}

function Rotas() {
  const { usuario } = useAuth();

  return (
    <Routes>
      {/* Rota pública — redireciona para /cervejas se já logado */}
      <Route
        path="/login"
        element={usuario ? <Navigate to="/cervejas" replace /> : <Login />}
      />

      {/* Rotas protegidas — bloqueadas sem login */}
      <Route
        path="/cervejas"
        element={
          <ProtectedRoute>
            <ComHeader><Cervejas /></ComHeader>
          </ProtectedRoute>
        }
      />
      <Route
        path="/fornecedores"
        element={
          <ProtectedRoute>
            <ComHeader><Fornecedores /></ComHeader>
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendas"
        element={
          <ProtectedRoute>
            <ComHeader><Vendas /></ComHeader>
          </ProtectedRoute>
        }
      />
      <Route
        path="/relatorio"
        element={
          <ProtectedRoute>
            <ComHeader><Relatorio /></ComHeader>
          </ProtectedRoute>
        }
      />

      {/* Qualquer rota desconhecida */}
      <Route
        path="*"
        element={<Navigate to={usuario ? '/cervejas' : '/login'} replace />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Rotas />
      </AuthProvider>
    </BrowserRouter>
  );
}
