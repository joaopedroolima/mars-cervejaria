import './CervejaCard.css';

export default function CervejaCard({ cerveja, onEditar, onExcluir }) {
  return (
    <div className="card cerveja-card">
      {/* Imagem da garrafa */}
      <div className="cerveja-img-wrapper">
        {cerveja.imagem ? (
          <img
            src={cerveja.imagem}
            alt={cerveja.nome}
            className="cerveja-img"
          />
        ) : (
          <span className="cerveja-img-placeholder">?</span>
        )}
      </div>

      <div className="card-header">
        <h3 className="card-title">{cerveja.nome}</h3>
      </div>

      <div className="card-body">
        <div className="card-row">
          <span className="card-label">Estilo</span>
          <span className="card-value">
            <span className="badge badge-orange">{cerveja.estilo}</span>
          </span>
        </div>
        <div className="card-row">
          <span className="card-label">Teor alcoólico</span>
          <span className="card-value">{cerveja.teorAlcoolico}%</span>
        </div>
        <div className="card-row">
          <span className="card-label">Preço unitário</span>
          <span className="card-value card-price">
            R$ {Number(cerveja.preco).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="card-actions">
        <button className="btn-edit" onClick={() => onEditar(cerveja)}>
          Editar
        </button>
        <button className="btn-delete" onClick={() => onExcluir(cerveja.id)}>
          Excluir
        </button>
      </div>
    </div>
  );
}
