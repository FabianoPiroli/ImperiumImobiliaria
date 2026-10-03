"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getClientRequest, updateClientRequest, uploadClientRequestPhoto } from "@/src/lib/api";
import { Brand } from "@/src/components/Brand";
import { ThemeToggle } from "@/src/components/ThemeToggle";
import { ClientLocationFields } from "@/src/components/ClientLocationFields";

type RequestItem = {
  id: number;
  titulo: string;
  tipo: string;
  finalidade: string;
  estado: string;
  cidade: string;
  bairro: string;
  preco?: number;
  descricao: string;
  status: string;
  contatoEmail: string;
  contatoTelefone: string;
  fotoUrl?: string | null;
  createdAt: string;
};

export default function ClientEditRequestPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = Number(params?.id);

  const [item, setItem] = useState<RequestItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("imperium_token")) {
      window.location.href = "/login";
      return;
    }
    if (!requestId) return;

    getClientRequest(requestId)
      .then((data) => {
        setItem(data);
        setLoading(false);
      })
      .catch((err) => {
        setErro(err instanceof Error ? err.message : "Erro ao carregar a solicitação.");
        setLoading(false);
      });
  }, [requestId]);

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!item) return;
    setSaving(true);
    setErro("");
    const form = new FormData(e.currentTarget);
    const data = {
      titulo: String(form.get("titulo") || ""),
      tipo: String(form.get("tipo") || ""),
      finalidade: String(form.get("finalidade") || ""),
      estado: String(form.get("estado") || ""),
      cidade: String(form.get("cidade") || ""),
      bairro: String(form.get("bairro") || ""),
      preco: Number(form.get("preco")) || undefined,
      descricao: String(form.get("descricao") || ""),
      contatoEmail: String(form.get("contatoEmail") || ""),
      contatoTelefone: String(form.get("contatoTelefone") || ""),
    };

    try {
      await updateClientRequest(item.id, data);
      const foto = form.get("foto") as File | null;
      if (foto && foto.size > 0) {
        await uploadClientRequestPhoto(item.id, foto);
      }
      router.push("/cliente");
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar alterações.");
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="shell">
        <div className="container" style={{ padding: "60px 0" }}>
          <p>Carregando dados da solicitação...</p>
        </div>
      </div>
    );
  }

  if (erro && !item) {
    return (
      <div className="shell">
        <div className="container" style={{ padding: "60px 0" }}>
          <div className="panel">
            <h2>Não foi possível encontrar a solicitação</h2>
            <p>{erro}</p>
            <a className="button" href="/cliente">Voltar à minha conta</a>
          </div>
        </div>
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="shell">
      <div className="container">
        <header className="topbar">
          <a className="brand" href="/"><Brand /></a>
          <div className="admin-actions">
            <ThemeToggle />
            <a className="button secondary" href="/cliente">← Voltar à minha conta</a>
          </div>
        </header>

        <main style={{ paddingBottom: "80px" }}>
          <div className="page-head">
            <div>
              <span className="eyebrow">Área do cliente · Solicitação #{item.id}</span>
              <h1>Editar solicitação</h1>
              <p className="admin-request-intro">
                Status atual: <span className={`request-badge status-${item.status}`}>{item.status.replace("_", " ")}</span>
              </p>
            </div>
          </div>

          {erro && <div className="panel" style={{ marginBottom: "20px", color: "var(--danger, #c62828)" }}>{erro}</div>}

          <div className="panel">
            <form className="form-grid" onSubmit={handleSave}>
              <label className="field full">
                <span>Título</span>
                <input name="titulo" defaultValue={item.titulo} required />
              </label>

              <label className="field">
                <span>Tipo</span>
                <select name="tipo" defaultValue={item.tipo}>
                  <option value="casa">Casa</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="terreno">Terreno</option>
                  <option value="comercial">Comercial</option>
                </select>
              </label>

              <label className="field">
                <span>Finalidade</span>
                <select name="finalidade" defaultValue={item.finalidade}>
                  <option value="venda">Venda</option>
                  <option value="locacao">Locação</option>
                </select>
              </label>

              <ClientLocationFields
                initialEstado={item.estado}
                initialCidade={item.cidade}
                initialBairro={item.bairro}
              />

              <label className="field">
                <span>Preço estimado</span>
                <input name="preco" type="number" min="0" defaultValue={item.preco ?? ""} />
              </label>

              <label className="field">
                <span>E-mail para contato</span>
                <input name="contatoEmail" type="email" defaultValue={item.contatoEmail} required />
              </label>

              <label className="field">
                <span>Telefone para contato</span>
                <input name="contatoTelefone" type="tel" defaultValue={item.contatoTelefone} required />
              </label>

              <div className="field full" style={{ display: "grid", gap: "10px" }}>
                <span>Foto do imóvel</span>
                {item.fotoUrl && (
                  <div style={{ maxWidth: "320px", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--line)" }}>
                    <img src={item.fotoUrl} alt={item.titulo} style={{ width: "100%", maxHeight: "200px", objectFit: "cover", display: "block" }} />
                    <small style={{ display: "block", padding: "6px 10px", color: "var(--muted)", background: "var(--soft)" }}>Foto atual cadastrada</small>
                  </div>
                )}
                <label style={{ display: "grid", gap: "6px" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{item.fotoUrl ? "Substituir foto (opcional)" : "Enviar foto"}</span>
                  <input name="foto" type="file" accept="image/*" />
                </label>
              </div>

              <label className="field full">
                <span>Descrição detalhada</span>
                <textarea name="descricao" defaultValue={item.descricao} required />
              </label>

              <div className="field full" style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "16px" }}>
                <a className="button secondary" href="/cliente">
                  Cancelar
                </a>
                <button className="button" type="submit" disabled={saving}>
                  {saving ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
