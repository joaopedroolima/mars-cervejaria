// useState e useEffect para gerenciar estado e efeitos colaterais
import { useState, useEffect } from 'react';
// Componente de card reutilizável para exibir cada cliente
import ClienteCard from '../../components/ClienteCard/ClienteCard';

// Chave usada para ler e salvar dados no localStorage do navegador
const STORAGE_KEY = 'mars_clientes';

// Clientes pré-cadastrados que aparecem na primeira vez que o sistema é aberto
const CLIENTES_INICIAIS = [
  { id: 1, nome: "João Silva",    cpf: '123.456.789-00', contato: '(11) 99999-1234' },
  { id: 2, nome: 'Maria Santos',  cpf: '987.654.321-11', contato: '(11) 88888-5678' },
  { id: 3, nome: 'Pedro Oliveira',cpf: '555.123.456-22', contato: '(21) 77777-9090' },
];

// Estado vazio do formulário — todos os campos em branco
const FORM_VAZIO = { nome: '', cpf: '', contato: '' };

// Função auxiliar para ler do localStorage com segurança
// Se der erro (JSON corrompido), retorna o valor padrão (fallback)
function lerStorage(chave, fallback) {
  try {
    const salvo = localStorage.getItem(chave);
    // Se existir dado salvo, converte de texto para objeto; senão retorna o fallback
    return salvo ? JSON.parse(salvo) : fallback;
  } catch {
    return fallback;
  }
}

// Valida se o CPF tem exatamente 11 dígitos numéricos
// replace(/\D/g, '') remove tudo que não for dígito (pontos, traços, espaços)
function cpfValido(cpf) {
  return cpf.replace(/\D/g, '').length === 11;
}

// Componente principal da página de Clientes (CRUD completo)
export default function Clientes() {
  // Lista de clientes — inicia lendo do localStorage; se vazio, usa CLIENTES_INICIAIS
  const [clientes, setClientes]       = useState(() => lerStorage(STORAGE_KEY, CLIENTES_INICIAIS));
  // Valores atuais dos campos do formulário
  const [form, setForm]               = useState(FORM_VAZIO);
  // ID do cliente sendo editado (null = modo criação)
  const [editandoId, setEditandoId]   = useState(null);
  // Erros de validação por campo
  const [erros, setErros]             = useState({});
  // Controla se o formulário está visível
  const [mostrarForm, setMostrarForm] = useState(false);

  // Sempre que a lista de clientes mudar, salva automaticamente no localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes));
  }, [clientes]); // executa apenas quando "clientes" mudar

  // Atualiza um campo e limpa seu erro correspondente
  const handleChange = (campo, valor) => {
    // Spread (...prev) mantém os outros campos; [campo]: valor atualiza o campo específico
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErros((prev) => ({ ...prev, [campo]: '' }));
  };

  // Valida todos os campos antes de salvar
  const validar = () => {
    const e = {};
    // Nome obrigatório
    if (!form.nome.trim()) e.nome = 'Nome é obrigatório';

    // CPF obrigatório e com 11 dígitos
    if (!form.cpf.trim()) {
      e.cpf = 'CPF é obrigatório';
    } else if (!cpfValido(form.cpf)) {
      e.cpf = 'CPF deve conter 11 dígitos';
    }

    // Contato obrigatório
    if (!form.contato.trim()) e.contato = 'Contato é obrigatório';
    return e; // retorna {} se tudo ok
  };

  // Chamado ao submeter o formulário
  const handleSubmit = (e) => {
    e.preventDefault(); // impede recarregamento da página

    const errosVal = validar();
    // Para por aqui se houver erros
    if (Object.keys(errosVal).length > 0) { setErros(errosVal); return; }

    // Monta o objeto limpo (sem espaços extras nas bordas)
    const payload = {
      nome:    form.nome.trim(),
      cpf:     form.cpf.trim(),
      contato: form.contato.trim(),
    };

    if (editandoId !== null) {
      // Modo edição: substitui o cliente com ID igual usando map()
      setClientes((prev) => prev.map((c) => (c.id === editandoId ? { ...c, ...payload } : c)));
    } else {
      // Modo criação: adiciona novo cliente ao final do array
      // Date.now() gera um ID único baseado no timestamp atual
      setClientes((prev) => [...prev, { id: Date.now(), ...payload }]);
    }
    cancelar(); // fecha e reseta o formulário
  };

  // Preenche o formulário com os dados do cliente selecionado para edição
  const handleEditar = (cliente) => {
    setForm({
      nome:    cliente.nome,
      cpf:     cliente.cpf,
      contato: cliente.contato,
    });
    setEditandoId(cliente.id);   // entra no modo edição com o ID deste cliente
    setMostrarForm(true);        // abre o formulário
    window.scrollTo({ top: 0, behavior: 'smooth' }); // rola para o topo
  };

  // Exclui um cliente após confirmação
  const handleExcluir = (id) => {
    if (window.confirm('Deseja excluir este cliente?'))
      // filter() retorna um novo array sem o cliente com o id passado
      setClientes((prev) => prev.filter((c) => c.id !== id));
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

  return (
    <div className="page-container">

      {/* Cabeçalho da página: título + botão de novo cliente */}
      <div className="page-header">
        <h1 className="page-title">Clientes</h1>
        <button className="btn-primary" onClick={toggleForm}>
          {mostrarForm && editandoId === null ? '✕ Fechar' : '+ Novo Cliente'}
        </button>
      </div>

      {/* Formulário — exibido somente quando mostrarForm for true */}
      {mostrarForm && (
        <div className="form-card">
          <h2 className="form-title">
            {editandoId ? 'Editar Cliente' : '+ Novo Cliente'}
          </h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">

              {/* Campo: Nome */}
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

              {/* Campo: CPF */}
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

              {/* Campo: Contato (telefone ou e-mail) */}
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

            {/* Botões de ação */}
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

      {/* Lista de clientes ou mensagem de vazio */}
      {clientes.length === 0 ? (
        <div className="empty-state">Nenhum cliente cadastrado ainda.</div>
      ) : (
        // Grid de cards — um ClienteCard para cada cliente da lista
        <div className="cards-grid">
          {clientes.map((cliente) => (
            // key único obrigatório para listas React
            <ClienteCard
              key={cliente.id}
              cliente={cliente}           // dados do cliente
              onEditar={handleEditar}     // callback de edição
              onExcluir={handleExcluir}   // callback de exclusão
            />
          ))}
        </div>
      )}
    </div>
  );
}
