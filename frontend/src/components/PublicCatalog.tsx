"use client";
import { useEffect, useState } from "react";
import { getImoveis, mediaUrl } from "@/src/lib/api";
import { Bed, Bath, Car, Heart } from "lucide-react";
import { useCallback } from "react";
type Imovel = {
  id: number;
  codigo: number;
  titulo: string;
  descricao: string;
  tipo: string;
  estado: string;
  cidade: string;
  bairro: string;
  preco: number;
  quartos: number;
  banheiros: number;
  vagasGaragem: number;
  finalidade: string;
  midias?: { url: string; tipo: string }[];
};
export function PublicCatalog({
  finalidade,
  categoria,
  precoMax,
  estado,
  cidade,
  bairro,
}: {
  finalidade: "venda" | "locacao";
  categoria?: string;
  precoMax?: number;
  estado?: string;
  cidade?: string;
  bairro?: string;
}) {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [erro, setErro] = useState("");
  useEffect(() => {
    getImoveis()
      .then(setImoveis)
      .catch((error) => setErro(error.message));
  }, []);
  const filtrados = imoveis.filter(
    (imovel) =>
      (imovel.finalidade ?? "venda") === finalidade &&
      (!categoria || imovel.tipo.toLowerCase().includes(categoria)) &&
      (!precoMax || imovel.preco <= precoMax) &&
      (!estado || imovel.estado.toLowerCase() === estado.toLowerCase()) &&
      (!cidade || imovel.cidade.toLowerCase().includes(cidade.toLowerCase())) &&
      (!bairro || imovel.bairro.toLowerCase().includes(bairro.toLowerCase())),
  );
  const [favoritos, setFavoritos] = useState<number[]>([]);

  const toggleFavorito = useCallback((id: number) => {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }, []);

  return (
    <section className="public-listing">
      <div className="property-grid">
        {erro ? (
          <div className="panel">
            Não foi possível carregar os anúncios agora.
          </div>
        ) : filtrados.length === 0 ? (
          <div className="empty-state">
            <span className="eyebrow">Em breve</span>
            <h2>Estamos preparando novos anúncios.</h2>
            <p>Fale com a nossa equipe para encontrar uma opção sob medida.</p>
            <a className="button" href="/contato">
              Entrar em contato
            </a>
          </div>
        ) : (
          filtrados.map((imovel) => (
            <a
              className="property-card-link"
              href={`/anuncio/${imovel.id}`}
              key={imovel.id}
            >
              <article className="public-property-card">
                <div className="property-image">
                  {imovel.midias?.[0]?.tipo === "imagem" ? (
                    <img
                      src={mediaUrl(imovel.midias[0].url)}
                      alt={imovel.titulo}
                    />
                  ) : (
                    <span className="image-placeholder">Imperium</span>
                  )}
                  <button
                    aria-label={favoritos.includes(imovel.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorito(imovel.id);
                    }}
                    className={`favorite-toggle transition-colors duration-200 ${favoritos.includes(imovel.id) ? 'text-red-600' : 'text-white'}`}
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      background: "rgba(0,0,0,0.35)",
                      borderRadius: 8,
                      padding: 6,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Heart size={20} className={`transform transition-transform ${favoritos.includes(imovel.id) ? 'scale-105' : 'scale-100'}`} fill={favoritos.includes(imovel.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <div className="public-property-content">
                  <span className="eyebrow">
                    Código {imovel.codigo} ·{" "}
                    {finalidade === "venda" ? "À venda" : "Para alugar"} ·{" "}
                    {imovel.cidade}
                  </span>
                  <h2>{imovel.titulo}</h2>
                  <div className="property-meta">
                    <span>
                      R$ {imovel.preco.toLocaleString("pt-BR")}
                      {finalidade === "locacao" && <small>/mês</small>}
                    </span>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
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
                    </span>
                  </div>
                  <span className="text-link">
                    Ver detalhes <span aria-hidden="true">→</span>
                  </span>
                </div>
              </article>
            </a>
          ))
        )}
      </div>
    </section>
  );
}
