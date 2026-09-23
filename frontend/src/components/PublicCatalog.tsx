"use client";
import { useEffect, useState } from "react";
import { getImoveis, mediaUrl } from "@/src/lib/api";
import { Bed, Bath, Car } from "lucide-react";
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
  finalidade: "venda" | "aluguel";
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
                      {finalidade === "aluguel" && <small>/mês</small>}
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
