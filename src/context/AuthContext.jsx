import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const USUARIO_VALIDO = {
  email: 'admin@mars.com',
  senha: '123456',
  nome: 'Administrador',
};

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try {
      const salvo = localStorage.getItem('mars_sessao');
      return salvo ? JSON.parse(salvo) : null;
    } catch {
      return null;
    }
  });

  const login = (email, senha) => {
    if (
      email.trim().toLowerCase() === USUARIO_VALIDO.email &&
      senha === USUARIO_VALIDO.senha
    ) {
      const user = { email: USUARIO_VALIDO.email, nome: USUARIO_VALIDO.nome };
      setUsuario(user);
      localStorage.setItem('mars_sessao', JSON.stringify(user));
      return { sucesso: true };
    }
    return { sucesso: false, mensagem: 'E-mail ou senha incorretos.' };
  };

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

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
