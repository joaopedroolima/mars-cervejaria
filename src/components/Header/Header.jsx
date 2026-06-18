// Link substitui a tag <a> para navegar entre páginas sem recarregar o site
// useLocation retorna informações sobre a URL atual (qual página está aberta)
import { Link, useLocation } from 'react-router-dom';
// Importa o hook de autenticação para mostrar o nome do usuário e fazer logout
import { useAuth } from '../../context/AuthContext';
// Importa o CSS do header
import './Header.css';

// Array com todos os links de navegação do menu
// Dessa forma evitamos repetir o mesmo código JSX para cada link
const NAV_LINKS = [
  { to: '/cervejas',  label: 'Cervejas'    },
  { to: '/clientes',  label: 'Clientes'    },
  { to: '/vendas',    label: 'Vendas'      },
  { to: '/relatorio', label: 'Relatório'   },
  { to: '/contatos',  label: 'Contatos'    },
];

// Componente do cabeçalho — aparece em todas as páginas protegidas (via ComHeader no App.jsx)
export default function Header() {
  // usuario → objeto com nome/email do usuário logado (vem do AuthContext)
  // logout  → função que encerra a sessão
  const { usuario, logout } = useAuth();

  // pathname → a URL atual, ex: '/cervejas', '/vendas'
  // Usamos para destacar o link da página que está ativa
  const { pathname } = useLocation();

  return (
    <header className="cabecalho">

      {/* Logo MARS — clicável, leva sempre para a página de Cervejas */}
      <Link to="/cervejas" className="cabecalho-marca">
        <img src="/logobranca.svg" alt="MARS Cervejaria" className="cabecalho-logo" />
      </Link>

      {/* Menu de navegação — gerado automaticamente a partir do array NAV_LINKS */}
      <nav className="cabecalho-nav">
        {NAV_LINKS.map(({ to, label }) => (
          // key={to} é obrigatório em listas geradas com map() — identifica cada item
          <Link
            key={to}
            to={to}
            // Se a URL atual for igual ao destino do link, adiciona a classe "nav-item--ativo"
            // que aplica um estilo diferente (fundo branco semi-transparente) no link atual
            className={`nav-item${pathname === to ? ' nav-item--ativo' : ''}`}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Área do usuário: exibe o nome e o botão de sair */}
      <div className="cabecalho-usuario">
        {/* usuario?.nome usa optional chaining (?.) — se usuario for null não dá erro */}
        <span className="usuario-nome">{usuario?.nome}</span>
        {/* Ao clicar em "Sair", chama logout() do AuthContext que limpa a sessão */}
        <button className="btn-sair" onClick={logout}>
          Sair
        </button>
      </div>

    </header>
  );
}
