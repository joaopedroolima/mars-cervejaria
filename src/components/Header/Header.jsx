import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const NAV_LINKS = [
  { to: '/cervejas',     label: 'Cervejas'     },
  { to: '/fornecedores', label: 'Fornecedores'  },
  { to: '/vendas',       label: 'Vendas'        },
  { to: '/relatorio',    label: 'Relatório'     },
];

export default function Header() {
  const { usuario, logout } = useAuth();
  const { pathname } = useLocation();

  return (
    <header className="cabecalho">
      <Link to="/cervejas" className="cabecalho-marca">
        <img src="/logobranca.svg" alt="MARS Cervejaria" className="cabecalho-logo" />
      </Link>

      <nav className="cabecalho-nav">
        {NAV_LINKS.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`nav-item${pathname === to ? ' nav-item--ativo' : ''}`}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="cabecalho-usuario">
        <span className="usuario-nome">{usuario?.nome}</span>
        <button className="btn-sair" onClick={logout}>
          Sair
        </button>
      </div>
    </header>
  );
}
