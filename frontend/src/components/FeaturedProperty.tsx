"use client";
import { useEffect, useState } from "react";
import {
  addClientFavorite,
  getClientFavorites,
  getImoveis,
  mediaUrl,
  removeClientFavorite,
} from "@/src/lib/api";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

type Imovel = {
  id: number;
  codigo: number;
  titulo: string;
  cidade: string;
  preco: number;
  finalidade: string;
  midias?: { url: string; tipo: string }[];
};
export function FeaturedProperty() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [indice, setIndice] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [imagemAtual, setImagemAtual] = useState<string | null>(null);
  const [imagemAnterior, setImagemAnterior] = useState<string | null>(null);

  useEffect(() => {
    getImoveis()
      .then((items: Imovel[]) => setImoveis(items))
      .catch(() => setImoveis([]));
    if (typeof window !== "undefined" && localStorage.getItem("imperium_token")) {
      getClientFavorites()
        .then((items) =>
          setFavoritos(items.map((item: { imovelId: number }) => item.imovelId)),
        )
        .catch(() => undefined);
    }
  }, []);

  const toggleFavorito = async (id: number) => {
    if (!localStorage.getItem("imperium_token")) {
      window.location.href = `/cliente/login?next=/anuncio/${id}`;
      return;
    }
    const alreadyFavorite = favoritos.includes(id);
    try {
      if (alreadyFavorite) await removeClientFavorite(id);
      else await addClientFavorite(id);
      setFavoritos((prev) =>
        alreadyFavorite ? prev.filter((p) => p !== id) : [...prev, id],
      );
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (pausado || imoveis.length < 2) return;
    const interval = window.setInterval(() => {
      setIndice((current) => (current + 1) % imoveis.length);
    }, 10000);
    return () => window.clearInterval(interval);
  }, [imoveis.length, pausado]);

  const imovel = imoveis[indice] ?? null;
  const imagem = imovel?.midias?.find((midia) => midia.tipo === "imagem");
  const imagemUrl = imagem ? mediaUrl(imagem.url) : null;

  useEffect(() => {
    if (imagemUrl === imagemAtual) return;
    setImagemAnterior(imagemAtual);
    setImagemAtual(imagemUrl);
  }, [imagemUrl, imagemAtual]);

  function mudarImovel(direcao: 1 | -1) {
    setIndice(
      (current) => (current + direcao + imoveis.length) % imoveis.length,
    );
  }

  return (
    <aside
      className="hero-visual"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
    >
      {imagemAnterior && (
        <div
          className="hero-image-layer hero-image-layer-previous"
          style={{ backgroundImage: `url(${imagemAnterior})` }}
          aria-hidden="true"
        />
      )}
      {imagemAtual && (
        <div
          className="hero-image-layer hero-image-layer-current"
          key={imagemAtual}
          style={{ backgroundImage: `url(${imagemAtual})` }}
          aria-hidden="true"
        />
      )}
      {imoveis.length > 1 && (
        <button
          className="hero-carousel-arrow hero-carousel-arrow-left"
          type="button"
          onClick={() => mudarImovel(-1)}
          aria-label="Imóvel anterior"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>
      )}
      {imoveis.length > 1 && (
        <button
          className="hero-carousel-arrow hero-carousel-arrow-right"
          type="button"
          onClick={() => mudarImovel(1)}
          aria-label="Próximo imóvel"
        >
          <ChevronRight size={22} strokeWidth={2.5} />
        </button>
      )}
      <div
        className="hero-featured-top"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <h2 className="hero-featured-title">
          {imovel?.titulo ?? "Novos imóveis em breve"}
        </h2>
        {imovel && (
          <button
            type="button"
            aria-label={
              favoritos.includes(imovel.id)
                ? "Remover dos favoritos"
                : "Adicionar aos favoritos"
            }
            onClick={() => toggleFavorito(imovel.id)}
            style={{
              background: "rgba(0,0,0,0.45)",
              borderRadius: 8,
              padding: 8,
              border: "none",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: favoritos.includes(imovel.id) ? "#ef4444" : "#ffffff",
              backdropFilter: "blur(4px)",
              transition: "color 0.2s ease",
            }}
          >
            <Heart
              size={20}
              fill={favoritos.includes(imovel.id) ? "currentColor" : "none"}
            />
          </button>
        )}
      </div>
      <div className="hero-featured-content">
        <div className="hero-featured-copy">
          {imovel ? (
            <span>
              Código {imovel.codigo} · {imovel.cidade} · R${" "}
              {imovel.preco.toLocaleString("pt-BR")}
              {imovel.finalidade === "locacao" && "/mês"}
            </span>
          ) : (
            <span>Nenhum anúncio disponível</span>
          )}
        </div>
        {imovel && (
          <a className="button" href={`/anuncio/${imovel.id}`}>
            Ver anúncio
          </a>
        )}
      </div>
      {imoveis.length > 1 && (
        <div className="hero-carousel-dock" aria-label="Imóveis em destaque">
          {imoveis.slice(0, 4).map((item, cardIndex) => {
            const cardImage = item.midias?.find(
              (midia) => midia.tipo === "imagem",
            );
            return (
              <button
                className={`hero-property-card${cardIndex === indice ? " is-active" : ""}`}
                key={item.id}
                type="button"
                onClick={() => setIndice(cardIndex)}
                aria-label={`Exibir ${item.titulo}`}
              >
                {cardImage ? (
                  <img src={mediaUrl(cardImage.url)} alt="" />
                ) : (
                  <span className="hero-property-card-placeholder">
                    Imperium
                  </span>
                )}
                <span>{item.titulo}</span>
                <small>{item.cidade}</small>
              </button>
            );
          })}
        </div>
      )}
    </aside>
  );
}
