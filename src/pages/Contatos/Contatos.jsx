// Componente simples de página de Contatos — sem estado, apenas conteúdo estático
export default function Contatos() {
  return (
    // Container padrão da página com padding e espaçamento
    <div className="page-container">

      {/* Cabeçalho da página */}
      <div className="page-header">
        <h1 className="page-title">Contatos</h1>
      </div>

      {/* Card com o mapa incorporado do Google Maps */}
      <div className="form-card">
        <h2 className="form-title">Nossa Localização</h2>

        {/* iframe: incorpora o Google Maps diretamente na página */}
        {/* src: link gerado pelo Google Maps com as coordenadas da localização */}
        {/* loading="lazy": o mapa só carrega quando visível na tela (melhor desempenho) */}
        {/* referrerPolicy: controla quais informações são enviadas ao Google Maps */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3838.8115655325854!2d-48.0461011!3d-15.8139589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a337ea73be367%3A0xc6cb1c62ef4f1416!2sCentro%20Universit%C3%A1rio%20Proje%C3%A7%C3%A3o%20-%20Campus%20Taguatinga!5e0!3m2!1spt-BR!2sbr!4v1718650000000"
          width="100%"
          height="400"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Localização Mars Cervejaria"
        />
      </div>

      {/* Botões de redes sociais */}
      {/* justifyContent: 'center' centraliza os botões horizontalmente */}
      <div className="form-actions" style={{ justifyContent: 'center', marginTop: '2rem' }}>

        {/* Link para o Instagram — abre em nova aba (target="_blank") */}
        {/* rel="noreferrer" é obrigatório com target="_blank" por segurança */}
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noreferrer"
          className="btn-primary"
        >
          Instagram
        </a>

        {/* Link para o WhatsApp Web — abre em nova aba */}
        <a
          href="https://web.whatsapp.com/"
          target="_blank"
          rel="noreferrer"
          className="btn-primary"
        >
          WhatsApp
        </a>
      </div>

    </div>
  );
}
