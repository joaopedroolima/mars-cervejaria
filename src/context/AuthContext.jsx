import { createContext, useContext, useState } from 'react';

// Cria o "contexto" — uma caixa de dados que qualquer componente
// da aplicação pode acessar sem precisar receber via props
const AuthContext = createContext(null);

// Login simulado: como não existe backend, o usuário válido
// fica fixo aqui mesmo no código
const USUARIO_VALIDO = {
  email: 'admin@mars.com',
  senha: '123456',
  nome: 'Administrador',
};

export function AuthProvider({ children }) {
  // Estado inicial: tenta ler a sessão salva no localStorage.
  // Se existir, já começa logado (é isso que mantém o login
  // depois de atualizar a página)
  const [usuario, setUsuario] = useState(() => {
    try {
      const salvo = localStorage.getItem('mars_sessao');
      return salvo ? JSON.parse(salvo) : null;
    } catch {
      // Se o localStorage tiver algo corrompido, não quebra a aplicação
      return null;
    }
  });

  // Compara o que foi digitado com o usuário fixo válido
  const login = (email, senha) => {
    if (
      email.trim().toLowerCase() === USUARIO_VALIDO.email &&
      senha === USUARIO_VALIDO.senha
    ) {
      const user = { email: USUARIO_VALIDO.email, nome: USUARIO_VALIDO.nome };
      setUsuario(user);
      // Salva no localStorage para manter a sessão entre acessos
      localStorage.setItem('mars_sessao', JSON.stringify(user));
      return { sucesso: true };
    }
    return { sucesso: false, mensagem: 'E-mail ou senha incorretos.' };
  };

  // Logout: limpa o estado e remove a sessão salva
  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('mars_sessao');
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook customizado: atalho para acessar usuario/login/logout
// em qualquer componente, sem repetir useContext toda vez
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}