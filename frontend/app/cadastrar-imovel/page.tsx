"use client";
import { useState } from "react";
import { createImovel } from "@/src/lib/api";
import Link from "next/link";
import { PublicHeader } from "@/src/components/PublicHeader";

export default function CadastrarImovelAppPage() {
  const [titulo, setTitulo] = useState("");
  const [preco, setPreco] = useState("");
  const [tipo, setTipo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [mensagem, setMensagem] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMensagem("");
    try {
      await createImovel({
        titulo,
        preco: Number(preco || 0),
        tipo,
        descricao,
        status: "PENDENTE",
      });
      setMensagem("Anúncio enviado com sucesso. Status: PENDENTE");
      setTitulo("");
      setPreco("");
      setTipo("");
      setDescricao("");
    } catch (err: any) {
      setMensagem(err?.message ?? "Erro ao enviar o anúncio.");
    }
  }

  return (
    <>
      <PublicHeader />
      <main className="page">
        <div className="container">
        <h1>Cadastrar imóvel</h1>
        <p>
          Os anúncios enviados ficarão com status <strong>PENDENTE</strong> para
          aprovação administrativa.
        </p>
        <form onSubmit={handleSubmit} className="panel">
          <label>
            Título
            <input value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
          </label>
          <label>
            Preço
            <input value={preco} onChange={(e) => setPreco(e.target.value)} required inputMode="numeric" />
          </label>
          <label>
            Tipo
            <input value={tipo} onChange={(e) => setTipo(e.target.value)} required />
          </label>
          <label>
            Descrição
            <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          </label>
          <div style={{ display: "flex", gap: "12px" }}>
            <button className="button" type="submit">Enviar anúncio</button>
            <Link href="/" className="button secondary">Cancelar</Link>
          </div>
        </form>
        {mensagem && <div className="panel" role="status">{mensagem}</div>}
        </div>
      </main>
    </>
  );
}
