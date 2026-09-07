import { PublicFooter } from "@/src/components/PublicFooter";
import { PublicHeader } from "@/src/components/PublicHeader";
import { PropertySearch } from "@/src/components/PropertySearch";
import { FeaturedProperty } from "@/src/components/FeaturedProperty";

export default function Home() {
  return (
    <div className="shell">
      <div className="container">
        <PublicHeader />
        <main className="hero">
          <section>
            <span className="eyebrow">Curadoria imobiliária</span>
            <h1>Um lugar para chamar de seu.</h1>
            <p>
              Encontre imóveis com personalidade, localização e potencial para
              acompanhar a próxima fase da sua história.
            </p>
            <div className="hero-actions">
              <a className="button" href="/comprar">
                Comprar imóvel
              </a>
              <a className="button secondary" href="/alugar">
                Alugar imóvel
              </a>
            </div>
          </section>
          <FeaturedProperty />
        </main>
        <PropertySearch />
        <PublicFooter />
      </div>
    </div>
  );
}
