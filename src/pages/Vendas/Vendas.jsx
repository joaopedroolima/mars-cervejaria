// useState e useEffect para gerenciar estado e persistência
import { useState, useEffect } from "react";
// Componente de card para exibir cada venda
import VendaCard from "../../components/VendaCard/VendaCard";
// Estilos específicos desta página
import "./Vendas.css";

// Chaves do localStorage para cada entidade
const STORAGE_VENDAS   = "mars_vendas";
const STORAGE_CERVEJAS = "mars_cervejas";
const STORAGE_CLIENTES = "mars_clientes";

// Cervejas padrão usadas se não houver cervejas salvas ainda
// Garantem que o select de cervejas nunca apareça vazio
const CERVEJAS_PADRAO = [
  { id: 1, nome: "Sol da Tarde", preco: "12.00" },
  { id: 2, nome: "Florest",      preco: "18.00" },
  { id: 3, nome: "Blue Dark",    preco: "15.00" },
];

// Clientes padrão usados se não houver clientes salvos
const CLIENTES_INICIAIS = [
  { id: 1, nome: "João Silva",    cpf: "123.456.789-00", contato: "(11) 99999-1234" },
  { id: 2, nome: "Maria Santos",  cpf: "987.654.321-11", contato: "(11) 88888-5678" },
  { id: 3, nome: "Pedro Oliveira",cpf: "555.123.456-22", contato: "(21) 77777-9090" },
];

// Vendas de exemplo para popular o sistema na primeira vez
const VENDAS_INICIAIS = [
  { id: 1, cervejaId: 1, clienteId: 1, quantidade: "10", data: "2026-06-01", valorTotal: "120.00" },
  { id: 2, cervejaId: 2, clienteId: 2, quantidade: "5",  data: "2026-06-03", valorTotal: "90.00"  },
  { id: 3, cervejaId: 3, clienteId: 3, quantidade: "8",  data: "2026-06-05", valorTotal: "120.00" },
  { id: 4, cervejaId: 1, clienteId: 1, quantidade: "15", data: "2026-06-10", valorTotal: "180.00" },
  { id: 5, cervejaId: 2, clienteId: 2, quantidade: "3",  data: "2026-06-12", valorTotal: "54.00"  },
];

// Data de hoje no formato YYYY-MM-DD (padrão do input type="date")
const hoje = new Date().toISOString().split("T")[0];

// Estado vazio do formulário — campo de data já começa com hoje
const FORM_VAZIO = {
  cervejaId:  "",
  clienteId:  "",
  quantidade: "",
  data:       hoje,
  valorTotal: "",
};

// Lê do localStorage com segurança; retorna fallback se der erro ou estiver vazio
function lerStorage(chave, fallback) {
  try {
    const salvo = localStorage.getItem(chave);
    return salvo ? JSON.parse(salvo) : fallback;
  } catch {
    return fallback;
  }
}

