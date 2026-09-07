"use client";

import { FormEvent, useState } from "react";
import { Brand } from "@/src/components/Brand";
import { createImovel, uploadMedias } from "@/src/lib/api";

import { LocationFields } from "@/src/components/LocationFields";

export default function NovoImovelPage() {
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");
    setSalvando(true);
    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    try {
      const imovel = await createImovel({
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
            <span className="eyebrow">Painel administrativo</span>
            <h1>Novo imóvel</h1>
          </div>
        </div>
        <form className="panel form-grid" onSubmit={submit}>
          <label className="field full">
            <span>Título</span>
            <input name="titulo" required placeholder="Ex.: Casa Horizonte" />
          </label>
          <label className="field">
            <span>Finalidade</span>
            <select name="finalidade" defaultValue="venda">
              <option value="venda">Comprar</option>
              <option value="aluguel">Alugar</option>
            </select>
          </label>
          <label className="field">
            <span>Tipo</span>
            <select name="tipo" defaultValue="Casa">
              <option>Casa</option>
              <option>Apartamento</option>
              <option>Terreno / lote</option>
              <option>Prédio comercial</option>
              <option>Terreno rural / sítio / fazenda / chácara</option>
            </select>
          </label>
          <LocationFields initialEstado="SC" />
          <label className="field full">
            <span>Descrição</span>
            <textarea name="descricao" required />
          </label>
          <label className="field">
            <span>Preço</span>
            <input name="preco" type="number" min="0" required />
          </label>
          <label className="field">
            <span>Quartos</span>
            <input name="quartos" type="number" min="0" required />
          </label>
          <label className="field">
            <span>Banheiros</span>
            <input name="banheiros" type="number" min="0" required />
          </label>
          <label className="field">
            <span>Vagas de garagem</span>
            <input
              name="vagasGaragem"
              type="number"
              min="0"
              defaultValue="0"
              required
            />
          </label>
          <label className="field">
            <span>
              Imagens <small>(opcional, várias)</small>
            </span>
            <input name="arquivoImagem" type="file" accept="image/*" multiple />
          </label>
          <label className="field">
            <span>
              Vídeo <small>(opcional, apenas 1)</small>
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
              {salvando ? "Salvando..." : "Salvar imóvel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
