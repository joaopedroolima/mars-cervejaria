import { useState, useEffect } from 'react';
import FornecedorCard from '../../components/FornecedorCard/FornecedorCard';
import './Fornecedores.css';

const STORAGE_KEY = 'mars_fornecedores';

const FORNECEDORES_INICIAIS = [
  { id: 1, nome: "Distribuidora Hop's", cnpj: '12.345.678/0001-90', contato: '(11) 99999-1234' },
  { id: 2, nome: 'Maltes & Cia',        cnpj: '98.765.432/0001-10', contato: '(11) 88888-5678' },
  { id: 3, nome: 'Cerealias Brasil',    cnpj: '55.123.456/0001-77', contato: '(21) 77777-9090' },
];

const FORM_VAZIO = { nome: '', cnpj: '', contato: '' };

function carregarFornecedores() {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY);
    return salvo ? JSON.parse(salvo) : FORNECEDORES_INICIAIS;
  } catch {
    return FORNECEDORES_INICIAIS;
  }
}

function cnpjValido(cnpj) {
  return cnpj.replace(/\D/g, '').length === 14;
}

export default function Fornecedores() {
  const [fornecedores, setFornecedores]     = useState(carregarFornecedores);
  const [form, setForm]                     = useState(FORM_VAZIO);
  const [editandoId, setEditandoId]         = useState(null);
  const [erros, setErros]                   = useState({});
  const [mostrarForm, setMostrarForm]       = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fornecedores));
  }, [fornecedores]);

  const validar = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = 'Nome é obrigatório';
    if (!form.cnpj.trim()) {
      e.cnpj = 'CNPJ é obrigatório';
    } else if (!cnpjValido(form.cnpj)) {
      e.cnpj = 'CNPJ deve conter 14 dígitos';
    }
    if (!form.contato.trim()) e.contato = 'Contato é obrigatório';
    return e;
  };

  const handleChange = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErros((prev) => ({ ...prev, [campo]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errosVal = validar();
    if (Object.keys(errosVal).length > 0) { setErros(errosVal); return; }

    if (editandoId !== null) {
      setFornecedores((prev) => prev.map((f) => (f.id === editandoId ? { ...f, ...form } : f)));
    } else {
      setFornecedores((prev) => [...prev, { id: Date.now(), ...form }]);
    }
    cancelar();
  };

  const handleEditar = (fornecedor) => {
    setForm({ nome: fornecedor.nome, cnpj: fornecedor.cnpj, contato: fornecedor.contato });
    setEditandoId(fornecedor.id);
    setMostrarForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExcluir = (id) => {
    if (window.confirm('Deseja excluir este fornecedor?'))
      setFornecedores((prev) => prev.filter((f) => f.id !== id));
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
        <h1 className="page-title">Fornecedores</h1>
        <button className="btn-primary" onClick={toggleForm}>
          {mostrarForm && editandoId === null ? '✕ Fechar' : '+ Novo Fornecedor'}
        </button>
      </div>

      {mostrarForm && (
        <div className="form-card">
          <h2 className="form-title">
            {editandoId ? 'Editar Fornecedor' : '+ Novo Fornecedor'}
          </h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="f-nome">Nome *</label>
                <input
                  id="f-nome"
                  value={form.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  placeholder="Ex: Distribuidora Hop's"
                  className={erros.nome ? 'input-erro' : ''}
                />
                {erros.nome && <span className="erro-msg">{erros.nome}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="f-cnpj">CNPJ * (14 dígitos)</label>
                <input
                  id="f-cnpj"
                  value={form.cnpj}
                  onChange={(e) => handleChange('cnpj', e.target.value)}
                  placeholder="XX.XXX.XXX/XXXX-XX"
                  className={erros.cnpj ? 'input-erro' : ''}
                />
                {erros.cnpj && <span className="erro-msg">{erros.cnpj}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="f-contato">Contato *</label>
                <input
                  id="f-contato"
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

      {fornecedores.length === 0 ? (
        <div className="empty-state">Nenhum fornecedor cadastrado ainda.</div>
      ) : (
        <div className="cards-grid">
          {fornecedores.map((fornecedor) => (
            <FornecedorCard
              key={fornecedor.id}
              fornecedor={fornecedor}
              onEditar={handleEditar}
              onExcluir={handleExcluir}
            />
          ))}
        </div>
      )}
    </div>
  );
}
