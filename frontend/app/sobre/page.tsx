import { PublicFooter } from "@/src/components/PublicFooter";
import { PublicHeader } from "@/src/components/PublicHeader";

export default function SobrePage() {
  return (
    <div className="shell public-shell">
      <div className="container">
        <PublicHeader />
        <main className="about-page">
          <span className="eyebrow">Sobre a Imperium</span>
          <h1>Imobiliária com olhar de curadoria.</h1>
          <div className="about-grid">
            <p className="about-lead">
              Acreditamos que encontrar um imóvel é encontrar o cenário onde a
              vida acontece. Por isso, olhamos para cada endereço com atenção
              aos detalhes, ao entorno e ao que pode se tornar.
            </p>
            <div>
              <p>
                Somos uma equipe próxima, transparente e preparada para
                acompanhar decisões importantes, da primeira visita à assinatura
                do contrato.
              </p>
              <p>
                Nosso trabalho combina conhecimento local, apresentação
                cuidadosa e atendimento humano para tornar o mercado imobiliário
                mais simples.
              </p>
            </div>
          </div>
        </main>
        <PublicFooter />
      </div>
    </div>
  );
}
