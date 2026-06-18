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

  // ── JOIN simulado: Vendas × Itens ────────────────────────────────────────────────
  // Cada venda agora tem um array de itens (carrinho). flatMap() "abre" esse array:
  // para cada venda → para cada item dentro dela → gera uma linha na tabela
  // Isso simula um JOIN em SQL: SELECT vendas.data, itens.cervejaNome, itens.quantidade...
  const linhasJoin = vendas.flatMap((venda) =>
    (venda.itens ?? []).map((item) => ({
      vendaId:     venda.id,           // ID do pedido pai
      data:        venda.data,         // data do pedido
      cervejaNome: item.cervejaNome,   // nome da cerveja (já salvo no item)
      quantidade:  item.quantidade,    // quantidade desta cerveja neste pedido
      subtotal:    item.subtotal,      // valor do item (quantidade × preço unitário)
      valorTotal:  venda.valorTotal,   // valor total do pedido pai
    }))
  );

  // ── Ranking: GROUP BY simulado com flatMap() + filter() + reduce() ─────────────────
  // Para cada cerveja, varre todos os itens de todas as vendas e agrega os números
  const ranking = cervejas
    .map((cerveja) => {
      // flatMap() expande todos os itens de todas as vendas em uma lista plana
      // filter() mantém apenas os itens que são desta cerveja (pelo cervejaId)
      const itensDaCerveja = vendas
        .flatMap((v) => v.itens ?? [])
        .filter((item) => Number(item.cervejaId) === cerveja.id);

      // reduce() soma a quantidade de unidades vendidas desta cerveja (equivale a SUM(quantidade))
      const totalQtd = itensDaCerveja.reduce((s, item) => s + Number(item.quantidade), 0);

      // reduce() soma o valor arrecadado com esta cerveja (equivale a SUM(subtotal))
      const totalValor = itensDaCerveja.reduce((s, item) => s + Number(item.subtotal), 0);

      // Conta em quantos pedidos distintos esta cerveja aparece
      const numPedidos = new Set(
        vendas
          .filter((v) => (v.itens ?? []).some((i) => Number(i.cervejaId) === cerveja.id))
          .map((v) => v.id)
      ).size;

      // Retorna a cerveja com as métricas calculadas
      return { ...cerveja, numPedidos, totalQtd, totalValor };
    })
    // sort() ordena do mais vendido ao menos vendido pelo total de unidades
    .sort((a, b) => b.totalQtd - a.totalQtd);

  // Totais gerais somados a partir do ranking
  // reduce() soma totalValor de todas as cervejas → receita geral
  const totalGeral = ranking.reduce((s, r) => s + r.totalValor, 0);
  // reduce() soma totalQtd de todas as cervejas → unidades totais vendidas
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

        {/* Total de unidades = soma de todas as quantidades de todos os itens */}
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
              // i = índice (0, 1, 2…) — usado para mostrar 1°, 2°, 3°, #4, #5…
              ranking.map((item, i) => (
                <tr key={item.id}>
                  {/* MEDALHAS[i] retorna '1°', '2°', '3°'; se i > 2, usa '#4', '#5'… */}
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

      {/* Tabela detalhada: uma linha por item de cada venda (JOIN simulado) */}
      {/* flatMap() expandiu os itens de cada venda → linhasJoin tem uma entrada por item */}
      <p className="section-title">Vendas detalhadas — JOIN: Vendas × Itens × Cervejas</p>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Data</th>
              <th>Cerveja (via JOIN)</th>
              <th>Quantidade</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {/* Se não houver vendas, exibe mensagem informativa */}
            {linhasJoin.length === 0 ? (
              <tr>
                <td colSpan="5" className="celula-vazia">
                  Nenhuma venda registrada
                </td>
              </tr>
            ) : (
              // Gera uma linha para cada item expandido pelo flatMap() acima
              linhasJoin.map((linha, i) => (
                // i como key pois um mesmo pedido pode ter vários itens (chaves duplicadas seriam erro)
                <tr key={i}>
                  <td>#{linha.vendaId}</td>
                  <td>{linha.data}</td>
                  {/* cervejaNome vem diretamente do item salvo no carrinho */}
                  <td><strong>{linha.cervejaNome}</strong></td>
                  <td>{linha.quantidade} un.</td>
                  <td className="value-orange">
                    R$ {Number(linha.subtotal).toFixed(2)}
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