// Componente principal da página de Vendas (CRUD completo com JOIN ao Clientes e Cervejas)
export default function Vendas() {
  // Lista de vendas — inicia lendo localStorage; se vazio usa as vendas de exemplo
  const [vendas, setVendas]   = useState(() => lerStorage(STORAGE_VENDAS,   VENDAS_INICIAIS));
  // Lista de cervejas (somente leitura aqui) — usada para preencher o select e calcular preço
  const [cervejas]            = useState(() => lerStorage(STORAGE_CERVEJAS,  CERVEJAS_PADRAO));
  // Lista de clientes (somente leitura) — usada para preencher o select
  const [clientes]            = useState(() => lerStorage(STORAGE_CLIENTES,  CLIENTES_INICIAIS));
  // Valores do formulário
  const [form, setForm]       = useState(FORM_VAZIO);
  // ID da venda sendo editada (null = modo criação)
  const [editandoId, setEditandoId] = useState(null);
  // Erros de validação
  const [erros, setErros]     = useState({});
  // Controla a visibilidade do formulário
  const [mostrarForm, setMostrarForm] = useState(false);

  // Salva as vendas no localStorage sempre que a lista mudar
  useEffect(() => {
    localStorage.setItem(STORAGE_VENDAS, JSON.stringify(vendas));
  }, [vendas]);

  // Calcula o valor total automaticamente: preço da cerveja × quantidade
  const recalcularValor = (cervejaId, quantidade) => {
    // Busca a cerveja com o ID passado dentro do array de cervejas
    const cerveja = cervejas.find((c) => c.id === Number(cervejaId));
    // Se encontrou a cerveja e a quantidade é válida, calcula e retorna como string com 2 casas
    if (cerveja && quantidade && Number(quantidade) > 0)
      return (Number(cerveja.preco) * Number(quantidade)).toFixed(2);
    return ""; // retorna vazio se os dados não forem suficientes
  };

  // Atualiza um campo do formulário e recalcula o valor total quando necessário
  const handleChange = (campo, valor) => {
    setForm((prev) => {
      // Cria uma cópia do form com o campo atualizado
      const novo = { ...prev, [campo]: valor };
      // Se o campo alterado for cerveja ou quantidade, recalcula o valor total
      if (campo === "cervejaId" || campo === "quantidade") {
        // Usa o novo valor se o campo atual foi alterado, ou o valor anterior dos outros campos
        const cid = campo === "cervejaId" ? valor : prev.cervejaId;
        const qtd = campo === "quantidade" ? valor : prev.quantidade;
        novo.valorTotal = recalcularValor(cid, qtd);
      }
      return novo;
    });
    // Limpa o erro do campo que foi alterado
    setErros((prev) => ({ ...prev, [campo]: "" }));
  };

  // Valida todos os campos antes de salvar
  const validar = () => {
    const e = {};
    if (!form.clienteId) e.clienteId = "Selecione um cliente";
    if (!form.cervejaId) e.cervejaId = "Selecione uma cerveja";
    const qtd = Number(form.quantidade);
    // Quantidade deve ser inteiro positivo
    if (!form.quantidade || isNaN(qtd) || qtd < 1 || !Number.isInteger(qtd))
      e.quantidade = "Quantidade deve ser um número inteiro maior que zero";
    if (!form.data) e.data = "Data é obrigatória";
    const val = Number(form.valorTotal);
    if (!form.valorTotal || isNaN(val) || val <= 0)
      e.valorTotal = "Valor total inválido";
    return e;
  };

  // Chamado ao submeter o formulário
  const handleSubmit = (e) => {
    e.preventDefault(); // evita recarregar a página

    const errosVal = validar();
    if (Object.keys(errosVal).length > 0) { setErros(errosVal); return; }

    // Monta o objeto final garantindo os tipos corretos de cada campo
    const payload = {
      ...form,
      clienteId:  Number(form.clienteId),                          // string → número
      cervejaId:  Number(form.cervejaId),                          // string → número
      quantidade: String(Math.floor(Number(form.quantidade))),     // garante inteiro como string
      valorTotal: Number(form.valorTotal).toFixed(2),              // 2 casas decimais
    };

    if (editandoId !== null) {
      // Modo edição: substitui a venda com map()
      setVendas((prev) => prev.map((v) => (v.id === editandoId ? { ...v, ...payload } : v)));
    } else {
      // Modo criação: adiciona nova venda com ID único
      setVendas((prev) => [...prev, { id: Date.now(), ...payload }]);
    }
    cancelar();
  };

  // Preenche o formulário com os dados da venda selecionada para edição
  const handleEditar = (venda) => {
    setForm({
      clienteId:  String(venda.clienteId),  // converte para string pois o select trabalha com string
      cervejaId:  String(venda.cervejaId),
      quantidade: venda.quantidade,
      data:       venda.data,
      valorTotal: venda.valorTotal,
    });
    setEditandoId(venda.id);
    setMostrarForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Exclui uma venda após confirmação do usuário
  const handleExcluir = (id) => {
    if (window.confirm("Deseja excluir esta venda?"))
      setVendas((prev) => prev.filter((v) => v.id !== id));
  };

  // Reseta o formulário e fecha o painel
  const cancelar = () => {
    setForm(FORM_VAZIO);
    setEditandoId(null);
    setErros({});
    setMostrarForm(false);
  };

  // Alterna a visibilidade do formulário
  const toggleForm = () => {
    if (mostrarForm && editandoId === null) { cancelar(); return; }
    setEditandoId(null);
    setForm(FORM_VAZIO);
    setErros({});
    setMostrarForm(true);
  };

  // Busca o nome da cerveja pelo ID — retorna "Cerveja removida" se não encontrar
  // Isso simula um JOIN: busca dados de outra tabela (cervejas) pelo ID relacionado
  const getNomeCerveja = (cervejaId) =>
    cervejas.find((c) => c.id === Number(cervejaId))?.nome ?? "Cerveja removida";

  // Busca o nome do cliente pelo ID — retorna "Cliente removido" se não encontrar
  const getNomeCliente = (clienteId) =>
    clientes.find((c) => c.id === Number(clienteId))?.nome ?? "Cliente removido";

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
          <h2 className="form-title">
            {editandoId ? "Editar Venda" : "+ Nova Venda"}
          </h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">

              {/* Select de Cliente — gerado com map() a partir da lista de clientes */}
              <div className="form-group">
                <label htmlFor="v-cliente">Cliente *</label>
                <select
                  id="v-cliente"
                  value={form.clienteId}
                  onChange={(e) => handleChange("clienteId", e.target.value)}
                  className={erros.clienteId ? "input-erro" : ""}
                >
                  <option value="">Selecione um cliente...</option>
                  {/* Gera uma opção para cada cliente cadastrado */}
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
                {erros.clienteId && <span className="erro-msg">{erros.clienteId}</span>}
              </div>

              {/* Select de Cerveja — ao mudar, recalcula o valor total automaticamente */}
              <div className="form-group">
                <label htmlFor="v-cerveja">Cerveja *</label>
                <select
                  id="v-cerveja"
                  value={form.cervejaId}
                  onChange={(e) => handleChange("cervejaId", e.target.value)}
                  className={erros.cervejaId ? "input-erro" : ""}
                >
                  <option value="">Selecione uma cerveja...</option>
                  {/* Exibe o nome e o preço de cada cerveja na opção */}
                  {cervejas.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome} — R$ {Number(c.preco).toFixed(2)}
                    </option>
                  ))}
                </select>
                {erros.cervejaId && <span className="erro-msg">{erros.cervejaId}</span>}
              </div>

              {/* Campo de quantidade — ao mudar, recalcula valorTotal */}
              <div className="form-group">
                <label htmlFor="v-qtd">Quantidade *</label>
                <input
                  id="v-qtd"
                  type="number" min="1" step="1"
                  value={form.quantidade}
                  onChange={(e) => handleChange("quantidade", e.target.value)}
                  placeholder="Ex: 10"
                  className={erros.quantidade ? "input-erro" : ""}
                />
                {erros.quantidade && <span className="erro-msg">{erros.quantidade}</span>}
              </div>

              {/* Campo de data */}
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

              {/* Campo de valor total — preenchido automaticamente, mas editável */}
              <div className="form-group">
                <label htmlFor="v-valor">Valor Total (R$) *</label>
                <input
                  id="v-valor"
                  type="number" step="0.01" min="0.01"
                  value={form.valorTotal}
                  onChange={(e) => handleChange("valorTotal", e.target.value)}
                  placeholder="Calculado automaticamente"
                  className={erros.valorTotal ? "input-erro" : ""}
                />
                {erros.valorTotal && <span className="erro-msg">{erros.valorTotal}</span>}
              </div>
            </div>

            {/* Botões de ação */}
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editandoId ? "Salvar Alterações" : "Registrar Venda"}
              </button>
              <button type="button" className="btn-secondary" onClick={cancelar}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de vendas ou mensagem de vazio */}
      {vendas.length === 0 ? (
        <div className="empty-state">Nenhuma venda registrada ainda.</div>
      ) : (
        <div className="cards-grid">
          {vendas.map((venda) => (
            <VendaCard
              key={venda.id}
              venda={venda}
              // Resolve o nome da cerveja e do cliente pelo ID (JOIN simulado)
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
