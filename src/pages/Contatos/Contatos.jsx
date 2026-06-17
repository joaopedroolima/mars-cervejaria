export default function Contatos() {
  return (
    <div className="page-container">
      
      <div className="page-header">
        <h1 className="page-title">Contatos</h1>
      </div>

      
      <div className="form-card">
        <h2 className="form-title">Nossa Localização</h2>
        
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3838.8115655325854!2d-48.0461011!3d-15.8139589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a337ea73be367%3A0xc6cb1c62ef4f1416!2sCentro%20Universit%C3%A1rio%20Proje%C3%A7%C3%A3o%20-%20Campus%20Taguatinga!5e0!3m2!1spt-BR!2sbr!4v1718650000000" 
          width="100%" 
          height="400" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Localização Mars Cervejaria"
        />
      </div>

      
      <div className="form-actions" style={{ justifyContent: 'center', marginTop: '2rem' }}>
        <a 
          href="https://www.instagram.com" 
          target="_blank" 
          rel="noreferrer"
         className="btn-primary"
        >
           Instagram
        </a>

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