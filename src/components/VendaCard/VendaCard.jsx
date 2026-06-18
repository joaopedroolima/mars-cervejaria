// VendaCard: exibe os dados de uma venda em formato de card visual
// Props recebidas:
//   venda       → objeto com id, cervejaId, clienteId, quantidade, data, valorTotal
//   cervejaNome → nome da cerveja já resolvido pelo componente pai (JOIN simulado)
//   clienteNome → nome do cliente já resolvido pelo componente pai (JOIN simulado)
//   onEditar    → função chamada ao clicar "Editar"
//   onExcluir   → função chamada ao clicar "Excluir"
export default function VendaCard({ venda, cervejaNome, clienteNome, onEditar, onExcluir }) {
  return (
    // Container do card com estilo de card branco flutuante
    <div className="card">

      {/* Cabeçalho: nome da cerveja (vem resolvido do pai via JOIN simulado) */}
      <div className="card-header">
        <span className="card-icon"></span>
        <h3 className="card-title">{cervejaNome}</h3>
      </div>

      {/* Corpo: detalhes da venda em linhas */}
      <div className="card-body">

        {/* Nome do cliente — resolvido pelo pai a partir do clienteId */}
        <div className="card-row">
          <span className="card-label">Cliente</span>
          <span className="card-value">{clienteNome}</span>
        </div>

        {/* Data da venda */}
        <div className="card-row">
          <span className="card-label">Data</span>
          <span className="card-value">{venda.data}</span>
        </div>

        {/* Quantidade de unidades vendidas */}
        <div className="card-row">
          <span className="card-label">Quantidade</span>
          <span className="card-value">{venda.quantidade} un.</span>
        </div>

        {/* Valor total — toFixed(2) garante 2 casas decimais: 90 → 90.00 */}
        <div className="card-row">
          <span className="card-label">Valor total</span>
          <span className="card-value card-price">
            R$ {Number(venda.valorTotal).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Botões de ação no rodapé */}
      <div className="card-actions">
        {/* Passa o objeto inteiro da venda para o pai poder preencher o formulário */}
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
