"use client";

import { useEffect, useState } from "react";
import { PublicFooter } from "@/src/components/PublicFooter";
import { PublicHeader } from "@/src/components/PublicHeader";
import { getImovel } from "@/src/lib/api";
import { MediaCarousel } from "@/src/components/MediaCarousel";

type Imovel = {
  id: number;
  codigo: number;
  titulo: string;
  descricao: string;
  tipo: string;
  cidade: string;
  endereco: string;
  preco: number;
  quartos: number;
  banheiros: number;
  vagasGaragem: number;
  finalidade: string;
  midias?: { url: string; tipo: string; nome: string }[];
};

export default function AnuncioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [imovel, setImovel] = useState<Imovel | null>(null);
  useEffect(() => {
    params.then(({ id }) => getImovel(Number(id)).then(setImovel));
  }, [params]);
  if (!imovel)
    return (
      <div className="shell">
        <div className="container">
          <PublicHeader />
          <main className="detail-loading">Carregando anúncio...</main>
        </div>
      </div>
    );
  return (
    <div className="shell public-shell">
      <div className="container">
        <PublicHeader />
        <main className="property-detail">
          <a
            className="text-link"
            href={imovel.finalidade === "aluguel" ? "/alugar" : "/comprar"}
          >
            ← Voltar para anúncios
          </a>
          <div className="detail-grid">
            <div className="detail-gallery">
              <MediaCarousel
                midias={imovel.midias ?? []}
                titulo={imovel.titulo}
              />
            </div>
            <section className="detail-copy">
              <span className="eyebrow">
                Código {imovel.codigo} ·{" "}
                {imovel.finalidade === "aluguel" ? "Para alugar" : "À venda"} ·{" "}
                {imovel.cidade}
              </span>
              <h1>{imovel.titulo}</h1>
              <p className="detail-price">
                R$ {imovel.preco.toLocaleString("pt-BR")}{" "}
                {imovel.finalidade === "aluguel" && <small>/mês</small>}
              </p>
              <p>{imovel.descricao}</p>
              <div className="detail-specs">
                <span>{imovel.tipo}</span>
                <span>{imovel.quartos} quartos</span>
                <span>{imovel.banheiros} banheiros</span>
                <span>{imovel.vagasGaragem} vagas</span>
              </div>
              <p className="detail-address">
                {imovel.endereco}
                <br />
                {imovel.cidade}
              </p>
              <a className="button" href="/contato">
                Tenho interesse
              </a>
            </section>
          </div>
        </main>
        <PublicFooter />
      </div>
    </div>
  );
}
