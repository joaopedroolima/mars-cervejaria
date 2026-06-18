import { useState, useEffect } from 'react';
import ClienteCard from '../../components/ClienteCard/ClienteCard';

const STORAGE_KEY = 'mars_clientes';

const CLIENTES_INICIAIS = [
  { id: 1, nome: "João Silva", cpf: '123.456.789-00', contato: '(11) 99999-1234' },
  { id: 2, nome: 'Maria Santos', cpf: '987.654.321-11', contato: '(11) 88888-5678' },
  { id: 3, nome: 'Pedro Oliveira', cpf: '555.123.456-22', contato: '(21) 77777-9090' },
];

const FORM_VAZIO = { nome: '', cpf: '', contato: '' };

function lerStorage(chave, fallback) {
  try {
    const salvo = localStorage.getItem(chave);
    return salvo ? JSON.parse(salvo) : fallback;
  } catch {
    return fallback;
  }
}

function cpfValido(cpf) {
  return cpf.replace(/\D/g, '').length === 11;
}

export default function Clientes() {
  const [clientes, setClientes]         = useState(() => lerStorage(STORAGE_KEY, CLIENTES_INICIAIS));
  const [form, setForm]                 = useState(FORM_VAZIO);
  const [editandoId, setEditandoId]     = useState(null);
  const [erros, setErros]               = useState({});
  const [mostrarForm, setMostrarForm]   = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes));
  }, [clientes]);

  const handleChange = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErros((prev) => ({ ...prev, [campo]: '' }));
  };

  const validar = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = 'Nome é obrigatório';
    
    if (!form.cpf.trim()) {
      e.cpf = 'CPF é obrigatório';
    } else if (!cpfValido(form.cpf)) {
      e.cpf = 'CPF deve conter 11 dígitos';
    }
    
    if (!form.contato.trim()) e.contato = 'Contato é obrigatório';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errosVal = validar();
    if (Object.keys(errosVal).length > 0) { setErros(errosVal); return; }

    const payload = {
      nome: form.nome.trim(),
      cpf: form.cpf.trim(),
      contato: form.contato.trim(),
    };

    if (editandoId !== null) {
      setClientes((prev) => prev.map((c) => (c.id === editandoId ? { ...c, ...payload } : c)));
    } else {
      setClientes((prev) => [...prev, { id: Date.now(), ...payload }]);
    }
    cancelar();
  };

  const handleEditar = (cliente) => {
    setForm({
      nome: cliente.nome,
      cpf: cliente.cpf,
      contato: cliente.contato,
    });
    setEditandoId(cliente.id);
    setMostrarForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExcluir = (id) => {
    if (window.confirm('Deseja excluir este cliente?'))
      setClientes((prev) => prev.filter((c) => c.id !== id));
  };

  const cancelar = () => {
    setForm(FORM_VAZIO);
    setEditandoId(null);
    setErros({});
    setMostrarForm(false);
  };

  const toggleForm = () => {
    if (mostrarForm && editandoId === null) { cancelar(); return; }
    setEditandoId(null);
    setForm(FORM_VAZIO);
    setErros({});
    setMostrarForm(true);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Clientes</h1>
        <button className="btn-primary" onClick={toggleForm}>
          {mostrarForm && editandoId === null ? '✕ Fechar' : '+ Novo Cliente'}
        </button>
      </div>

      {mostrarForm && (
        <div className="form-card">
          <h2 className="form-title">
            {editandoId ? 'Editar Cliente' : '+ Novo Cliente'}
          </h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="c-nome">Nome *</label>
                <input
                  id="c-nome"
                  type="text"
                  value={form.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  placeholder="Ex: João Silva"
                  className={erros.nome ? 'input-erro' : ''}
                />
                {erros.nome && <span className="erro-msg">{erros.nome}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="c-cpf">CPF * (11 dígitos)</label>
                <input
                  id="c-cpf"
                  type="text"
                  value={form.cpf}
                  onChange={(e) => handleChange('cpf', e.target.value)}
                  placeholder="XXX.XXX.XXX-XX"
                  className={erros.cpf ? 'input-erro' : ''}
                />
                {erros.cpf && <span className="erro-msg">{erros.cpf}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="c-contato">Contato *</label>
                <input
                  id="c-contato"
                  type="text"
                  value={form.contato}
                  onChange={(e) => handleChange('contato', e.target.value)}
                  placeholder="Ex: (11) 99999-0000"
                  className={erros.contato ? 'input-erro' : ''}
                />
                {erros.contato && <span className="erro-msg">{erros.contato}</span>}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editandoId ? 'Salvar Alterações' : 'Cadastrar'}
              </button>
              <button type="button" className="btn-secondary" onClick={cancelar}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {clientes.length === 0 ? (
        <div className="empty-state">Nenhum cliente cadastrado ainda.</div>
      ) : (
        <div className="cards-grid">
          {clientes.map((cliente) => (
            <ClienteCard
              key={cliente.id}
              cliente={cliente}
              onEditar={handleEditar}
              onExcluir={handleExcluir}
            />
          ))}
        </div>
      )}
    </div>
  );
}