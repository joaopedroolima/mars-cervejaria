export default function ClienteCard({ cliente, onEditar, onExcluir }) {
  // Se o 'cliente' vier nulo por segurança, evita que a tela quebre
  if (!cliente) return null; 

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{cliente.nome}</h3>
      </div>

      <div className="card-body">
        <div className="card-row">
          <span className="card-label">CPF</span>
          <span className="card-value">{cliente.cpf}</span>
        </div>
        <div className="card-row">
          <span className="card-label">Contato</span>
          <span className="card-value">{cliente.contato}</span>
        </div>
      </div>

      <div className="card-actions">
        <button className="btn-edit" onClick={() => onEditar(cliente)}>
          Editar
        </button>
        <button className="btn-delete" onClick={() => onExcluir(cliente.id)}>
          Excluir
        </button>
      </div>
    </div>
  );
}