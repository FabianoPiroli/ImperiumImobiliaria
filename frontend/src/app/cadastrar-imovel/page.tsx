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
  const [endereco, setEndereco] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("SC");
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

  // Estilo inline garantido para assegurar que as caixas fiquem visíveis mesmo sem o Tailwind
  const inputStyle = {
    border: "1.5px solid #cbd5e1",
    borderRadius: "8px",
    padding: "10px 14px",
    backgroundColor: "#ffffff",
    color: "#0f172a",
    outline: "none",
    width: "100%",
    display: "block",
    boxSizing: "border-box" as const,
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <PublicHeader />
      <main className="py-10 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-10">
          <div className="mb-8 border-b border-slate-100 pb-5">
            <h1 className="text-2xl font-bold text-slate-900">Cadastrar imóvel</h1>
            <p className="text-sm text-slate-500 mt-1">
              Os anúncios enviados ficarão com status{" "}
              <span className="font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                PENDENTE
              </span>{" "}
              para aprovação administrativa.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Linha 1: Título */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Título do anúncio *
              </label>
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                placeholder="Ex: Apartamento espaçoso com vista para o mar"
                style={inputStyle}
              />
            </div>

            {/* Linha 2: Preço, Tipo, Finalidade */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Preço (R$) *
                </label>
                <input
                  style={inputStyle}
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  required
                  inputMode="numeric"
                  placeholder="Ex: 350000"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tipo
                </label>
                <select
                  style={inputStyle}
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <option value="apartamento">Apartamento</option>
                  <option value="casa">Casa</option>
                  <option value="terreno">Terreno</option>
                  <option value="comercial">Comercial</option>
                  <option value="cobertura">Cobertura</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Finalidade
                </label>
                <select
                  style={inputStyle}
                  value={finalidade}
                  onChange={(e) => setFinalidade(e.target.value)}
                >
                  <option value="venda">Venda</option>
                  <option value="locacao">Aluguel</option>
                  <option value="ambos">Ambos</option>
                </select>
              </div>
            </div>

            {/* Linha 3: Área, Quartos, Banheiros, Vagas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Área (m²)
                </label>
                <input
                  style={inputStyle}
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Ex: 120"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Quartos
                </label>
                <input
                  type="number"
                  min={0}
                  style={inputStyle}
                  value={quartos}
                  onChange={(e) => setQuartos(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Banheiros
                </label>
                <input
                  type="number"
                  min={0}
                  style={inputStyle}
                  value={banheiros}
                  onChange={(e) => setBanheiros(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Vagas
                </label>
                <input
                  type="number"
                  min={0}
                  style={inputStyle}
                  value={vagas}
                  onChange={(e) => setVagas(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Linha 4: Descrição */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Descrição completa
              </label>
              <textarea
                rows={4}
                style={inputStyle}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva os diferenciais, localização e condições do imóvel..."
              />
            </div>

            {/* Linha 5: Contato */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">
                Dados de contato (visíveis no anúncio)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Nome do contato
                  </label>
                  <input
                    style={inputStyle}
                    value={contatoNome}
                    onChange={(e) => setContatoNome(e.target.value)}
                    placeholder="Nome para contato"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Telefone
                  </label>
                  <input
                    style={inputStyle}
                    value={contatoTelefone}
                    onChange={(e) => setContatoTelefone(e.target.value)}
                    placeholder="(XX) XXXXX-XXXX"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    E-mail
                  </label>
                  <input
                    style={inputStyle}
                    type="email"
                    value={contatoEmail}
                    onChange={(e) => setContatoEmail(e.target.value)}
                    placeholder="contato@exemplo.com"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={ocultarNumero}
                  onChange={(e) => setOcultarNumero(e.target.checked)}
                  className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                Ocultar número exato no endereço
              </label>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <Link
                  href="/"
                  className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition text-sm font-medium"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 px-6 rounded-lg transition shadow-sm text-sm"
                >
                  Enviar anúncio
                </button>
              </div>
            </div>
          </form>

          {mensagem && (
            <div className="mt-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium">
              {mensagem}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}