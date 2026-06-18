import { useState, useEffect } from "react";
import VendaCard from "../../components/VendaCard/VendaCard";
import "./Vendas.css";

// Chaves do localStorage para cada entidade
const STORAGE_VENDAS   = "mars_vendas";
const STORAGE_CERVEJAS = "mars_cervejas";
const STORAGE_CLIENTES = "mars_clientes";

// Cervejas padrão se não houver cervejas cadastradas ainda
const CERVEJAS_PADRAO = [
  { id: 1, nome: "Sol da Tarde", preco: "12.00" },
  { id: 2, nome: "Florest",      preco: "18.00" },
  { id: 3, nome: "Blue Dark",    preco: "15.00" },
];

// Clientes padrão se não houver clientes cadastrados ainda
const CLIENTES_INICIAIS = [
  { id: 1, nome: "João Silva",     cpf: "123.456.789-00", contato: "(11) 99999-1234" },
  { id: 2, nome: "Maria Santos",   cpf: "987.654.321-11", contato: "(11) 88888-5678" },
  { id: 3, nome: "Pedro Oliveira", cpf: "555.123.456-22", contato: "(21) 77777-9090" },
];

// Vendas de exemplo com o novo formato: cada venda tem um array de itens (carrinho)
const VENDAS_INICIAIS = [
  {
    id: 1, clienteId: 1, data: "2026-06-01", valorTotal: "210.00",
    itens: [
      { cervejaId: 1, cervejaNome: "Sol da Tarde", quantidade: 10, valorUnitario: "12.00", subtotal: "120.00" },
      { cervejaId: 2, cervejaNome: "Florest",      quantidade: 5,  valorUnitario: "18.00", subtotal: "90.00"  },
    ],
  },
  {
    id: 2, clienteId: 2, data: "2026-06-03", valorTotal: "90.00",
    itens: [
      { cervejaId: 2, cervejaNome: "Florest", quantidade: 5, valorUnitario: "18.00", subtotal: "90.00" },
    ],
  },
  {
    id: 3, clienteId: 3, data: "2026-06-05", valorTotal: "120.00",
    itens: [
      { cervejaId: 3, cervejaNome: "Blue Dark", quantidade: 8, valorUnitario: "15.00", subtotal: "120.00" },
    ],
  },
  {
    id: 4, clienteId: 1, data: "2026-06-10", valorTotal: "234.00",
    itens: [
      { cervejaId: 1, cervejaNome: "Sol da Tarde", quantidade: 15, valorUnitario: "12.00", subtotal: "180.00" },
      { cervejaId: 3, cervejaNome: "Blue Dark",    quantidade: 3,  valorUnitario: "18.00", subtotal: "54.00"  },
    ],
  },
];

// Data de hoje no formato YYYY-MM-DD que o input type="date" exige
const hoje = new Date().toISOString().split("T")[0];

// Lê do localStorage com segurança; retorna fallback se der erro ou estiver vazio
function lerStorage(chave, fallback) {
  try {
    const salvo = localStorage.getItem(chave);
    return salvo ? JSON.parse(salvo) : fallback;
  } catch {
    return fallback;
  }
}

// Migra vendas no formato antigo (um único cervejaId) para o novo formato (array de itens)
// Garante compatibilidade com dados já salvos no localStorage antes desta atualização
function carregarVendas(cervejasList) {
  const dados = lerStorage(STORAGE_VENDAS, VENDAS_INICIAIS);
  return dados.map((v) => {
    // Já está no novo formato — retorna sem mudança
    if (v.itens) return v;
    // Formato antigo: converte para novo criando um array com o único item
    const cerveja = cervejasList.find((c) => c.id === Number(v.cervejaId));
    return {
      id: v.id,
      clienteId: v.clienteId,
      data: v.data,
      itens: [{
        cervejaId:     Number(v.cervejaId),
        cervejaNome:   cerveja?.nome  ?? "Cerveja",
        quantidade:    Number(v.quantidade),
        valorUnitario: cerveja?.preco ?? "0.00",
        subtotal:      v.valorTotal,
      }],
      valorTotal: v.valorTotal,
    };
  });
}

