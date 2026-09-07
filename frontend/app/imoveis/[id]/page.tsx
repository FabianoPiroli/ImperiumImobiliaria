"use client";

import { FormEvent, useEffect, useState } from "react";
import { Brand } from "@/src/components/Brand";
import { deleteMedia, getImovel, mediaUrl, updateImovel, uploadMedias } from "@/src/lib/api";

type Imovel = {
  id: number;
  codigo: number;
  titulo: string;
  descricao: string;
  tipo: string;
  estado: string;
  cidade: string;
  bairro: string;
  endereco: string;
  preco: number;
  quartos: number;
  banheiros: number;
  vagasGaragem: number;
  finalidade: string;
  midias: { id: number; url: string; tipo: string; nome: string }[];
};

const estados = ["SC", "PR", "RS", "SP"];
const cidades = [
  "Videira",
  "Joaçaba",
  "Caçador",
  "Curitiba",
  "Florianópolis",
  "São Paulo",
];
const bairros = [
  "Centro",
  "Universitário",
  "Jardim Canadá",
  "São Cristóvão",
  "Industrial",
];
const tipos = [
  "Casa",
  "Apartamento",
  "Terreno / lote",
  "Prédio comercial",
  "Terreno rural / sítio / fazenda / chácara",
];

export default function EditarImovelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    params.then(({ id }) =>
      getImovel(Number(id))
        .then(setImovel)
        .catch((error) => setErro(error.message)),
    );
  }, [params]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!imovel) return;
    setErro("");
    setSalvando(true);
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      await updateImovel(imovel.id, {
        titulo: form.get("titulo"),
        descricao: form.get("descricao"),
        tipo: form.get("tipo"),
        estado: form.get("estado"),
        cidade: form.get("cidade"),
        bairro: form.get("bairro"),
        endereco: form.get("endereco"),
        preco: Number(form.get("preco")),
        quartos: Number(form.get("quartos")),
        banheiros: Number(form.get("banheiros")),
        vagasGaragem: Number(form.get("vagasGaragem")),
        finalidade: form.get("finalidade"),
      });
      const imagens = Array.from(
        (formElement.elements.namedItem("arquivoImagem") as HTMLInputElement)
          .files ?? [],
      );
      const video = (
        formElement.elements.namedItem("arquivoVideo") as HTMLInputElement
      ).files?.[0];
      await uploadMedias(imovel.id, [...imagens, ...(video ? [video] : [])]);
      window.location.href = "/imoveis";
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Não foi possível salvar.",
      );
      setSalvando(false);
    }
  }

  async function removeMedia(mediaId: number) {
    if (!imovel || !window.confirm("Excluir esta mídia?")) return;
    try {
      await deleteMedia(imovel.id, mediaId);
      setImovel({ ...imovel, midias: imovel.midias.filter((media) => media.id !== mediaId) });
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível excluir a mídia.");
    }
  }

  if (erro && !imovel)
    return (
      <main className="login shell">
        <div className="panel">{erro}</div>
      </main>
    );
  if (!imovel) return <main className="login shell">Carregando...</main>;

  return (
    <div className="shell">
      <div className="container">
        <header className="topbar">
          <a className="brand" href="/">
            <Brand />
          </a>
          <a href="/imoveis" className="button secondary">
            Voltar
          </a>
        </header>
        <div className="page-head">
          <div>
            <span className="eyebrow">
              Código {imovel.codigo} · Painel administrativo
            </span>
            <h1>Editar imóvel</h1>
          </div>
        </div>
        <form className="panel form-grid" onSubmit={submit}>
          <label className="field full">
            <span>Título</span>
            <input name="titulo" defaultValue={imovel.titulo} required />
          </label>
          <label className="field">
            <span>Finalidade</span>
            <select
              name="finalidade"
              defaultValue={imovel.finalidade || "venda"}
            >
              <option value="venda">Comprar</option>
              <option value="aluguel">Alugar</option>
            </select>
          </label>
          <label className="field">
            <span>Tipo</span>
            <select name="tipo" defaultValue={imovel.tipo}>
              {tipos.map((tipo) => (
                <option key={tipo}>{tipo}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Estado</span>
            <select name="estado" defaultValue={imovel.estado}>
              {estados.map((estado) => (
                <option key={estado}>{estado}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Cidade</span>
            <select name="cidade" defaultValue={imovel.cidade}>
              {cidades.map((cidade) => (
                <option key={cidade}>{cidade}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Bairro</span>
            <select name="bairro" defaultValue={imovel.bairro}>
              {bairros.map((bairro) => (
                <option key={bairro}>{bairro}</option>
              ))}
            </select>
          </label>
          <label className="field full">
            <span>Endereço</span>
            <input name="endereco" defaultValue={imovel.endereco} required />
          </label>
          <label className="field full">
            <span>Descrição</span>
            <textarea
              name="descricao"
              defaultValue={imovel.descricao}
              required
            />
          </label>
          <label className="field">
            <span>Preço</span>
            <input
              name="preco"
              type="number"
              min="0"
              defaultValue={imovel.preco}
              required
            />
          </label>
          <label className="field">
            <span>Quartos</span>
            <input
              name="quartos"
              type="number"
              min="0"
              defaultValue={imovel.quartos}
              required
            />
          </label>
          <label className="field">
            <span>Banheiros</span>
            <input
              name="banheiros"
              type="number"
              min="0"
              defaultValue={imovel.banheiros}
              required
            />
          </label>
          <label className="field">
            <span>Vagas de garagem</span>
            <input
              name="vagasGaragem"
              type="number"
              min="0"
              defaultValue={imovel.vagasGaragem ?? 0}
              required
            />
          </label>
          <label className="field">
            <span>
              Adicionar imagens <small>(opcional, várias)</small>
            </span>
            <input name="arquivoImagem" type="file" accept="image/*" multiple />
          </label>
          <label className="field">
            <span>
              Adicionar vídeo <small>(opcional, apenas 1)</small>
            </span>
            <input name="arquivoVideo" type="file" accept="video/*" />
          </label>
          {erro && (
            <p className="field full" style={{ color: "#a64736" }}>
              {erro}
            </p>
          )}
          <div className="full">
            <button className="button" disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
        <section className="panel" style={{ margin: "20px 0 60px" }}>
          <span className="eyebrow">Galeria atual</span>
          <h2>Fotos e vídeos cadastrados</h2>
          <div className="admin-media-grid">
            {imovel.midias?.map((midia) => (
              <div className="admin-media-item" key={midia.id}>
                {midia.tipo === "video" ? (
                  <video src={mediaUrl(midia.url)} controls />
                ) : (
                  <img src={mediaUrl(midia.url)} alt={midia.nome} />
                )}
                <button className="button danger" type="button" onClick={() => removeMedia(midia.id)}>Excluir mídia</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
