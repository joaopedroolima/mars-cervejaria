import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState({});
  const [erroLogin, setErroLogin] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const validar = () => {
    const e = {};
    if (!email.trim()) {
      e.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      e.email = 'E-mail inválido';
    }
    if (!senha) {
      e.senha = 'Senha é obrigatória';
    } else if (senha.length < 6) {
      e.senha = 'A senha deve ter ao menos 6 caracteres';
    }
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errosVal = validar();
    if (Object.keys(errosVal).length > 0) {
      setErros(errosVal);
      return;
    }
    const resultado = login(email, senha);
    if (resultado.sucesso) {
      navigate('/cervejas');
    } else {
      setErroLogin(resultado.mensagem);
    }
  };

  const handleEmail = (v) => {
    setEmail(v);
    setErros((p) => ({ ...p, email: '' }));
    setErroLogin('');
  };

  const handleSenha = (v) => {
    setSenha(v);
    setErros((p) => ({ ...p, senha: '' }));
    setErroLogin('');
  };

  return (
    <div className="login-pagina">
      <img src="/3-mars-beer.png" alt="MARS Cervejas" className="login-cervejas-img" />
      <div className="login-card">
        <h1 className="login-titulo">MARS</h1>
        <p className="login-cervejaria">CERVEJARIA</p>
        <p className="login-desc">Sistema de Gestão</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => handleEmail(e.target.value)}
              placeholder="admin@mars.com"
              className={erros.email ? 'input-erro' : ''}
              autoComplete="email"
            />
            {erros.email && <span className="erro-msg">{erros.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => handleSenha(e.target.value)}
              placeholder="••••••"
              className={erros.senha ? 'input-erro' : ''}
              autoComplete="current-password"
            />
            {erros.senha && <span className="erro-msg">{erros.senha}</span>}
          </div>

          {erroLogin && <div className="login-erro">{erroLogin}</div>}

          <button type="submit" className="btn-entrar">
            ENTRAR
          </button>
        </form>

        <p className="login-dica">Credenciais: admin@mars.com / 123456</p>
      </div>
    </div>
  );
}
