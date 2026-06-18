// Navigate redireciona o usuário para outra rota sem precisar clicar em nada
import { Navigate } from 'react-router-dom';
// Importa o hook de autenticação para verificar se há usuário logado
import { useAuth } from '../../context/AuthContext';

// ProtectedRoute: componente "porteiro" que envolve páginas privadas
// Uso: <ProtectedRoute><Cervejas /></ProtectedRoute>
// Se logado → renderiza a página; Se não logado → redireciona para /login
export default function ProtectedRoute({ children }) {
  // Extrai o objeto usuario do contexto de autenticação
  // usuario é null quando não há login ativo; é um objeto quando está logado
  const { usuario } = useAuth();

  // Se não houver usuário logado, redireciona imediatamente para a tela de login
  // "replace" substitui a URL no histórico (evita loop de "voltar" no navegador)
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Se o usuário estiver logado, renderiza normalmente o conteúdo (a página protegida)
  // "children" é o componente passado dentro de <ProtectedRoute>...</ProtectedRoute>
  return children;
}
