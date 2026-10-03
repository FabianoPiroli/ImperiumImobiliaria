"use client";
import { useState } from "react";
import Link from "next/link";
import { createImovel } from "@/src/lib/api";
import { PublicHeader } from "@/src/components/PublicHeader";

export default function CadastrarImovelPage() {
  const [titulo, setTitulo] = useState("");
  const [preco, setPreco] = useState("");
  const [tipo, setTipo] = useState("apartamento");
  const [finalidade, setFinalidade] = useState("venda");
  const [area, setArea] = useState("");
  const [quartos, setQuartos] = useState(1);
  const [banheiros, setBanheiros] = useState(1);
  const [vagas, setVagas] = useState(0);
  const [descricao, setDescricao] = useState("");
  const [contatoNome, setContatoNome] = useState("");
  const [contatoTelefone, setContatoTelefone] = useState("");
  const [contatoEmail, setContatoEmail] = useState("");
  const [ocultarNumero, setOcultarNumero] = useState(false);
  const [mensagem, setMensagem] = useState("");

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
        descricao: descricaoComContato,
        tipo,
        finalidade,
        preco: Number(preco || 0),
        quartos: Number(quartos || 0),
        banheiros: Number(banheiros || 0),
        vagasGaragem: Number(vagas || 0),
        ocultarNumeroExato: Boolean(ocultarNumero),
        status: "PENDENTE",
      } as any);

      setMensagem("Anúncio enviado com sucesso! Status: PENDENTE para aprovação.");
      setTitulo("");
      setPreco("");
      setDescricao("");
      setContatoNome("");
      setContatoTelefone("");
      setContatoEmail("");
    } catch (err: any) {
      setMensagem(err?.message ?? "Erro ao enviar o anúncio.");
    }
  }

  return (
    <div style={{ backgroundColor: "#f1f5f9", minHeight: "100vh", color: "#0f172a", fontFamily: "sans-serif" }}>
      <style>{`
        .custom-input {
          border: 2px solid #64748b !important;
          background-color: #ffffff !important;
          color: #0f172a !important;
          border-radius: 6px !important;
          padding: 10px 12px !important;
          width: 100% !important;
          display: block !important;
          font-size: 14px !important;
          box-sizing: border-box !important;
        }
        .custom-input:focus {
          border-color: #047857 !important;
          outline: none !important;
        }
        .custom-card {
          background-color: #ffffff !important;
          border: 1px solid #cbd5e1 !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
          border-radius: 12px !important;
          padding: 32px !important;
          max-width: 800px !important;
          margin: 40px auto !important;
        }
      `}</style>
      <PublicHeader />
      <main style={{ padding: "20px" }}>
        <div className="custom-card">
          <div style={{ marginBottom: "24px", borderBottom: "1px solid #e2e8f0", paddingBottom: "16px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 8px 0" }}>Cadastrar imóvel</h1>
            <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
              Os anúncios enviados ficarão com status <strong style={{ color: "#b45309" }}>PENDENTE</strong> para aprovação administrativa.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "6px" }}>Título do anúncio *</label>
              <input value={titulo} onChange={(e) => setTitulo(e.target.value)} required placeholder="Ex: Apartamento amplo no Centro" className="custom-input" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "6px" }}>Preço (R$) *</label>
                <input value={preco} onChange={(e) => setPreco(e.target.value)} required placeholder="Ex: 350000" className="custom-input" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "6px" }}>Tipo</label>
                <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="custom-input">
                  <option value="apartamento">Apartamento</option>
                  <option value="casa">Casa</option>
                  <option value="terreno">Terreno</option>
                  <option value="comercial">Comercial</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "6px" }}>Finalidade</label>
                <select value={finalidade} onChange={(e) => setFinalidade(e.target.value)} className="custom-input">
                  <option value="venda">Venda</option>
                  <option value="locacao">Aluguel</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "6px" }}>Área (m²)</label>
                <input value={area} onChange={(e) => setArea(e.target.value)} placeholder="120" className="custom-input" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "6px" }}>Quartos</label>
                <input type="number" value={quartos} onChange={(e) => setQuartos(Number(e.target.value))} className="custom-input" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "6px" }}>Banheiros</label>
                <input type="number" value={banheiros} onChange={(e) => setBanheiros(Number(e.target.value))} className="custom-input" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "6px" }}>Vagas</label>
                <input type="number" value={vagas} onChange={(e) => setVagas(Number(e.target.value))} className="custom-input" />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "6px" }}>Descrição</label>
              <textarea rows={4} value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Detalhes do imóvel..." className="custom-input" />
            </div>

            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "16px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", marginBottom: "12px", color: "#334155" }}>Dados de Contato</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                <input value={contatoNome} onChange={(e) => setContatoNome(e.target.value)} placeholder="Nome" className="custom-input" />
                <input value={contatoTelefone} onChange={(e) => setContatoTelefone(e.target.value)} placeholder="Telefone" className="custom-input" />
                <input type="email" value={contatoEmail} onChange={(e) => setContatoEmail(e.target.value)} placeholder="E-mail" className="custom-input" />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #e2e8f0", paddingTop: "16px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", cursor: "pointer" }}>
                <input type="checkbox" checked={ocultarNumero} onChange={(e) => setOcultarNumero(e.target.checked)} />
                Ocultar número exato
              </label>
              <div style={{ display: "flex", gap: "12px" }}>
                <Link href="/" style={{ padding: "10px 16px", border: "1px solid #cbd5e1", borderRadius: "6px", textDecoration: "none", color: "#334155", fontSize: "14px" }}>Cancelar</Link>
                <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#047857", color: "#ffffff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "14px" }}>Enviar anúncio</button>
              </div>
            </div>
          </form>

          {mensagem && <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#d1fae5", color: "#065f46", borderRadius: "6px", fontSize: "14px" }}>{mensagem}</div>}
        </div>
      </main>
    </div>
  );
}