// Componente principal da página de Vendas — CRUD com carrinho de compras
export default function Vendas() {
  const [cervejas] = useState(() => lerStorage(STORAGE_CERVEJAS, CERVEJAS_PADRAO));
  const [clientes] = useState(() => lerStorage(STORAGE_CLIENTES, CLIENTES_INICIAIS));
  // Carrega vendas já migrando possíveis dados no formato antigo
  const [vendas, setVendas] = useState(() =>
    carregarVendas(lerStorage(STORAGE_CERVEJAS, CERVEJAS_PADRAO))
  );

  // Dados gerais da venda (cliente e data)
  const [clienteId, setClienteId] = useState("");
  const [data, setData]           = useState(hoje);

  // Item que o usuário está prestes a adicionar ao carrinho
  const [cervejaIdAtual, setCervejaIdAtual] = useState("");
  const [qtdAtual, setQtdAtual]             = useState("");

  // O carrinho em si: array de itens adicionados à venda atual
  const [carrinho, setCarrinho] = useState([]);

  // Controles do formulário
  const [editandoId, setEditandoId]   = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [erros, setErros]             = useState({});   // erros dos dados gerais
  const [erroItem, setErroItem]       = useState({});   // erros do item sendo adicionado

  // Sempre que a lista de vendas mudar, persiste no localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_VENDAS, JSON.stringify(vendas));
  }, [vendas]);

  // Calcula o total do carrinho somando os subtotais de cada item
  const totalCarrinho = carrinho
    .reduce((s, item) => s + Number(item.subtotal), 0)
    .toFixed(2);

  // Adiciona um item ao carrinho ao clicar em "+ Adicionar"
  const adicionarItem = () => {
    const errs = {};
    if (!cervejaIdAtual) errs.cervejaId = "Selecione uma cerveja";
    const qtd = Number(qtdAtual);
    if (!qtdAtual || isNaN(qtd) || qtd < 1 || !Number.isInteger(qtd))
      errs.quantidade = "Quantidade deve ser um inteiro maior que zero";
    if (Object.keys(errs).length > 0) { setErroItem(errs); return; }

    const cerveja = cervejas.find((c) => c.id === Number(cervejaIdAtual));
    const subtotal = (Number(cerveja.preco) * qtd).toFixed(2);

    // Se a mesma cerveja já está no carrinho, soma a quantidade em vez de duplicar
    const idxExistente = carrinho.findIndex((i) => i.cervejaId === Number(cervejaIdAtual));
    if (idxExistente >= 0) {
      const atualizado = [...carrinho];
      const qtdNova = atualizado[idxExistente].quantidade + qtd;
      atualizado[idxExistente] = {
        ...atualizado[idxExistente],
        quantidade: qtdNova,
        subtotal: (Number(cerveja.preco) * qtdNova).toFixed(2),
      };
      setCarrinho(atualizado);
    } else {
      // Cerveja nova: adiciona como novo item no carrinho
      setCarrinho((prev) => [...prev, {
        cervejaId:     Number(cervejaIdAtual),
        cervejaNome:   cerveja.nome,
        quantidade:    qtd,
        valorUnitario: cerveja.preco,
        subtotal,
      }]);
    }

    // Limpa o formulário de item para o próximo
    setCervejaIdAtual("");
    setQtdAtual("");
    setErroItem({});
  };

  // Remove um item do carrinho pelo índice
  const removerItem = (idx) => {
    setCarrinho((prev) => prev.filter((_, i) => i !== idx));
  };

  // Valida os dados gerais antes de finalizar a venda
  const validar = () => {
    const e = {};
    if (!clienteId) e.clienteId = "Selecione um cliente";
    if (!data)      e.data      = "Data é obrigatória";
    if (carrinho.length === 0) e.carrinho = "Adicione pelo menos uma cerveja ao carrinho";
    return e;
  };

  // Chamado ao clicar em "Finalizar Venda" ou "Salvar Alterações"
  const handleSubmit = (e) => {
    e.preventDefault();
    const errosVal = validar();
    if (Object.keys(errosVal).length > 0) { setErros(errosVal); return; }

    const payload = {
      clienteId: Number(clienteId),
      data,
      itens:      carrinho,
      valorTotal: totalCarrinho,
    };

    if (editandoId !== null) {
      // Edição: substitui a venda com map()
      setVendas((prev) => prev.map((v) => v.id === editandoId ? { ...v, ...payload } : v));
    } else {
      // Criação: adiciona venda com ID único gerado pelo timestamp
      setVendas((prev) => [...prev, { id: Date.now(), ...payload }]);
    }
    cancelar();
  };

  // Preenche o formulário com os dados da venda selecionada para edição
  const handleEditar = (venda) => {
    setClienteId(String(venda.clienteId));
    setData(venda.data);
    setCarrinho([...venda.itens]); // cópia do array de itens
    setEditandoId(venda.id);
    setMostrarForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Exclui uma venda após confirmação
  const handleExcluir = (id) => {
    if (window.confirm("Deseja excluir esta venda?"))
      setVendas((prev) => prev.filter((v) => v.id !== id));
  };

  // Reseta todos os estados e fecha o formulário
  const cancelar = () => {
    setClienteId("");
    setData(hoje);
    setCarrinho([]);
    setCervejaIdAtual("");
    setQtdAtual("");
    setErros({});
    setErroItem({});
    setEditandoId(null);
    setMostrarForm(false);
  };

  const toggleForm = () => {
    if (mostrarForm && editandoId === null) { cancelar(); return; }
    cancelar();
    setMostrarForm(true);
  };

  // Busca o nome do cliente pelo ID para exibição nos cards
  const getNomeCliente = (id) =>
    clientes.find((c) => c.id === Number(id))?.nome ?? "Cliente removido";

  return (
    <div className="page-container">

      {/* Cabeçalho da página */}
      <div className="page-header">
        <h1 className="page-title">Vendas</h1>
        <button className="btn-primary" onClick={toggleForm}>
          {mostrarForm && editandoId === null ? "✕ Fechar" : "+ Nova Venda"}
        </button>
      </div>

      {/* Formulário — visível somente quando mostrarForm for true */}
      {mostrarForm && (
        <div className="form-card">
          <h2 className="form-title">{editandoId ? "Editar Venda" : "+ Nova Venda"}</h2>
          <form onSubmit={handleSubmit} noValidate>

            {/* ── Seção 1: Dados gerais da venda ── */}
            <div className="form-grid">

              {/* Select de cliente */}
              <div className="form-group">
                <label htmlFor="v-cliente">Cliente *</label>
                <select
                  id="v-cliente"
                  value={clienteId}
                  onChange={(e) => {
                    setClienteId(e.target.value);
                    setErros((p) => ({ ...p, clienteId: "" }));
                  }}
                  className={erros.clienteId ? "input-erro" : ""}
                >
                  <option value="">Selecione um cliente...</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
                {erros.clienteId && <span className="erro-msg">{erros.clienteId}</span>}
              </div>

              {/* Campo de data */}
              <div className="form-group">
                <label htmlFor="v-data">Data *</label>
                <input
                  id="v-data"
                  type="date"
                  value={data}
                  onChange={(e) => {
                    setData(e.target.value);
                    setErros((p) => ({ ...p, data: "" }));
                  }}
                  className={erros.data ? "input-erro" : ""}
                />
                {erros.data && <span className="erro-msg">{erros.data}</span>}
              </div>
            </div>

            {/* ── Seção 2: Carrinho de compras ── */}
            <div className="carrinho-section">
              <p className="carrinho-titulo">Cervejas do Pedido</p>

              {/* Linha para adicionar um item ao carrinho */}
              <div className="carrinho-add">
                <div className="form-group" style={{ flex: 2 }}>
                  <select
                    value={cervejaIdAtual}
                    onChange={(e) => {
                      setCervejaIdAtual(e.target.value);
                      setErroItem((p) => ({ ...p, cervejaId: "" }));
                    }}
                    className={erroItem.cervejaId ? "input-erro" : ""}
                  >
                    <option value="">Selecione uma cerveja...</option>
                    {cervejas.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome} — R$ {Number(c.preco).toFixed(2)}
                      </option>
                    ))}
                  </select>
                  {erroItem.cervejaId && <span className="erro-msg">{erroItem.cervejaId}</span>}
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={qtdAtual}
                    onChange={(e) => {
                      setQtdAtual(e.target.value);
                      setErroItem((p) => ({ ...p, quantidade: "" }));
                    }}
                    placeholder="Qtd"
                    className={erroItem.quantidade ? "input-erro" : ""}
                  />
                  {erroItem.quantidade && <span className="erro-msg">{erroItem.quantidade}</span>}
                </div>

                {/* Botão que adiciona o item selecionado ao carrinho */}
                <button type="button" className="btn-primary carrinho-btn-add" onClick={adicionarItem}>
                  + Adicionar
                </button>
              </div>

              {/* Mensagem de erro se tentar finalizar sem itens */}
              {erros.carrinho && <span className="erro-msg">{erros.carrinho}</span>}

              {/* Lista de itens adicionados ao carrinho */}
              {carrinho.length > 0 && (
                <div className="carrinho-lista">
                  {/* Cabeçalho da tabela do carrinho */}
                  <div className="carrinho-header">
                    <span>Cerveja</span>
                    <span>Qtd</span>
                    <span>Unit.</span>
                    <span>Subtotal</span>
                    <span></span>
                  </div>

                  {/* Um item por linha */}
                  {carrinho.map((item, i) => (
                    <div key={i} className="carrinho-item">
                      <span className="carrinho-item-nome">{item.cervejaNome}</span>
                      <span>{item.quantidade} un.</span>
                      <span>R$ {Number(item.valorUnitario).toFixed(2)}</span>
                      <span className="carrinho-item-sub">R$ {Number(item.subtotal).toFixed(2)}</span>
                      {/* Botão X para remover o item do carrinho */}
                      <button
                        type="button"
                        className="carrinho-item-remover"
                        onClick={() => removerItem(i)}
                        title="Remover item"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {/* Linha de total do pedido */}
                  <div className="carrinho-total">
                    <span>Total do Pedido</span>
                    <span>R$ {totalCarrinho}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Botões de ação finais */}
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editandoId ? "Salvar Alterações" : "Finalizar Venda"}
              </button>
              <button type="button" className="btn-secondary" onClick={cancelar}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de vendas cadastradas */}
      {vendas.length === 0 ? (
        <div className="empty-state">Nenhuma venda registrada ainda.</div>
      ) : (
        <div className="cards-grid">
          {vendas.map((venda) => (
            <VendaCard
              key={venda.id}
              venda={venda}
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
