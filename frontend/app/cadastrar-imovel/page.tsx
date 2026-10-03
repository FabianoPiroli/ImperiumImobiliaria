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
  const [contatoNome, setContatoNome] = useState("");
  const [contatoTelefone, setContatoTelefone] = useState("");
  const [contatoEmail, setContatoEmail] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMensagem("");
    try {
      const contatoParts: string[] = [];
      if (contatoNome) contatoParts.push(`Nome: ${contatoNome}`);
      if (contatoTelefone) contatoParts.push(`Telefone: ${contatoTelefone}`);
      if (contatoEmail) contatoParts.push(`E-mail: ${contatoEmail}`);
      const descricaoComContato = contatoParts.length
        ? `${descricao}\n\nContato:\n${contatoParts.join("\n")}`
        : descricao;

      await createImovel({
        titulo,
        preco: Number(preco || 0),
        tipo,
        descricao: descricaoComContato,
        status: "PENDENTE",
      });
      setMensagem("Anúncio enviado com sucesso. Status: PENDENTE");
      setTitulo("");
      setPreco("");
      setTipo("");
      setDescricao("");
      setContatoNome("");
      setContatoTelefone("");
      setContatoEmail("");
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
          <fieldset style={{ border: "none", padding: 0 }}>
            <legend>Dados de contato (visíveis no anúncio)</legend>
            <label>
              Nome do contato
              <input value={contatoNome} onChange={(e) => setContatoNome(e.target.value)} placeholder="Nome responsável pelo contato" />
            </label>
            <label>
              Telefone
              <input value={contatoTelefone} onChange={(e) => setContatoTelefone(e.target.value)} placeholder="(XX) XXXXX-XXXX" />
            </label>
            <label>
              E-mail
              <input value={contatoEmail} onChange={(e) => setContatoEmail(e.target.value)} placeholder="contato@exemplo.com" type="email" />
            </label>
          </fieldset>
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
