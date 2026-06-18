// useState gerencia os estados do componente (lista, formulário, erros)
// useEffect executa código quando o estado muda (usado para salvar no localStorage)
import { useState, useEffect } from 'react';
// Componente de card reutilizável para exibir cada cerveja
import CervejaCard from '../../components/CervejaCard/CervejaCard';
// Estilos específicos desta página
import './Cervejas.css';

// Chave usada para salvar e ler do localStorage
const STORAGE_KEY = 'mars_cervejas';

// Dados iniciais que aparecem quando o sistema é aberto pela primeira vez (sem nada salvo)
const CERVEJAS_INICIAIS = [
  { id: 1, nome: 'Sol da Tarde', estilo: 'Pilsen',         teorAlcoolico: '5.0', preco: '12.00', imagem: '/cervejas/sol-da-tarde.png' },
  { id: 2, nome: 'Florest',      estilo: 'Belgian Tripel', teorAlcoolico: '8.0', preco: '18.00', imagem: '/cervejas/florest.png'      },
  { id: 3, nome: 'Blue Dark',    estilo: 'Weizenbier',     teorAlcoolico: '5.5', preco: '15.00', imagem: '/cervejas/blue-dark.png'    },
];

// Estado vazio do formulário — usado ao abrir o form ou ao cancelar
const FORM_VAZIO = { nome: '', estilo: '', teorAlcoolico: '', preco: '', imagem: '' };

// Função que carrega as cervejas do localStorage
// Se não houver nada salvo, retorna os dados iniciais
// Se houver dados antigos sem imagem, faz uma migração para adicionar a imagem correta
function carregarCervejas() {
  try {
    // Tenta ler a chave 'mars_cervejas' do localStorage
    const salvo = localStorage.getItem(STORAGE_KEY);
    // Se não houver nada salvo, usa os dados iniciais
    if (!salvo) return CERVEJAS_INICIAIS;

    // Converte o texto JSON salvo de volta para array de objetos
    const dados = JSON.parse(salvo);

    // Migração: garante que cervejas antigas sem campo "imagem" recebam a imagem correta
    return dados.map((c) => {
      // Se já tiver imagem, retorna sem mudança
      if (c.imagem) return c;
      // Procura nos dados iniciais uma cerveja com o mesmo id
      const inicial = CERVEJAS_INICIAIS.find((i) => i.id === c.id);
      // Se encontrar, adiciona a imagem; senão retorna a cerveja sem imagem
      return inicial ? { ...c, imagem: inicial.imagem } : c;
    });
  } catch {
    // Se der erro ao ler o localStorage, retorna os dados iniciais
    return CERVEJAS_INICIAIS;
  }
}

