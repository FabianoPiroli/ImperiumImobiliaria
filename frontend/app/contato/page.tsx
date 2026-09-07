import { PublicFooter } from "@/src/components/PublicFooter";
import { PublicHeader } from "@/src/components/PublicHeader";

export default function ContatoPage() {
  return (
    <div className="shell public-shell">
      <div className="container">
        <PublicHeader />
        <main className="contact-page">
          <div>
            <span className="eyebrow">Vamos conversar</span>
            <h1>Conte o que você está procurando.</h1>
            <p>
              Para comprar, alugar ou anunciar, nossa equipe está pronta para
              ouvir.
            </p>
          </div>
          <div className="contact-options">
            <a href="https://wa.me/5511999999999" className="contact-option">
              <span className="eyebrow">WhatsApp</span>
              <strong>Falar com um consultor</strong>
              <span>Resposta rápida pelo celular →</span>
            </a>
            <a
              href="mailto:contato@imperiumimobiliaria.com.br"
              className="contact-option"
            >
              <span className="eyebrow">E-mail</span>
              <strong>contato@imperiumimobiliaria.com.br</strong>
              <span>Envie os detalhes do seu imóvel →</span>
            </a>
          </div>
        </main>
        <PublicFooter />
      </div>
    </div>
  );
}
