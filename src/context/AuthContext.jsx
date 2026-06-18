// Importa funções do React:
// createContext → cria o "cofre" de dados compartilhado
// useContext    → lê o conteúdo do cofre dentro de um componente
// useState      → cria variáveis de estado que causam re-render quando mudam
import { createContext, useContext, useState } from 'react';

// Cria o contexto de autenticação — começa como null (vazio)
// Qualquer componente dentro do AuthProvider pode acessar esses dados
const AuthContext = createContext(null);

// Único usuário válido do sistema (sem backend, as credenciais ficam fixas aqui)
const USUARIO_VALIDO = {
  email: 'admin@mars.com',
  senha: '123456',
  nome: 'Administrador',
};

// AuthProvider: componente que envolve toda a aplicação (veja App.jsx)
// Qualquer componente filho pode acessar usuario, login e logout via useAuth()
export function AuthProvider({ children }) {

  // Cria o estado "usuario" com lazy initialization (passando uma função)
  // A função só executa UMA VEZ ao montar o componente — ideal para ler localStorage
  const [usuario, setUsuario] = useState(() => {
    try {
      // Tenta buscar a sessão salva anteriormente no navegador
      const salvo = localStorage.getItem('mars_sessao');
      // Se encontrar, converte o texto JSON para objeto; senão retorna null (não logado)
      return salvo ? JSON.parse(salvo) : null;
    } catch {
      // Se o dado salvo estiver corrompido, ignora e começa sem sessão
      return null;
    }
  });

  // Função chamada quando o usuário clica em "Entrar" na tela de login
  const login = (email, senha) => {
    // trim() remove espaços extras; toLowerCase() ignora maiúsculas/minúsculas no email
    if (
      email.trim().toLowerCase() === USUARIO_VALIDO.email &&
      senha === USUARIO_VALIDO.senha
    ) {
      // Monta o objeto do usuário logado (a senha NÃO é incluída por segurança)
      const user = { email: USUARIO_VALIDO.email, nome: USUARIO_VALIDO.nome };
      // Atualiza o estado — todos os componentes que usam useAuth() re-renderizam
      setUsuario(user);
      // Persiste a sessão no localStorage para sobreviver a F5 ou fechar o navegador
      localStorage.setItem('mars_sessao', JSON.stringify(user));
      // Retorna objeto de sucesso para Login.jsx usar
      return { sucesso: true };
    }
    // Credenciais erradas: retorna falha com mensagem
    return { sucesso: false, mensagem: 'E-mail ou senha incorretos.' };
  };

  // Função chamada quando o usuário clica em "Sair" no Header
  const logout = () => {
    setUsuario(null);                          // limpa o estado (usuário = null)
    localStorage.removeItem('mars_sessao');    // apaga a sessão salva no navegador
  };

  // Disponibiliza os três valores para qualquer componente dentro do Provider
  // value={{ ... }} é o que os componentes recebem quando chamam useAuth()
  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook customizado: atalho para acessar o contexto de autenticação
// Em vez de importar AuthContext e chamar useContext em todo componente,
// basta chamar useAuth() para ter acesso a { usuario, login, logout }
export function useAuth() {
  const ctx = useContext(AuthContext);
  // Proteção: lança erro claro se useAuth for usado fora do AuthProvider
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