// Componente principal da página de Cervejas (CRUD completo)
export default function Cervejas() {
  // Lista de cervejas — inicia lendo do localStorage via função carregarCervejas
  const [cervejas, setCervejas]         = useState(carregarCervejas);
  // Valores atuais do formulário (nome, estilo, teor, preço, imagem)
  const [form, setForm]                 = useState(FORM_VAZIO);
  // ID da cerveja sendo editada (null = nenhuma, ou seja, modo "criar")
  const [editandoId, setEditandoId]     = useState(null);
  // Objeto com erros de validação: ex: { nome: 'Nome é obrigatório' }
  const [erros, setErros]               = useState({});
  // Controla se o formulário está visível ou não
  const [mostrarForm, setMostrarForm]   = useState(false);

  // useEffect: sempre que a lista de cervejas mudar, salva no localStorage automaticamente
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cervejas));
  }, [cervejas]); // o array [cervejas] diz "execute este efeito quando 'cervejas' mudar"

  // Valida os campos do formulário antes de salvar
  const validar = () => {
    const e = {};
    // Nome não pode ser vazio (trim() remove espaços)
    if (!form.nome.trim()) e.nome = 'Nome é obrigatório';
    // Estilo não pode ser vazio
    if (!form.estilo.trim()) e.estilo = 'Estilo é obrigatório';
    // Teor alcoólico deve ser um número entre 0 e 100
    const teor = Number(form.teorAlcoolico);
    if (!form.teorAlcoolico || isNaN(teor) || teor < 0 || teor > 100)
      e.teorAlcoolico = 'Teor inválido (0–100)';
    // Preço deve ser um número positivo
    const preco = Number(form.preco);
    if (!form.preco || isNaN(preco) || preco <= 0)
      e.preco = 'Preço deve ser maior que zero';
    return e; // retorna {} se tudo ok
  };

  // Atualiza um campo do formulário e limpa o erro daquele campo
  const handleChange = (campo, valor) => {
    // Spread (...prev) copia todos os campos anteriores; [campo]: valor atualiza só o campo alterado
    setForm((prev) => ({ ...prev, [campo]: valor }));
    // Limpa o erro do campo que foi alterado (mantém os outros erros intactos)
    setErros((prev) => ({ ...prev, [campo]: '' }));
  };

  // Chamado ao submeter o formulário (criar ou editar)
  const handleSubmit = (e) => {
    // Impede o comportamento padrão do HTML (recarregar a página)
    e.preventDefault();
    // Valida os campos
    const errosVal = validar();
    // Se tiver erros, exibe e para por aqui
    if (Object.keys(errosVal).length > 0) { setErros(errosVal); return; }

    if (editandoId !== null) {
      // Modo edição: percorre o array com map() e substitui só a cerveja com o ID igual
      setCervejas((prev) => prev.map((c) => (c.id === editandoId ? { ...c, ...form } : c)));
    } else {
      // Modo criação: adiciona nova cerveja ao final do array
      // Date.now() gera um número único baseado no tempo — usado como ID
      setCervejas((prev) => [...prev, { id: Date.now(), ...form }]);
    }
    // Reseta o formulário após salvar
    cancelar();
  };

  // Chamado quando o usuário clica em "Editar" em um card
  const handleEditar = (cerveja) => {
    // Preenche o formulário com os dados da cerveja selecionada
    setForm({ nome: cerveja.nome, estilo: cerveja.estilo, teorAlcoolico: cerveja.teorAlcoolico, preco: cerveja.preco, imagem: cerveja.imagem || '' });
    // Define qual cerveja está sendo editada
    setEditandoId(cerveja.id);
    // Exibe o formulário
    setMostrarForm(true);
    // Rola a página suavemente para o topo onde o formulário aparece
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Chamado quando o usuário clica em "Excluir" em um card
  const handleExcluir = (id) => {
    // Pede confirmação antes de excluir (evita exclusões acidentais)
    if (window.confirm('Deseja excluir esta cerveja?'))
      // filter() retorna um novo array sem a cerveja com o id passado
      setCervejas((prev) => prev.filter((c) => c.id !== id));
  };

  // Reseta todos os estados do formulário e fecha o painel
  const cancelar = () => {
    setForm(FORM_VAZIO);      // limpa os campos do formulário
    setEditandoId(null);      // sai do modo edição
    setErros({});             // limpa os erros
    setMostrarForm(false);    // fecha o formulário
  };

  // Alterna a visibilidade do formulário ao clicar no botão "+ Nova Cerveja" / "Fechar"
  const toggleForm = () => {
    // Se o form estiver aberto e não estiver editando, fecha e reseta tudo
    if (mostrarForm && editandoId === null) { cancelar(); return; }
    // Abre o formulário em modo criação (sem dados preenchidos)
    setEditandoId(null);
    setForm(FORM_VAZIO);
    setErros({});
    setMostrarForm(true);
  };

  return (
    // Container da página com padding e espaçamento padrão
    <div className="page-container">

      {/* Cabeçalho da página: título + botão de nova cerveja */}
      <div className="page-header">
        <h1 className="page-title">Cervejas</h1>
        <button className="btn-primary" onClick={toggleForm}>
          {/* Texto do botão muda conforme o estado */}
          {mostrarForm && editandoId === null ? '✕ Fechar' : '+ Nova Cerveja'}
        </button>
      </div>

      {/* Formulário — só aparece quando mostrarForm for true */}
      {mostrarForm && (
        <div className="form-card">
          <h2 className="form-title">
            {/* Título do form muda conforme o modo (criar ou editar) */}
            {editandoId ? 'Editar Cerveja' : '+ Nova Cerveja'}
          </h2>
          {/* noValidate desativa validação nativa do HTML */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">

              {/* Campo: Nome */}
              <div className="form-group">
                <label htmlFor="c-nome">Nome *</label>
                <input
                  id="c-nome"
                  value={form.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  placeholder="Ex: Sol da Tarde"
                  // Borda vermelha se houver erro neste campo
                  className={erros.nome ? 'input-erro' : ''}
                />
                {/* Mensagem de erro renderizada somente se existir */}
                {erros.nome && <span className="erro-msg">{erros.nome}</span>}
              </div>

              {/* Campo: Estilo */}
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

              {/* Campo: Teor alcoólico (número com casas decimais) */}
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

              {/* Campo: Preço */}
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

              {/* Campo: Imagem (opcional — URL ou caminho do arquivo em /public) */}
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

            {/* Botões de ação do formulário */}
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

      {/* Lista de cervejas — exibe mensagem se vazia, cards se houver dados */}
      {cervejas.length === 0 ? (
        <div className="empty-state">Nenhuma cerveja cadastrada ainda.</div>
      ) : (
        // Grid de cards — map() gera um CervejaCard para cada item da lista
        <div className="cards-grid">
          {cervejas.map((cerveja) => (
            // key={cerveja.id} é obrigatório no React para listas geradas com map()
            <CervejaCard
              key={cerveja.id}
              cerveja={cerveja}           // passa os dados da cerveja para o card
              onEditar={handleEditar}     // função chamada ao clicar "Editar"
              onExcluir={handleExcluir}   // função chamada ao clicar "Excluir"
            />
          ))}
        </div>
      )}
    </div>
  );
}
