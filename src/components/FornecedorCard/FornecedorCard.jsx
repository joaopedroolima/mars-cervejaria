export default function FornecedorCard({ fornecedor, onEditar, onExcluir }) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-icon"></span>
        <h3 className="card-title">{fornecedor.nome}</h3>
      </div>

      <div className="card-body">
        <div className="card-row">
          <span className="card-label">CNPJ</span>
          <span className="card-value">{fornecedor.cnpj}</span>
        </div>
        <div className="card-row">
          <span className="card-label">Contato</span>
          <span className="card-value">{fornecedor.contato}</span>
        </div>
      </div>

      <div className="card-actions">
        <button className="btn-edit" onClick={() => onEditar(fornecedor)}>
          Editar
        </button>
        <button className="btn-delete" onClick={() => onExcluir(fornecedor.id)}>
          Excluir
        </button>
      </div>
    </div>
  );
}
