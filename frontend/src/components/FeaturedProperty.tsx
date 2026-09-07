"use client";
import { useEffect, useState } from "react";
import { getImoveis, mediaUrl } from "@/src/lib/api";

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
  const [imovel, setImovel] = useState<Imovel | null>(null);
  useEffect(() => {
    getImoveis()
      .then((imoveis: Imovel[]) => setImovel(imoveis[0] ?? null))
      .catch(() => setImovel(null));
  }, []);
  const imagem = imovel?.midias?.find((midia) => midia.tipo === "imagem");
  return (
    <aside
      className="hero-visual"
      style={
        imagem ? { backgroundImage: `url(${mediaUrl(imagem.url)})` } : undefined
      }
    >
      <div className="visual-card">
        <span className="eyebrow">Em destaque</span>
        <strong>{imovel?.titulo ?? "Novos imóveis em breve"}</strong>
        {imovel ? (
          <span>
            Código {imovel.codigo} · {imovel.cidade} · R${" "}
            {imovel.preco.toLocaleString("pt-BR")}
            {imovel.finalidade === "aluguel" && "/mês"}
          </span>
        ) : (
          <span>Cadastre o primeiro anúncio no painel administrativo.</span>
        )}
        <br />
        {imovel && (
          <a className="text-link" href={`/anuncio/${imovel.id}`}>
            Ver anúncio →
          </a>
        )}
      </div>
    </aside>
  );
}
