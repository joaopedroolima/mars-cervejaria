import { useState, useEffect } from "react";
import VendaCard from "../../components/VendaCard/VendaCard";
import "./Vendas.css";

const STORAGE_VENDAS = "mars_vendas";
const STORAGE_CERVEJAS = "mars_cervejas";
const STORAGE_CLIENTES = "mars_clientes";

const CERVEJAS_PADRAO = [
  { id: 1, nome: "Sol da Tarde", preco: "12.00" },
  { id: 2, nome: "Florest", preco: "18.00" },
  { id: 3, nome: "Blue Dark", preco: "15.00" },
];

const CLIENTES_INICIAIS = [
  {
    id: 1,
    nome: "João Silva",
    cpf: "123.456.789-00",
    contato: "(11) 99999-1234",
  },
  {
    id: 2,
    nome: "Maria Santos",
    cpf: "987.654.321-11",
    contato: "(11) 88888-5678",
  },
  {
    id: 3,
    nome: "Pedro Oliveira",
    cpf: "555.123.456-22",
    contato: "(21) 77777-9090",
  },
];

const VENDAS_INICIAIS = [
  {
    id: 1,
    cervejaId: 1,
    clienteId: 1,
    quantidade: "10",
    data: "2026-06-01",
    valorTotal: "120.00",
  },
  {
    id: 2,
    cervejaId: 2,
    clienteId: 2,
    quantidade: "5",
    data: "2026-06-03",
    valorTotal: "90.00",
  },
  {
    id: 3,
    cervejaId: 3,
    clienteId: 3,
    quantidade: "8",
    data: "2026-06-05",
    valorTotal: "120.00",
  },
  {
    id: 4,
    cervejaId: 1,
    clienteId: 1,
    quantidade: "15",
    data: "2026-06-10",
    valorTotal: "180.00",
  },
  {
    id: 5,
    cervejaId: 2,
    clienteId: 2,
    quantidade: "3",
    data: "2026-06-12",
    valorTotal: "54.00",
  },
];

const hoje = new Date().toISOString().split("T")[0];
const FORM_VAZIO = {
  cervejaId: "",
  clienteId: "",
  quantidade: "",
  data: hoje,
  valorTotal: "",
};

function lerStorage(chave, fallback) {
  try {
    const salvo = localStorage.getItem(chave);
    return salvo ? JSON.parse(salvo) : fallback;
  } catch {
    return fallback;
  }
}

