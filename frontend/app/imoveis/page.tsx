"use client";

import { useEffect, useState } from "react";
import { deleteImovel, getImoveis, mediaUrl } from "@/src/lib/api";
import { Brand } from "@/src/components/Brand";

type Imovel = {
  id: number;
  codigo: number;
  titulo: string;
  descricao: string;
  cidade: string;
  preco: number;
  quartos: number;
  banheiros: number;
  vagasGaragem: number;
  status: string;
  finalidade?: string;
  midias?: { url: string; tipo: string }[];
};

export default function ImoveisPage() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [erro, setErro] = useState("");
  useEffect(() => {
    getImoveis()
      .then(setImoveis)
      .catch((e) => setErro(e.message));
  }, []);
  async function remove(id: number) {
    if (!window.confirm("Excluir este imóvel?")) return;
    await deleteImovel(id);
    setImoveis((items) => items.filter((item) => item.id !== id));
  }
  return (
    <div className="shell">
      <div className="container">
        <header className="topbar">
          <a className="brand" href="/">
            <Brand />
          </a>
          <button
            className="button secondary"
            onClick={() => {
              localStorage.removeItem("imperium_token");
              window.location.href = "/login";
            }}
          >
            Sair
          </button>
        </header>
        <div className="page-head">
          <div>
            <span className="eyebrow">Painel administrativo</span>
            <h1>Imóveis</h1>
          </div>
          <a className="button" href="/imoveis/novo">
            + Novo imóvel
          </a>
        </div>
        {erro ? (
          <div className="panel">{erro}</div>
        ) : (
          <div className="property-grid">
            {imoveis.map((imovel) => {
              const primeiraImagem = imovel.midias?.find(
                (m) => m.tipo === "imagem"
              );
              return (
                <article className="public-property-card" key={imovel.id}>
                  <div className="property-image">
                    {primeiraImagem ? (
                      <img
                        src={mediaUrl(primeiraImagem.url)}
                        alt={imovel.titulo}
                      />
                    ) : (
                      <span className="image-placeholder">Imperium</span>
                    )}
                  </div>
                  <div className="public-property-content">
                    <span className="eyebrow">
                      Código {imovel.codigo} · {imovel.status}
                    </span>
                    <h2>{imovel.titulo}</h2>
                    <p>{imovel.descricao}</p>
                    <div className="property-meta">
                      <span>R$ {imovel.preco.toLocaleString("pt-BR")}</span>
                      <span>
                        {imovel.quartos} qtos · {imovel.banheiros} banh. ·{" "}
                        {imovel.vagasGaragem} vagas
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: "auto", paddingTop: 18 }}>
                      <a
                        className="button secondary"
                        href={`/imoveis/${imovel.id}`}
                      >
                        Editar
                      </a>
                      <button
                        className="button danger"
                        onClick={() => remove(imovel.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
