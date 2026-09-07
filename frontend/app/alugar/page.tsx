import { PublicFooter } from "@/src/components/PublicFooter";
import { PublicHeader } from "@/src/components/PublicHeader";
import { PublicCatalog } from "@/src/components/PublicCatalog";

export default async function AlugarPage({
  searchParams,
}: {
  searchParams: Promise<{
    tipo?: string;
    precoMax?: string;
    estado?: string;
    cidade?: string;
    bairro?: string;
  }>;
}) {
  const filters = await searchParams;
  return (
    <div className="shell public-shell">
      <div className="container">
        <PublicHeader />
        <main>
          <div className="listing-intro">
            <span className="eyebrow">Seleção Imperium</span>
            <h1>Um lugar para viver agora.</h1>
            <p>
              Alugue espaços com personalidade, boa localização e a praticidade
              que a sua rotina pede.
            </p>
          </div>
          <PublicCatalog
            finalidade="aluguel"
            categoria={filters.tipo}
            precoMax={filters.precoMax ? Number(filters.precoMax) : undefined}
            estado={filters.estado}
            cidade={filters.cidade}
            bairro={filters.bairro}
          />
        </main>
        <PublicFooter />
      </div>
    </div>
  );
}
