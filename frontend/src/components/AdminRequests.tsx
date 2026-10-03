"use client";

import { useEffect, useState } from "react";
import { deleteAdminRequest, getAdminRequests, updateAdminRequest } from "@/src/lib/api";
import { Brand } from "@/src/components/Brand";
import { ThemeToggle } from "@/src/components/ThemeToggle";

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
  user: { nome: string; email: string };
};

const statuses = ["pendente", "em_avaliacao", "aprovada", "recusada"];

export function AdminRequests() {
  const [items, setItems] = useState<RequestItem[]>([]);
  const [filtro, setFiltro] = useState("todos");

  useEffect(() => {
    const savedUser = localStorage.getItem("imperium_user");
    if (!localStorage.getItem("imperium_token") || JSON.parse(savedUser ?? "null")?.role !== "admin") {
      window.location.href = "/login";
      return;
    }
    getAdminRequests().then(setItems).catch(() => setItems([]));
  }, []);

  async function changeStatus(id: number, status: string) {
    await updateAdminRequest(id, status);
    setItems((current) => current.map((item) => item.id === id ? { ...item, status } : item));
  }

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja excluir esta solicitação? Esta ação é definitiva.")) return;
    try {
      await deleteAdminRequest(id);
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Não foi possível excluir a solicitação.");
    }
  }

  const visiveis = filtro === "todos" ? items : items.filter((item) => item.status === filtro);

  return (
    <div className="shell">
      <div className="container">
        <header className="topbar">
          <a className="brand" href="/"><Brand /></a>
          <div className="admin-actions">
            <ThemeToggle />
            <a className="button secondary" href="/imoveis">Voltar aos imóveis</a>
          </div>
        </header>

        <main className="admin-requests-page">
          <div className="page-head">
            <div>
              <span className="eyebrow">Painel administrativo</span>
              <h1>Solicitações de imóveis</h1>
              <p className="admin-request-intro">Avalie, edite ou exclua os imóveis enviados pelos clientes antes de aprovar a publicação.</p>
            </div>
            <div className="admin-request-filter">
              <label htmlFor="request-status">Filtrar status</label>
              <select id="request-status" value={filtro} onChange={(event) => setFiltro(event.target.value)}>
                <option value="todos">Todas</option>
                {statuses.map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}
              </select>
            </div>
          </div>

          {!items.length ? (
            <div className="panel empty-state">
              <h2>Nenhuma solicitação recebida</h2>
              <p>Quando um cliente enviar um imóvel, ele aparecerá aqui para avaliação.</p>
            </div>
          ) : !visiveis.length ? (
            <div className="panel empty-state">
              <h2>Nenhum resultado para este status</h2>
            </div>
          ) : (
            <div className="admin-request-list">
              {visiveis.map((item) => (
                <article className="admin-request-card" key={item.id}>
                  {item.fotoUrl ? (
                    <img className="admin-request-photo" src={item.fotoUrl} alt={`Foto de ${item.titulo}`} />
                  ) : (
                    <div className="admin-request-photo admin-request-placeholder">Sem foto</div>
                  )}
                  <div className="admin-request-body">
                    <div className="admin-request-heading">
                      <div>
                        <span className="eyebrow">Solicitação #{item.id} · {new Date(item.createdAt).toLocaleDateString("pt-BR")}</span>
                        <h2>{item.titulo}</h2>
                      </div>
                      <select
                        className={`request-status status-${item.status}`}
                        value={item.status}
                        onChange={(event) => changeStatus(item.id, event.target.value)}
                        aria-label={`Status de ${item.titulo}`}
                      >
                        {statuses.map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}
                      </select>
                    </div>

                    <div className="admin-request-details">
                      <span><strong>Cliente</strong>{item.user.nome}</span>
                      <span>
                        <strong>Contato</strong>
                        <a href={`mailto:${item.contatoEmail}`}>{item.contatoEmail}</a>
                        <a href={`tel:${item.contatoTelefone}`}>{item.contatoTelefone}</a>
                      </span>
                      <span><strong>Localização</strong>{item.bairro ? `${item.bairro}, ` : ""}{item.cidade} / {item.estado}</span>
                      <span><strong>Finalidade e tipo</strong>{item.finalidade === "locacao" ? "Locação" : "Venda"} · {item.tipo}</span>
                      {item.preco && <span><strong>Preço estimado</strong>R$ {item.preco.toLocaleString("pt-BR")}</span>}
                    </div>

                    <p className="admin-request-description">{item.descricao}</p>

                    <div className="admin-request-actions">
                      <a className="button secondary" href={`/imoveis/solicitacoes/${item.id}`}>
                        Editar solicitação
                      </a>
                      <button className="button danger" type="button" onClick={() => handleDelete(item.id)}>
                        Excluir
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}