"use client";
import { useState } from "react";
import { mediaUrl } from "@/src/lib/api";
type Media = { url: string; tipo: string; nome?: string };
export function MediaCarousel({
  midias,
  titulo,
}: {
  midias: Media[];
  titulo: string;
}) {
  const [indice, setIndice] = useState(0);
  if (!midias.length)
    return (
      <div className="detail-placeholder">
        <span className="logo-mark">II</span>
        <span>Imagem em breve</span>
      </div>
    );
  const atual = midias[indice];
  const anterior = () =>
    setIndice((valor) => (valor - 1 + midias.length) % midias.length);
  const proxima = () => setIndice((valor) => (valor + 1) % midias.length);
  return (
    <div className="media-carousel">
      <div className="carousel-stage">
        {atual.tipo === "video" ? (
          <video src={mediaUrl(atual.url)} controls />
        ) : (
          <img
            src={mediaUrl(atual.url)}
            alt={`${titulo} - imagem ${indice + 1}`}
          />
        )}
        {midias.length > 1 && (
          <>
            <button
              className="carousel-control previous"
              type="button"
              onClick={anterior}
              aria-label="Imagem anterior"
            >
              ‹
            </button>
            <button
              className="carousel-control next"
              type="button"
              onClick={proxima}
              aria-label="Próxima imagem"
            >
              ›
            </button>
          </>
        )}
      </div>
      {midias.length > 1 && (
        <div className="carousel-dots" aria-label="Navegação da galeria">
          {midias.map((midia, item) => (
            <button
              className={item === indice ? "active" : ""}
              key={`${midia.url}-${item}`}
              type="button"
              onClick={() => setIndice(item)}
              aria-label={`Ver mídia ${item + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