export default function Vendas() {
  const [vendas, setVendas] = useState(() =>
    lerStorage(STORAGE_VENDAS, VENDAS_INICIAIS),
  );
  const [cervejas] = useState(() =>
    lerStorage(STORAGE_CERVEJAS, CERVEJAS_PADRAO),
  );
  const [clientes] = useState(() =>
    lerStorage(STORAGE_CLIENTES, CLIENTES_INICIAIS),
  );
  const [form, setForm] = useState(FORM_VAZIO);
  const [editandoId, setEditandoId] = useState(null);
  const [erros, setErros] = useState({});
  const [mostrarForm, setMostrarForm] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_VENDAS, JSON.stringify(vendas));
  }, [vendas]);

  const recalcularValor = (cervejaId, quantidade) => {
    const cerveja = cervejas.find((c) => c.id === Number(cervejaId));
    if (cerveja && quantidade && Number(quantidade) > 0)
      return (Number(cerveja.preco) * Number(quantidade)).toFixed(2);
    return "";
  };

  const handleChange = (campo, valor) => {
    setForm((prev) => {
      const novo = { ...prev, [campo]: valor };
      if (campo === "cervejaId" || campo === "quantidade") {
        const cid = campo === "cervejaId" ? valor : prev.cervejaId;
        const qtd = campo === "quantidade" ? valor : prev.quantidade;
        novo.valorTotal = recalcularValor(cid, qtd);
      }
      return novo;
    });
    setErros((prev) => ({ ...prev, [campo]: "" }));
  };

  const validar = () => {
    const e = {};
    if (!form.clienteId) e.clienteId = "Selecione um cliente";
    if (!form.cervejaId) e.cervejaId = "Selecione uma cerveja";
    const qtd = Number(form.quantidade);
    if (!form.quantidade || isNaN(qtd) || qtd < 1 || !Number.isInteger(qtd))
      e.quantidade = "Quantidade deve ser um número inteiro maior que zero";
    if (!form.data) e.data = "Data é obrigatória";
    const val = Number(form.valorTotal);
    if (!form.valorTotal || isNaN(val) || val <= 0)
      e.valorTotal = "Valor total inválido";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errosVal = validar();
    if (Object.keys(errosVal).length > 0) {
      setErros(errosVal);
      return;
    }

    const payload = {
      ...form,
      clienteId: Number(form.clienteId),
      cervejaId: Number(form.cervejaId),
      quantidade: String(Math.floor(Number(form.quantidade))),
      valorTotal: Number(form.valorTotal).toFixed(2),
    };

    if (editandoId !== null) {
      setVendas((prev) =>
        prev.map((v) => (v.id === editandoId ? { ...v, ...payload } : v)),
      );
    } else {
      setVendas((prev) => [...prev, { id: Date.now(), ...payload }]);
    }
    cancelar();
  };

  const handleEditar = (venda) => {
    setForm({
      clienteId: String(venda.clienteId),
      cervejaId: String(venda.cervejaId),
      quantidade: venda.quantidade,
      data: venda.data,
      valorTotal: venda.valorTotal,
    });
    setEditandoId(venda.id);
    setMostrarForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleExcluir = (id) => {
    if (window.confirm("Deseja excluir esta venda?"))
      setVendas((prev) => prev.filter((v) => v.id !== id));
  };

  const cancelar = () => {
    setForm(FORM_VAZIO);
    setEditandoId(null);
    setErros({});
    setMostrarForm(false);
  };

  const toggleForm = () => {
    if (mostrarForm && editandoId === null) {
      cancelar();
      return;
    }
    setEditandoId(null);
    setForm(FORM_VAZIO);
    setErros({});
    setMostrarForm(true);
  };

  const getNomeCerveja = (cervejaId) =>
    cervejas.find((c) => c.id === Number(cervejaId))?.nome ??
    "Cerveja removida";

  const getNomeCliente = (clienteId) =>
    clientes.find((c) => c.id === Number(clienteId))?.nome ??
    "Cliente removido";

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Vendas</h1>
        <button className="btn-primary" onClick={toggleForm}>
          {mostrarForm && editandoId === null ? "✕ Fechar" : "+ Nova Venda"}
        </button>
      </div>

      {mostrarForm && (
        <div className="form-card">
          <h2 className="form-title">
            {editandoId ? "Editar Venda" : "+ Nova Venda"}
          </h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="v-cliente">Cliente *</label>
                <select
                  id="v-cliente"
                  value={form.clienteId}
                  onChange={(e) => handleChange("clienteId", e.target.value)}
                  className={erros.clienteId ? "input-erro" : ""}
                >
                  <option value="">Selecione um cliente...</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
                {erros.clienteId && (
                  <span className="erro-msg">{erros.clienteId}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="v-cerveja">Cerveja *</label>
                <select
                  id="v-cerveja"
                  value={form.cervejaId}
                  onChange={(e) => handleChange("cervejaId", e.target.value)}
                  className={erros.cervejaId ? "input-erro" : ""}
                >
                  <option value="">Selecione uma cerveja...</option>
                  {cervejas.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome} — R$ {Number(c.preco).toFixed(2)}
                    </option>
                  ))}
                </select>
                {erros.cervejaId && (
                  <span className="erro-msg">{erros.cervejaId}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="v-qtd">Quantidade *</label>
                <input
                  id="v-qtd"
                  type="number"
                  min="1"
                  step="1"
                  value={form.quantidade}
                  onChange={(e) => handleChange("quantidade", e.target.value)}
                  placeholder="Ex: 10"
                  className={erros.quantidade ? "input-erro" : ""}
                />
                {erros.quantidade && (
                  <span className="erro-msg">{erros.quantidade}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="v-data">Data *</label>
                <input
                  id="v-data"
                  type="date"
                  value={form.data}
                  onChange={(e) => handleChange("data", e.target.value)}
                  className={erros.data ? "input-erro" : ""}
                />
                {erros.data && <span className="erro-msg">{erros.data}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="v-valor">Valor Total (R$) *</label>
                <input
                  id="v-valor"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={form.valorTotal}
                  onChange={(e) => handleChange("valorTotal", e.target.value)}
                  placeholder="Calculado automaticamente"
                  className={erros.valorTotal ? "input-erro" : ""}
                />
                {erros.valorTotal && (
                  <span className="erro-msg">{erros.valorTotal}</span>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editandoId ? "Salvar Alterações" : "Registrar Venda"}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={cancelar}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {vendas.length === 0 ? (
        <div className="empty-state">Nenhuma venda registrada ainda.</div>
      ) : (
        <div className="cards-grid">
          {vendas.map((venda) => (
            <VendaCard
              key={venda.id}
              venda={venda}
              cervejaNome={getNomeCerveja(venda.cervejaId)}
              clienteNome={getNomeCliente(venda.clienteId)}
              onEditar={handleEditar}
              onExcluir={handleExcluir}
            />
          ))}
        </div>
      )}
    </div>
  );
}
