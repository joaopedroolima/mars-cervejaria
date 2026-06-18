// VendaCard: exibe os dados de uma venda em formato de card visual
// Props recebidas:
//   venda       → objeto com id, clienteId, data, itens[], valorTotal
//   clienteNome → nome do cliente já resolvido pelo componente pai
//   onEditar    → função chamada ao clicar "Editar"
//   onExcluir   → função chamada ao clicar "Excluir"
export default function VendaCard({ venda, clienteNome, onEditar, onExcluir }) {
  return (
    // Container do card com estilo de card branco flutuante
    <div className="card">

      {/* Cabeçalho: número do pedido e data */}
      <div className="card-header">
        <span className="card-icon"></span>
        <h3 className="card-title">Pedido #{venda.id}</h3>
      </div>

      {/* Corpo: detalhes da venda */}
      <div className="card-body">

        {/* Nome do cliente */}
        <div className="card-row">
          <span className="card-label">Cliente</span>
          <span className="card-value">{clienteNome}</span>
        </div>

        {/* Data da venda */}
        <div className="card-row">
          <span className="card-label">Data</span>
          <span className="card-value">{venda.data}</span>
        </div>

        {/* Lista de itens do carrinho — cada item em sua própria linha */}
        <div className="card-row" style={{ alignItems: 'flex-start' }}>
          <span className="card-label">Itens</span>
          <ul className="venda-card-itens">
            {(venda.itens ?? []).map((item, i) => (
              // Cada item mostra cerveja, quantidade e subtotal
              <li key={i}>
                <strong>{item.cervejaNome}</strong> — {item.quantidade} un. ×{' '}
                R$ {Number(item.valorUnitario).toFixed(2)} ={' '}
                <span className="card-price">R$ {Number(item.subtotal).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Valor total do pedido (soma de todos os itens) */}
        <div className="card-row">
          <span className="card-label">Total</span>
          <span className="card-value card-price">
            R$ {Number(venda.valorTotal).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Botões de ação no rodapé */}
      <div className="card-actions">
        {/* Passa o objeto inteiro para o pai preencher o formulário de edição */}
        <button className="btn-edit" onClick={() => onEditar(venda)}>
          Editar
        </button>
        {/* Passa apenas o ID para o pai remover da lista */}
        <button className="btn-delete" onClick={() => onExcluir(venda.id)}>
          Excluir
        </button>
      </div>
    </div>
  );
}
