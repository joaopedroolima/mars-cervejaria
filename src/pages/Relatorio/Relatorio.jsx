// useState para ler os dados do localStorage e manter em memória durante a sessão
import { useState } from 'react';
// Estilos específicos desta página
import './Relatorio.css';

// Chaves do localStorage para buscar os dados de cada entidade
const STORAGE_CERVEJAS = 'mars_cervejas';
const STORAGE_VENDAS   = 'mars_vendas';

// Posições do ranking: 1°, 2°, 3° — itens além do índice 2 usam "#4", "#5", etc.
const MEDALHAS = ['1°', '2°', '3°'];

// Função auxiliar para ler do localStorage sem travar em caso de erro
function lerStorage(chave, fallback) {
  try {
    const salvo = localStorage.getItem(chave);
    return salvo ? JSON.parse(salvo) : fallback;
  } catch {
    return fallback;
  }
}

// Componente do Relatório — demonstra o JOIN simulado entre Vendas e Cervejas
export default function Relatorio() {
  // Carrega as cervejas salvas (somente leitura — não há cadastro aqui)
  const [cervejas] = useState(() => lerStorage(STORAGE_CERVEJAS, []));
  // Carrega as vendas salvas (somente leitura — não há cadastro aqui)
  const [vendas]   = useState(() => lerStorage(STORAGE_VENDAS,   []));

  // ── JOIN simulado: Vendas ✕ Cervejas ─────────────────────────────────────────────
  // Para cada venda, busca a cerveja correspondente pelo cervejaId (como um JOIN no SQL)
  // Resultado: cada venda enriquecida com o nome e estilo da cerveja
  const vendasComCerveja = vendas.map((venda) => {
    // find() busca a cerveja cujo id seja igual ao cervejaId da venda
    // Number() converte a string cervejaId para número antes de comparar
    const cerveja = cervejas.find((c) => c.id === Number(venda.cervejaId));
    return {
      ...venda,                                          // copia todos os campos da venda
      cervejaNome:   cerveja?.nome   ?? 'Cerveja removida', // adiciona o nome da cerveja
      cervejaEstilo: cerveja?.estilo ?? '—',                // adiciona o estilo da cerveja
    };
  });

  // ── Ranking: GROUP BY simulado com map() + filter() + reduce() ────────────────────
  // Para cada cerveja, conta quantas vendas ela tem e soma os totais
  const ranking = cervejas
    .map((cerveja) => {
      // filter() retorna apenas as vendas que pertencem a esta cerveja
      const vendasDaCerveja = vendas.filter(
        (v) => Number(v.cervejaId) === cerveja.id
      );
      // reduce() soma a quantidade de todas as vendas desta cerveja (equivalente ao SUM(quantidade))
      const totalQtd   = vendasDaCerveja.reduce((s, v) => s + Number(v.quantidade),  0);
      // reduce() soma o valor total de todas as vendas desta cerveja (equivalente ao SUM(valorTotal))
      const totalValor = vendasDaCerveja.reduce((s, v) => s + Number(v.valorTotal),  0);
      // Retorna a cerveja enriquecida com as métricas calculadas
      return { ...cerveja, numPedidos: vendasDaCerveja.length, totalQtd, totalValor };
    })
    // sort() ordena as cervejas pela quantidade total vendida, do maior para o menor
    .sort((a, b) => b.totalQtd - a.totalQtd);

  // Totais gerais calculados a partir do ranking
  // reduce() soma o totalValor de todas as cervejas → receita geral
  const totalGeral    = ranking.reduce((s, r) => s + r.totalValor, 0);
  // reduce() soma o totalQtd de todas as cervejas → unidades vendidas totais
  const totalUnidades = ranking.reduce((s, r) => s + r.totalQtd, 0);

  return (
    <div className="page-container">

      {/* Cabeçalho da página */}
      <div className="page-header">
        <h1 className="page-title">Relatório de Vendas</h1>
      </div>

      {/* Cards de resumo geral (KPIs) */}
      <div className="stats-grid">

        {/* Total de pedidos = número de vendas cadastradas */}
        <div className="stat-card">
          <div className="stat-value">{vendas.length}</div>
          <div className="stat-label">Total de Pedidos</div>
        </div>

        {/* Total de unidades = soma de todas as quantidades */}
        <div className="stat-card">
          <div className="stat-value">{totalUnidades}</div>
          <div className="stat-label">Unidades Vendidas</div>
        </div>

        {/* Receita total — toFixed(2) para sempre mostrar 2 casas decimais */}
        <div className="stat-card">
          <div className="stat-value relatorio-receita">
            R$ {totalGeral.toFixed(2)}
          </div>
          <div className="stat-label">Receita Total</div>
        </div>

        {/* Número de cervejas no catálogo */}
        <div className="stat-card">
          <div className="stat-value">{cervejas.length}</div>
          <div className="stat-label">Cervejas no Catálogo</div>
        </div>
      </div>

      {/* Ranking de cervejas mais vendidas (resultado do GROUP BY simulado) */}
      <p className="section-title">Ranking — Cervejas mais vendidas</p>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Cerveja</th>
              <th>Estilo</th>
              <th>Pedidos</th>
              <th>Unidades</th>
              <th>Receita</th>
            </tr>
          </thead>
          <tbody>
            {/* Se não houver cervejas, exibe uma linha vazia informativa */}
            {ranking.length === 0 ? (
              <tr>
                <td colSpan="6" className="celula-vazia">
                  Nenhuma cerveja cadastrada
                </td>
              </tr>
            ) : (
              // Gera uma linha para cada cerveja do ranking usando map()
              // i = índice (0, 1, 2, ...) — usado para mostrar 1°, 2°, 3°, #4, etc.
              ranking.map((item, i) => (
                <tr key={item.id}>
                  {/* MEDALHAS[i] retorna '1°', '2°', '3°'; se i > 2, usa '#4', '#5'... */}
                  <td className="celula-medalha">{MEDALHAS[i] ?? `#${i + 1}`}</td>
                  <td><strong>{item.nome}</strong></td>
                  {/* badge-orange: etiqueta visual laranja para o estilo */}
                  <td><span className="badge badge-orange">{item.estilo}</span></td>
                  <td>{item.numPedidos}</td>
                  <td>{item.totalQtd}</td>
                  <td className="value-orange">R$ {item.totalValor.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Tabela detalhada: cada venda enriquecida com os dados da cerveja (JOIN simulado) */}
      <p className="section-title">Vendas detalhadas — JOIN: Vendas ✕ Cervejas</p>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Cerveja (via JOIN)</th>
              <th>Estilo</th>
              <th>Quantidade</th>
              <th>Valor Total</th>
            </tr>
          </thead>
          <tbody>
            {/* Se não houver vendas, exibe mensagem informativa */}
            {vendasComCerveja.length === 0 ? (
              <tr>
                <td colSpan="5" className="celula-vazia">
                  Nenhuma venda registrada
                </td>
              </tr>
            ) : (
              // Gera uma linha para cada venda já enriquecida com os dados da cerveja
              vendasComCerveja.map((venda) => (
                <tr key={venda.id}>
                  <td>{venda.data}</td>
                  {/* cervejaNome vem do JOIN simulado feito acima no vendasComCerveja */}
                  <td><strong>{venda.cervejaNome}</strong></td>
                  <td>
                    <span className="badge badge-orange">{venda.cervejaEstilo}</span>
                  </td>
                  <td>{venda.quantidade} un.</td>
                  <td className="value-orange">
                    R$ {Number(venda.valorTotal).toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
