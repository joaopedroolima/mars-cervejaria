import { useState, useEffect } from 'react';
import CervejaCard from '../../components/CervejaCard/CervejaCard';
import './Cervejas.css';

const STORAGE_KEY = 'mars_cervejas';

const CERVEJAS_INICIAIS = [
  { id: 1, nome: 'Sol da Tarde', estilo: 'Pilsen',        teorAlcoolico: '5.0', preco: '12.00', imagem: '/cervejas/sol-da-tarde.png' },
  { id: 2, nome: 'Florest',      estilo: 'Belgian Tripel', teorAlcoolico: '8.0', preco: '18.00', imagem: '/cervejas/florest.png'      },
  { id: 3, nome: 'Blue Dark',    estilo: 'Weizenbier',     teorAlcoolico: '5.5', preco: '15.00', imagem: '/cervejas/blue-dark.png'    },
];

const FORM_VAZIO = { nome: '', estilo: '', teorAlcoolico: '', preco: '', imagem: '' };

function carregarCervejas() {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY);
    if (!salvo) return CERVEJAS_INICIAIS;

    // Migração: garante que cervejas sem imagem recebam a imagem correta
    const dados = JSON.parse(salvo);
    return dados.map((c) => {
      if (c.imagem) return c;
      const inicial = CERVEJAS_INICIAIS.find((i) => i.id === c.id);
      return inicial ? { ...c, imagem: inicial.imagem } : c;
    });
  } catch {
    return CERVEJAS_INICIAIS;
  }
}

export default function Cervejas() {
  const [cervejas, setCervejas]   = useState(carregarCervejas);
  const [form, setForm]           = useState(FORM_VAZIO);
  const [editandoId, setEditandoId] = useState(null);
  const [erros, setErros]         = useState({});
  const [mostrarForm, setMostrarForm] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cervejas));
  }, [cervejas]);

  const validar = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = 'Nome é obrigatório';
    if (!form.estilo.trim()) e.estilo = 'Estilo é obrigatório';
    const teor = Number(form.teorAlcoolico);
    if (!form.teorAlcoolico || isNaN(teor) || teor < 0 || teor > 100)
      e.teorAlcoolico = 'Teor inválido (0–100)';
    const preco = Number(form.preco);
    if (!form.preco || isNaN(preco) || preco <= 0)
      e.preco = 'Preço deve ser maior que zero';
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
      setCervejas((prev) => prev.map((c) => (c.id === editandoId ? { ...c, ...form } : c)));
    } else {
      setCervejas((prev) => [...prev, { id: Date.now(), ...form }]);
    }
    cancelar();
  };

  const handleEditar = (cerveja) => {
    setForm({ nome: cerveja.nome, estilo: cerveja.estilo, teorAlcoolico: cerveja.teorAlcoolico, preco: cerveja.preco, imagem: cerveja.imagem || '' });
    setEditandoId(cerveja.id);
    setMostrarForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExcluir = (id) => {
    if (window.confirm('Deseja excluir esta cerveja?'))
      setCervejas((prev) => prev.filter((c) => c.id !== id));
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
        <h1 className="page-title">Cervejas</h1>
        <button className="btn-primary" onClick={toggleForm}>
          {mostrarForm && editandoId === null ? '✕ Fechar' : '+ Nova Cerveja'}
        </button>
      </div>

      {mostrarForm && (
        <div className="form-card">
          <h2 className="form-title">
            {editandoId ? 'Editar Cerveja' : '+ Nova Cerveja'}
          </h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="c-nome">Nome *</label>
                <input
                  id="c-nome"
                  value={form.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  placeholder="Ex: Sol da Tarde"
                  className={erros.nome ? 'input-erro' : ''}
                />
                {erros.nome && <span className="erro-msg">{erros.nome}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="c-estilo">Estilo *</label>
                <input
                  id="c-estilo"
                  value={form.estilo}
                  onChange={(e) => handleChange('estilo', e.target.value)}
                  placeholder="Ex: Pilsen, IPA, Weizenbier"
                  className={erros.estilo ? 'input-erro' : ''}
                />
                {erros.estilo && <span className="erro-msg">{erros.estilo}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="c-teor">Teor Alcoólico (%) *</label>
                <input
                  id="c-teor"
                  type="number" step="0.1" min="0" max="100"
                  value={form.teorAlcoolico}
                  onChange={(e) => handleChange('teorAlcoolico', e.target.value)}
                  placeholder="Ex: 5.0"
                  className={erros.teorAlcoolico ? 'input-erro' : ''}
                />
                {erros.teorAlcoolico && <span className="erro-msg">{erros.teorAlcoolico}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="c-preco">Preço (R$) *</label>
                <input
                  id="c-preco"
                  type="number" step="0.01" min="0.01"
                  value={form.preco}
                  onChange={(e) => handleChange('preco', e.target.value)}
                  placeholder="Ex: 12.00"
                  className={erros.preco ? 'input-erro' : ''}
                />
                {erros.preco && <span className="erro-msg">{erros.preco}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="c-imagem">Imagem (URL ou caminho)</label>
                <input
                  id="c-imagem"
                  value={form.imagem}
                  onChange={(e) => handleChange('imagem', e.target.value)}
                  placeholder="Ex: /cervejas/sol-da-tarde.png"
                />
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

      {cervejas.length === 0 ? (
        <div className="empty-state">Nenhuma cerveja cadastrada ainda.</div>
      ) : (
        <div className="cards-grid">
          {cervejas.map((cerveja) => (
            <CervejaCard
              key={cerveja.id}
              cerveja={cerveja}
              onEditar={handleEditar}
              onExcluir={handleExcluir}
            />
          ))}
        </div>
      )}
    </div>
  );
}
