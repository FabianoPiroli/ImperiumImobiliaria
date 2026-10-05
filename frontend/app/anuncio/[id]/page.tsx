"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { PublicFooter } from "@/src/components/PublicFooter";
import { PublicHeader } from "@/src/components/PublicHeader";
import {
  addClientFavorite,
  getClientFavorites,
  getImovel,
  removeClientFavorite,
} from "@/src/lib/api";
import { MediaCarousel } from "@/src/components/MediaCarousel";
import { Bath, Bed, Car, Heart } from "lucide-react";

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
  const [isFavorite, setIsFavorite] = useState(false);
  const [favErro, setFavErro] = useState("");

  useEffect(() => {
    params.then(({ id }) => {
      const imovelId = Number(id);
      getImovel(imovelId).then((data) => {
        setImovel(data);
        if (typeof window !== "undefined" && localStorage.getItem("imperium_token")) {
          getClientFavorites()
            .then((favs: { imovelId: number }[]) => {
              setIsFavorite(favs.some((f) => f.imovelId === imovelId));
            })
            .catch(() => undefined);
        }
      });
    });
  }, [params]);

  const toggleFavorito = useCallback(async () => {
    if (!imovel) return;
    if (typeof window !== "undefined" && !localStorage.getItem("imperium_token")) {
      window.location.href = `/cliente/login?next=/anuncio/${imovel.id}`;
      return;
    }
    const alreadyFavorite = isFavorite;
    try {
      setFavErro("");
      if (alreadyFavorite) {
        await removeClientFavorite(imovel.id);
        setIsFavorite(false);
      } else {
        await addClientFavorite(imovel.id);
        setIsFavorite(true);
      }
    } catch {
      setFavErro("Não foi possível atualizar os favoritos.");
    }
  }, [imovel, isFavorite]);

  if (!imovel)
    return (
      <div className="shell public-shell">
        <div className="container">
          <PublicHeader />
          <main className="detail-loading">Carregando anúncio...</main>
          <PublicFooter />
        </div>
      </div>
    );
  return (
    <div className="shell public-shell">
      <div className="container">
        <PublicHeader />
        <main className="property-detail">
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
            <a
              className="text-link"
              href={imovel.finalidade === "locacao" ? "/alugar" : "/comprar"}
            >
              ← Voltar para anúncios
            </a>

            <button
              type="button"
              onClick={toggleFavorito}
              aria-label={
                isFavorite
                  ? "Remover dos favoritos"
                  : "Adicionar aos favoritos"
              }
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "20px",
                border: "1px solid var(--line)",
                background: isFavorite
                  ? "rgba(220, 38, 38, 0.08)"
                  : "var(--paper)",
                color: isFavorite ? "#dc2626" : "var(--ink)",
                cursor: "pointer",
                fontSize: "0.88rem",
                fontWeight: 600,
                transition: "all 0.2s ease",
              }}
            >
              <Heart
                size={18}
                fill={isFavorite ? "#dc2626" : "none"}
                color={isFavorite ? "#dc2626" : "currentColor"}
              />
              <span>{isFavorite ? "Favoritado" : "Favoritar imóvel"}</span>
            </button>
          </div>

          {favErro && (
            <div
              style={{
                padding: "10px 16px",
                marginBottom: "16px",
                borderRadius: "8px",
                background: "#fef2f2",
                color: "#991b1b",
                fontSize: "0.88rem",
              }}
            >
              {favErro}
            </div>
          )}

          <div className="detail-grid">
            <div className="detail-gallery">
              <MediaCarousel
                midias={imovel.midias ?? []}
                titulo={imovel.titulo}
                actionOverlay={
                  <button
                    type="button"
                    aria-label={
                      isFavorite
                        ? "Remover dos favoritos"
                        : "Adicionar aos favoritos"
                    }
                    onClick={toggleFavorito}
                    className={`favorite-toggle transition-colors duration-200 ${isFavorite ? "text-red-600" : "text-white"}`}
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      zIndex: 10,
                      background: "rgba(0,0,0,0.45)",
                      borderRadius: 10,
                      padding: 8,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "none",
                      cursor: "pointer",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <Heart
                      size={22}
                      className={`transform transition-transform ${isFavorite ? "scale-105" : "scale-100"}`}
                      fill={isFavorite ? "currentColor" : "none"}
                    />
                  </button>
                }
              />
            </div>
            <section className="detail-copy">
              <span className="eyebrow">
                Código {imovel.codigo} ·{" "}
                {imovel.finalidade === "locacao" ? "Para alugar" : "À venda"} ·{" "}
                {imovel.cidade}
              </span>
              <h1>{imovel.titulo}</h1>
              <p className="detail-price">
                R$ {imovel.preco.toLocaleString("pt-BR")}{" "}
                {imovel.finalidade === "locacao" && <small>/mês</small>}
              </p>
              <p>{imovel.descricao}</p>
              <div className="detail-specs">
                <span>{imovel.tipo}</span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                  title={`${imovel.quartos} quartos`}
                >
                  <Bed size={16} />
                  <span>{imovel.quartos}</span>
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                  title={`${imovel.banheiros} banheiros`}
                >
                  <Bath size={16} />
                  <span>{imovel.banheiros}</span>
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                  title={`${imovel.vagasGaragem} vagas`}
                >
                  <Car size={16} />
                  <span>{imovel.vagasGaragem}</span>
                </span>
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
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <a className="button" href="/contato">
                  Tenho interesse
                </a>
                <button
                  type="button"
                  onClick={toggleFavorito}
                  className="button secondary"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Heart
                    size={18}
                    fill={isFavorite ? "#dc2626" : "none"}
                    color={isFavorite ? "#dc2626" : "currentColor"}
                  />
                  <span>
                    {isFavorite ? "Remover dos favoritos" : "Favoritar imóvel"}
                  </span>
                </button>
              </div>
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
                    <h2 style={{ margin: 0, fontSize: "1.3rem" }}>
                      Localização
                    </h2>
                    <span
                      style={{ fontSize: "0.88rem", color: "var(--muted)" }}
                    >
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
