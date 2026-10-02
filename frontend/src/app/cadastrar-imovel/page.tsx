"use client";
import { useState } from "react";
import { createImovel } from "@/src/lib/api";
import Link from "next/link";
import { PublicHeader } from "@/src/components/PublicHeader";

export default function CadastrarImovelPage() {
  const [titulo, setTitulo] = useState("");
  const [preco, setPreco] = useState("");
  const [tipo, setTipo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [finalidade, setFinalidade] = useState("venda");
  const [estado, setEstado] = useState("SC");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [endereco, setEndereco] = useState("");
  const [quartos, setQuartos] = useState(1);
  const [banheiros, setBanheiros] = useState(1);
  const [vagas, setVagas] = useState(0);
  const [ocultarNumero, setOcultarNumero] = useState(false);
  const [mensagem, setMensagem] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMensagem("");
    try {
      await createImovel({
        titulo,
        descricao,
        tipo,
        finalidade,
        estado,
        cidade,
        bairro,
        endereco,
        preco: Number(preco || 0),
        quartos: Number(quartos || 0),
        banheiros: Number(banheiros || 0),
        vagasGaragem: Number(vagas || 0),
        ocultarNumeroExato: Boolean(ocultarNumero),
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
        <p>Os anúncios enviados ficarão com status <strong>PENDENTE</strong> para aprovação administrativa.</p>
        <form onSubmit={handleSubmit} className="panel">
          <label>
            Título
            <input value={titulo} onChange={(e) => setTitulo(e.target.value)} required placeholder="Ex: Apartamento espaçoso" />
          </label>
          <label>
            Preço (R$)
            <input value={preco} onChange={(e) => setPreco(e.target.value)} required inputMode="numeric" placeholder="Ex: 350000" />
          </label>
          <label>
            Finalidade
            <select value={finalidade} onChange={(e) => setFinalidade(e.target.value)}>
              <option value="venda">Venda</option>
              <option value="aluguel">Aluguel</option>
            </select>
          </label>
          <label>
            Tipo
            <input value={tipo} onChange={(e) => setTipo(e.target.value)} required placeholder="Ex: Apartamento, Casa" />
          </label>
          <label>
            Estado
            <input value={estado} onChange={(e) => setEstado(e.target.value)} required />
          </label>
          <label>
            Cidade
            <input value={cidade} onChange={(e) => setCidade(e.target.value)} required />
          </label>
          <label>
            Bairro
            <input value={bairro} onChange={(e) => setBairro(e.target.value)} />
          </label>
          <label>
            Endereço (rua, número)
            <input value={endereco} onChange={(e) => setEndereco(e.target.value)} required placeholder="Ex: Rua das Flores, 123" />
          </label>
          <div style={{ display: "flex", gap: 12 }}>
            <label style={{ flex: 1 }}>
              Quartos
              <input type="number" min={0} value={quartos} onChange={(e) => setQuartos(Number(e.target.value))} required />
            </label>
            <label style={{ flex: 1 }}>
              Banheiros
              <input type="number" min={0} value={banheiros} onChange={(e) => setBanheiros(Number(e.target.value))} required />
            </label>
            <label style={{ flex: 1 }}>
              Vagas
              <input type="number" min={0} value={vagas} onChange={(e) => setVagas(Number(e.target.value))} />
            </label>
          </div>
          <label>
            Descrição
            <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Breve descrição do imóvel e pontos de destaque" />
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={ocultarNumero} onChange={(e) => setOcultarNumero(e.target.checked)} />
            Ocultar número exato no endereço
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
