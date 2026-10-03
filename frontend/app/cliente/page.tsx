"use client";

import { FormEvent, useEffect, useState } from "react";
import { Brand } from "@/src/components/Brand";
import { ClientLocationFields } from "@/src/components/ClientLocationFields";
import { ThemeToggle } from "@/src/components/ThemeToggle";
import {
  createClientRequest,
  deleteClientRequest,
  getClientFavorites,
  getClientRequests,
  mediaUrl,
  updateClientRequest,
  uploadClientRequestPhoto,
} from "@/src/lib/api";

type Favorite = {
  imovel: {
    id: number;
    titulo: string;
    cidade: string;
    preco: number;
    midias?: { url: string; tipo: string }[];
  };
};

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
  contatoEmail: string;
  contatoTelefone: string;
  fotoUrl?: string | null;
  status: string;
  createdAt: string;
};

export default function ClienteDashboardPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [editingRequest, setEditingRequest] = useState<RequestItem | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("imperium_token")) {
      window.location.href = "/login";
      return;
    }
    Promise.all([getClientFavorites(), getClientRequests()])
      .then(([favoriteItems, requestItems]) => {
        setFavorites(favoriteItems);
        setRequests(requestItems);
      })
      .catch(() => setMessage("Não foi possível carregar sua área do cliente."));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      const request = await createClientRequest({
        titulo: form.get("titulo"),
        tipo: form.get("tipo"),
        finalidade: form.get("finalidade"),
        estado: form.get("estado"),
        cidade: form.get("cidade"),
        bairro: form.get("bairro"),
        preco: Number(form.get("preco")) || undefined,
        descricao: form.get("descricao"),
        contatoEmail: form.get("contatoEmail"),
        contatoTelefone: form.get("contatoTelefone"),
      });
      const foto = form.get("foto") as File | null;
      if (foto?.size) await uploadClientRequestPhoto(request.id, foto);
      setMessage("Solicitação enviada para avaliação da equipe.");
      formElement.reset();
      setRequests(await getClientRequests());
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível enviar.");
    }
  }

  async function handleDeleteRequest(id: number) {
    if (!confirm("Tem certeza que deseja excluir esta solicitação? Esta ação é definitiva.")) return;
    try {
      await deleteClientRequest(id);
      setRequests((current) => current.filter((item) => item.id !== id));
      setMessage("Solicitação excluída com sucesso.");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Não foi possível excluir a solicitação.");
    }
  }

  async function handleSaveEditRequest(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingRequest) return;
    setSavingEdit(true);
    const formElement = e.currentTarget;
    const form = new FormData(formElement);
    try {
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
      await updateClientRequest(editingRequest.id, data);
      const foto = form.get("foto") as File | null;
      if (foto && foto.size > 0) {
        await uploadClientRequestPhoto(editingRequest.id, foto);
      }
      setMessage("Solicitação atualizada com sucesso.");
      setEditingRequest(null);
      setRequests(await getClientRequests());
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao atualizar a solicitação.");
    } finally {
      setSavingEdit(false);
    }
  }

  function logout() {
    localStorage.removeItem("imperium_token");
    localStorage.removeItem("imperium_user");
    window.location.href = "/";
  }

  return (
    <div className="shell">
      <div className="container">
        <header className="topbar">
          <a className="brand" href="/"><Brand /></a>
          <div className="admin-actions"><ThemeToggle /><button className="button secondary" onClick={logout}>Sair</button></div>
        </header>
        <main className="client-dashboard">
          <div className="page-head"><div><span className="eyebrow">Área do cliente</span><h1>Minha conta</h1></div></div>
          {message && <div className="panel" style={{ marginBottom: "18px" }}>{message}</div>}
          <section className="client-grid">
            <div className="panel">
              <h2>Imóveis favoritos</h2>
              {favorites.length === 0 ? <p>Você ainda não salvou nenhum imóvel.</p> : favorites.map(({ imovel }) => <a className="client-favorite" href={`/anuncio/${imovel.id}`} key={imovel.id}>{imovel.midias?.[0] && <img src={mediaUrl(imovel.midias[0].url)} alt="" />}<span><strong>{imovel.titulo}</strong><small>{imovel.cidade} · R$ {imovel.preco.toLocaleString("pt-BR")}</small></span></a>)}
            </div>
            <div className="panel">
              <h2>Enviar imóvel para avaliação</h2>
              <form className="form-grid" onSubmit={submit}>
                <label className="field full"><span>Título</span><input name="titulo" required /></label>
                <label className="field"><span>Tipo</span><select name="tipo" defaultValue="casa"><option value="casa">Casa</option><option value="apartamento">Apartamento</option><option value="terreno">Terreno</option><option value="comercial">Comercial</option></select></label>
                <label className="field"><span>Finalidade</span><select name="finalidade" defaultValue="venda"><option value="venda">Venda</option><option value="locacao">Locação</option></select></label>
                <ClientLocationFields />
                <label className="field"><span>Preço estimado</span><input name="preco" type="number" min="0" /></label>
                <label className="field"><span>E-mail para contato</span><input name="contatoEmail" type="email" required /></label>
                <label className="field"><span>Telefone para contato</span><input name="contatoTelefone" type="tel" required /></label>
                <label className="field full"><span>Foto do imóvel</span><input name="foto" type="file" accept="image/*" /></label>
                <label className="field full"><span>Descrição</span><textarea name="descricao" required /></label>
                <button className="button full">Enviar para avaliação</button>
              </form>
            </div>
          </section>

          <section className="panel client-requests">
            <h2>Minhas solicitações</h2>
            {requests.length === 0 ? (
              <p>Nenhuma solicitação enviada.</p>
            ) : (
              requests.map((item) => (
                <div className="request-row" key={item.id}>
                  <div className="request-row-info">
                    <strong>{item.titulo}</strong>
                    <span className="request-row-meta">
                      {item.bairro ? `${item.bairro}, ` : ""}{item.cidade} / {item.estado} · {item.finalidade === "locacao" ? "Locação" : "Venda"} · {item.tipo}
                      {item.preco ? ` · R$ ${item.preco.toLocaleString("pt-BR")}` : ""}
                    </span>
                    <small style={{ color: "var(--muted)", fontSize: "0.76rem" }}>
                      Enviada em {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                    </small>
                  </div>
                  <div className="request-row-actions">
                    <span className={`request-badge status-${item.status}`}>
                      {item.status.replace("_", " ")}
                    </span>
                    <button className="button secondary" type="button" onClick={() => setEditingRequest(item)}>
                      Editar
                    </button>
                    <button className="button danger" type="button" onClick={() => handleDeleteRequest(item.id)}>
                      Excluir
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>
        </main>

        {editingRequest && (
          <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setEditingRequest(null); }}>
            <div className="modal-box">
              <h2>Editar Solicitação #{editingRequest.id}</h2>
              <form className="form-grid" onSubmit={handleSaveEditRequest}>
                <label className="field full">
                  <span>Título</span>
                  <input name="titulo" defaultValue={editingRequest.titulo} required />
                </label>
                <label className="field">
                  <span>Tipo</span>
                  <select name="tipo" defaultValue={editingRequest.tipo}>
                    <option value="casa">Casa</option>
                    <option value="apartamento">Apartamento</option>
                    <option value="terreno">Terreno</option>
                    <option value="comercial">Comercial</option>
                  </select>
                </label>
                <label className="field">
                  <span>Finalidade</span>
                  <select name="finalidade" defaultValue={editingRequest.finalidade}>
                    <option value="venda">Venda</option>
                    <option value="locacao">Locação</option>
                  </select>
                </label>
                <ClientLocationFields
                  initialEstado={editingRequest.estado}
                  initialCidade={editingRequest.cidade}
                  initialBairro={editingRequest.bairro}
                />
                <label className="field">
                  <span>Preço estimado</span>
                  <input name="preco" type="number" min="0" defaultValue={editingRequest.preco ?? ""} />
                </label>
                <label className="field">
                  <span>E-mail para contato</span>
                  <input name="contatoEmail" type="email" defaultValue={editingRequest.contatoEmail} required />
                </label>
                <label className="field">
                  <span>Telefone para contato</span>
                  <input name="contatoTelefone" type="tel" defaultValue={editingRequest.contatoTelefone} required />
                </label>
                <label className="field full">
                  <span>Alterar foto do imóvel (opcional)</span>
                  <input name="foto" type="file" accept="image/*" />
                  {editingRequest.fotoUrl && (
                    <small style={{ color: "var(--muted)", display: "block", marginTop: "4px" }}>
                      Já possui foto cadastrada. Selecione um arquivo apenas se desejar substituí-la.
                    </small>
                  )}
                </label>
                <label className="field full">
                  <span>Descrição</span>
                  <textarea name="descricao" defaultValue={editingRequest.descricao} required />
                </label>
                <div className="modal-buttons field full">
                  <button className="button secondary" type="button" onClick={() => setEditingRequest(null)} disabled={savingEdit}>
                    Cancelar
                  </button>
                  <button className="button" type="submit" disabled={savingEdit}>
                    {savingEdit ? "Salvando..." : "Salvar alterações"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

