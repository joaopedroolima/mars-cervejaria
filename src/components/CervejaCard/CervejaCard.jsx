// Importa o CSS específico deste componente
import './CervejaCard.css';

// CervejaCard: exibe os dados de uma cerveja em formato de card visual
// Props recebidas:
//   cerveja   → objeto com nome, estilo, teorAlcoolico, preco, imagem
//   onEditar  → função chamada ao clicar em "Editar" (passa a cerveja para o pai)
//   onExcluir → função chamada ao clicar em "Excluir" (passa o id para o pai)
export default function CervejaCard({ cerveja, onEditar, onExcluir }) {
  return (
    // Container do card com estilos de card branco flutuante
    <div className="card cerveja-card">

      {/* Área da imagem da garrafa */}
      <div className="cerveja-img-wrapper">
        {/* Renderização condicional: se tiver imagem, exibe; senão exibe placeholder "?" */}
        {cerveja.imagem ? (
          <img
            src={cerveja.imagem}        // caminho da imagem (ex: /cervejas/sol-da-tarde.png)
            alt={cerveja.nome}          // texto alternativo para acessibilidade
            className="cerveja-img"     // estilo com efeito hover de rotação e escala
          />
        ) : (
          // Placeholder exibido quando não há imagem cadastrada
          <span className="cerveja-img-placeholder">?</span>
        )}
      </div>

      {/* Cabeçalho do card: nome da cerveja */}
      <div className="card-header">
        <h3 className="card-title">{cerveja.nome}</h3>
      </div>

      {/* Corpo do card: detalhes da cerveja em linhas */}
      <div className="card-body">

        {/* Linha: Estilo */}
        <div className="card-row">
          <span className="card-label">Estilo</span>
          <span className="card-value">
            {/* badge-orange: estilo visual de etiqueta laranja */}
            <span className="badge badge-orange">{cerveja.estilo}</span>
          </span>
        </div>

        {/* Linha: Teor alcoólico */}
        <div className="card-row">
          <span className="card-label">Teor alcoólico</span>
          <span className="card-value">{cerveja.teorAlcoolico}%</span>
        </div>

        {/* Linha: Preço — toFixed(2) garante sempre 2 casas decimais: 12 → 12.00 */}
        <div className="card-row">
          <span className="card-label">Preço unitário</span>
          <span className="card-value card-price">
            R$ {Number(cerveja.preco).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Botões de ação no rodapé do card */}
      <div className="card-actions">
        {/* Botão Editar: chama onEditar passando o objeto inteiro da cerveja */}
        <button className="btn-edit" onClick={() => onEditar(cerveja)}>
          Editar
        </button>
        {/* Botão Excluir: chama onExcluir passando apenas o id da cerveja */}
        <button className="btn-delete" onClick={() => onExcluir(cerveja.id)}>
          Excluir
        </button>
      </div>
    </div>
  );
}
