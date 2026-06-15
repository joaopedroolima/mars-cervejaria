import { useState } from 'react';
import './Relatorio.css';

const STORAGE_CERVEJAS = 'mars_cervejas';
const STORAGE_VENDAS   = 'mars_vendas';

const MEDALHAS = ['🥇', '🥈', '🥉'];

function lerStorage(chave, fallback) {
  try {
    const salvo = localStorage.getItem(chave);
    return salvo ? JSON.parse(salvo) : fallback;
  } catch {
    return fallback;
  }
}

export default function Relatorio() {
  const [cervejas] = useState(() => lerStorage(STORAGE_CERVEJAS, []));
  const [vendas]   = useState(() => lerStorage(STORAGE_VENDAS,   []));

  /* ── JOIN simulado: cada venda enriquecida com dados da cerveja (map + find) ── */
  const vendasComCerveja = vendas.map((venda) => {
    const cerveja = cervejas.find((c) => c.id === Number(venda.cervejaId));
    return {
      ...venda,
      cervejaNome:  cerveja?.nome   ?? 'Cerveja removida',
      cervejaEstilo: cerveja?.estilo ?? '—',
    };
  });

  /* ── Ranking por cerveja (JOIN + GROUP BY simulado com map + filter) ── */
  const ranking = cervejas
    .map((cerveja) => {
      const vendasDaCerveja = vendas.filter(
        (v) => Number(v.cervejaId) === cerveja.id
      );
      const totalQtd   = vendasDaCerveja.reduce((s, v) => s + Number(v.quantidade),  0);
      const totalValor = vendasDaCerveja.reduce((s, v) => s + Number(v.valorTotal),  0);
      return { ...cerveja, numPedidos: vendasDaCerveja.length, totalQtd, totalValor };
    })
    .sort((a, b) => b.totalQtd - a.totalQtd);

  const totalGeral    = ranking.reduce((s, r) => s + r.totalValor, 0);
  const totalUnidades = ranking.reduce((s, r) => s + r.totalQtd, 0);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">📊 Relatório de Vendas</h1>
      </div>

      {/* Resumo geral */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{vendas.length}</div>
          <div className="stat-label">Total de Pedidos</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalUnidades}</div>
          <div className="stat-label">Unidades Vendidas</div>
        </div>
        <div className="stat-card">
          <div className="stat-value relatorio-receita">
            R$ {totalGeral.toFixed(2)}
          </div>
          <div className="stat-label">Receita Total</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{cervejas.length}</div>
          <div className="stat-label">Cervejas no Catálogo</div>
        </div>
      </div>

      {/* Ranking de cervejas mais vendidas */}
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
            {ranking.length === 0 ? (
              <tr>
                <td colSpan="6" className="celula-vazia">
                  Nenhuma cerveja cadastrada
                </td>
              </tr>
            ) : (
              ranking.map((item, i) => (
                <tr key={item.id}>
                  <td className="celula-medalha">{MEDALHAS[i] ?? `#${i + 1}`}</td>
                  <td><strong>{item.nome}</strong></td>
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

      {/* Tabela detalhada — JOIN Vendas ✕ Cervejas */}
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
            {vendasComCerveja.length === 0 ? (
              <tr>
                <td colSpan="5" className="celula-vazia">
                  Nenhuma venda registrada
                </td>
              </tr>
            ) : (
              vendasComCerveja.map((venda) => (
                <tr key={venda.id}>
                  <td>{venda.data}</td>
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
