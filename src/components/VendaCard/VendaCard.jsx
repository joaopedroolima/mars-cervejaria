export default function VendaCard({
  venda,
  cervejaNome,
  clienteNome,
  onEditar,
  onExcluir,
}) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-icon"></span>
        <h3 className="card-title">{cervejaNome}</h3>
      </div>

      <div className="card-body">
        <div className="card-row">
          <span className="card-label">Cliente</span>
          <span className="card-value">{clienteNome}</span>
        </div>
        <div className="card-row">
          <span className="card-label">Data</span>
          <span className="card-value">{venda.data}</span>
        </div>
        <div className="card-row">
          <span className="card-label">Quantidade</span>
          <span className="card-value">{venda.quantidade} un.</span>
        </div>
        <div className="card-row">
          <span className="card-label">Valor total</span>
          <span className="card-value card-price">
            R$ {Number(venda.valorTotal).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="card-actions">
        <button className="btn-edit" onClick={() => onEditar(venda)}>
          Editar
        </button>
        <button className="btn-delete" onClick={() => onExcluir(venda.id)}>
          Excluir
        </button>
      </div>
    </div>
  );
}
