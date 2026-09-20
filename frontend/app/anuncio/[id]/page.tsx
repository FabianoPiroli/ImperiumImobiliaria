"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { PublicFooter } from "@/src/components/PublicFooter";
import { PublicHeader } from "@/src/components/PublicHeader";
import { getImovel } from "@/src/lib/api";
import { MediaCarousel } from "@/src/components/MediaCarousel";

const PropertyMap = dynamic(() => import("@/src/components/PropertyMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "280px",
        background: "#f4f1ea",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "8px",
        color: "var(--muted)",
        fontSize: "0.88rem",
      }}
    >
      Carregando mapa...
    </div>
  ),
});

type Imovel = {
  id: number;
  codigo: number;
  titulo: string;
  descricao: string;
  tipo: string;
  estado?: string;
  cidade: string;
  bairro?: string;
  endereco: string;
  preco: number;
  quartos: number;
  banheiros: number;
  vagasGaragem: number;
  finalidade: string;
  latitude?: number | null;
  longitude?: number | null;
  ocultarNumeroExato?: boolean;
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
                {imovel.ocultarNumeroExato
                  ? imovel.bairro
                    ? `${imovel.bairro}, ${imovel.cidade}`
                    : imovel.cidade
                  : imovel.endereco}
                {imovel.ocultarNumeroExato ? (
                  <small
                    style={{
                      display: "block",
                      color: "var(--muted)",
                      marginTop: "4px",
                    }}
                  >
                    📍 Localização aproximada
                  </small>
                ) : (
                  <>
                    <br />
                    {imovel.cidade}
                  </>
                )}
              </p>
              <a className="button" href="/contato">
                Tenho interesse
              </a>
            </section>
          </div>

          {typeof imovel.latitude === "number" &&
            typeof imovel.longitude === "number" && (
              <section
                style={{
                  marginTop: "32px",
                  padding: "24px",
                  background: "var(--paper)",
                  border: "1px solid var(--line)",
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  <div>
                    <h2 style={{ margin: 0, fontSize: "1.3rem" }}>Localização</h2>
                    <span style={{ fontSize: "0.88rem", color: "var(--muted)" }}>
                      {imovel.ocultarNumeroExato
                        ? "Área aproximada do imóvel (a pedido do proprietário)"
                        : `${imovel.endereco} · ${imovel.cidade}`}
                    </span>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${imovel.latitude},${imovel.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button secondary"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "0.85rem",
                      padding: "8px 16px",
                      textDecoration: "none",
                    }}
                  >
                    <span>🗺️</span>
                    <span>Abrir no Google Maps</span>
                  </a>
                </div>
                <PropertyMap
                  latitude={imovel.latitude}
                  longitude={imovel.longitude}
                  editable={false}
                  ocultarNumeroExato={imovel.ocultarNumeroExato}
                  height="340px"
                  popupTitle={imovel.titulo}
                />
              </section>
            )}
        </main>
        <PublicFooter />
      </div>
    </div>
  );
}
