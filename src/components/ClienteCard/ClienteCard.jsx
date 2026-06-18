// ClienteCard: exibe os dados de um cliente em formato de card visual
// Props recebidas:
//   cliente   → objeto com id, nome, cpf, contato
//   onEditar  → função chamada ao clicar "Editar" (passa o objeto cliente)
//   onExcluir → função chamada ao clicar "Excluir" (passa o id)
export default function ClienteCard({ cliente, onEditar, onExcluir }) {
  // Proteção: se o cliente vier nulo por algum motivo, não renderiza nada
  // Isso evita erros de "Cannot read property 'nome' of null"
  if (!cliente) return null;

  return (
    // Container do card com estilo de card branco flutuante
    <div className="card">

      {/* Cabeçalho: nome do cliente */}
      <div className="card-header">
        <h3 className="card-title">{cliente.nome}</h3>
      </div>

      {/* Corpo: detalhes em linhas (label à esquerda, valor à direita) */}
      <div className="card-body">

        {/* Linha: CPF */}
        <div className="card-row">
          <span className="card-label">CPF</span>
          <span className="card-value">{cliente.cpf}</span>
        </div>

        {/* Linha: Contato */}
        <div className="card-row">
          <span className="card-label">Contato</span>
          <span className="card-value">{cliente.contato}</span>
        </div>
      </div>

      {/* Rodapé: botões de Editar e Excluir */}
      <div className="card-actions">
        {/* Chama onEditar passando o objeto inteiro — o pai usa para preencher o formulário */}
        <button className="btn-edit" onClick={() => onEditar(cliente)}>
          Editar
        </button>
        {/* Chama onExcluir passando apenas o ID — o pai remove da lista */}
        <button className="btn-delete" onClick={() => onExcluir(cliente.id)}>
          Excluir
        </button>
      </div>
    </div>
  );
}
