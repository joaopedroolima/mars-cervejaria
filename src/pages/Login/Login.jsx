// useState gerencia os valores dos campos e as mensagens de erro
import { useState } from 'react';
// useNavigate permite redirecionar o usuário por código (sem clicar em link)
import { useNavigate } from 'react-router-dom';
// Importa o hook de autenticação para acessar a função login()
import { useAuth } from '../../context/AuthContext';
// Importa o CSS específico desta página
import './Login.css';

// Componente da tela de login — primeira página que o usuário vê
export default function Login() {
  // Estado do campo de e-mail (começa vazio)
  const [email, setEmail] = useState('');
  // Estado do campo de senha (começa vazio)
  const [senha, setSenha] = useState('');
  // Objeto com erros de validação por campo: ex: { email: 'E-mail inválido' }
  const [erros, setErros] = useState({});
  // Mensagem de erro quando o login falha (credenciais erradas)
  const [erroLogin, setErroLogin] = useState('');

  // Extrai a função login() do contexto de autenticação
  const { login } = useAuth();
  // Hook para redirecionar o usuário após login bem-sucedido
  const navigate = useNavigate();

  // Valida os campos antes de tentar fazer login
  // Retorna um objeto com os erros encontrados; se vazio, tudo está ok
  const validar = () => {
    const e = {};

    // Verifica se o e-mail foi preenchido
    if (!email.trim()) {
      e.email = 'E-mail é obrigatório';
    // Verifica o formato do e-mail com expressão regular (regex)
    // \S+ = um ou mais caracteres que não sejam espaço
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      e.email = 'E-mail inválido';
    }

    // Verifica se a senha foi preenchida
    if (!senha) {
      e.senha = 'Senha é obrigatória';
    // Verifica se a senha tem pelo menos 6 caracteres
    } else if (senha.length < 6) {
      e.senha = 'A senha deve ter ao menos 6 caracteres';
    }

    return e; // retorna {} se não houver erros
  };

  // Chamado quando o usuário clica no botão "Entrar"
  const handleSubmit = (e) => {
    // Impede o comportamento padrão do formulário HTML (que recarregaria a página)
    e.preventDefault();

    // Roda a validação e armazena os erros
    const errosVal = validar();

    // Se houver algum erro, exibe e para por aqui
    if (Object.keys(errosVal).length > 0) {
      setErros(errosVal);
      return;
    }

    // Chama a função login() do AuthContext com o que o usuário digitou
    const resultado = login(email, senha);

    if (resultado.sucesso) {
      // Login bem-sucedido: redireciona para a página de cervejas
      navigate('/cervejas');
    } else {
      // Credenciais erradas: exibe a mensagem de erro retornada pelo login()
      setErroLogin(resultado.mensagem);
    }
  };

  // Chamado a cada tecla digitada no campo de e-mail
  const handleEmail = (v) => {
    setEmail(v);                                       // atualiza o valor do campo
    setErros((p) => ({ ...p, email: '' }));            // limpa só o erro de e-mail
    setErroLogin('');                                  // limpa o erro geral de login
  };

  // Chamado a cada tecla digitada no campo de senha
  const handleSenha = (v) => {
    setSenha(v);                                       // atualiza o valor do campo
    setErros((p) => ({ ...p, senha: '' }));            // limpa só o erro de senha
    setErroLogin('');                                  // limpa o erro geral de login
  };

  return (
    // Container principal — centraliza os elementos na tela
    <div className="login-pagina">

      {/* Imagem das 3 garrafas com animação de flutuar (definida no Login.css) */}
      <img src="/3-mars-beer.png" alt="MARS Cervejas" className="login-cervejas-img" />

      {/* Card branco central com o formulário de login */}
      <div className="login-card">

        {/* Título e subtítulo da marca */}
        <h1 className="login-titulo">MARS</h1>
        <p className="login-cervejaria">CERVEJARIA</p>
        <p className="login-desc">Sistema de Gestão</p>

        {/* noValidate desativa a validação nativa do HTML — usamos a nossa própria */}
        <form onSubmit={handleSubmit} noValidate>

          {/* Campo de e-mail */}
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              // e.target.value é o texto atual digitado no campo
              onChange={(e) => handleEmail(e.target.value)}
              placeholder="admin@mars.com"
              // Se houver erro neste campo, adiciona classe CSS de borda vermelha
              className={erros.email ? 'input-erro' : ''}
              autoComplete="email"
            />
            {/* Renderiza a mensagem de erro somente se erros.email existir */}
            {erros.email && <span className="erro-msg">{erros.email}</span>}
          </div>

          {/* Campo de senha */}
          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"  // type="password" oculta os caracteres com bolinhas
              value={senha}
              onChange={(e) => handleSenha(e.target.value)}
              placeholder="••••••"
              className={erros.senha ? 'input-erro' : ''}
              autoComplete="current-password"
            />
            {/* Mensagem de erro da senha — aparece só quando há erro */}
            {erros.senha && <span className="erro-msg">{erros.senha}</span>}
          </div>

          {/* Bloco de erro de credencial — aparece só quando erroLogin não está vazio */}
          {erroLogin && <div className="login-erro">{erroLogin}</div>}

          {/* Botão de submit — dispara o handleSubmit */}
          <button type="submit" className="btn-entrar">
            ENTRAR
          </button>
        </form>

        {/* Dica discreta com as credenciais de acesso */}
        <p className="login-dica">Credenciais: admin@mars.com / 123456</p>
      </div>
    </div>
  );
}
