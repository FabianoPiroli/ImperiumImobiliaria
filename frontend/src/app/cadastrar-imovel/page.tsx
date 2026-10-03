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
        status: "pendente",
      } as any);

      setMensagem("Anúncio enviado com sucesso! Aguardando aprovação.");
      setTitulo("");
      setPreco("");
      setArea("");
      setEndereco("");
      setBairro("");
      setCidade("");
      setDescricao("");
      setContatoNome("");
      setContatoTelefone("");
      setContatoEmail("");
    } catch (err: any) {
      setMensagem(err?.message ?? "Erro ao enviar o anúncio.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <PublicHeader />
      <main className="py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
          
          {/* Cabeçalho do Card */}
          <div className="bg-slate-950/60 p-8 border-b border-slate-700">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Cadastrar Novo Imóvel</h1>
            <p className="text-slate-400 text-sm mt-2 flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              Os anúncios enviados passarão por aprovação administrativa (Status: <strong className="text-amber-400">PENDENTE</strong>).
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* Seção 1: Informações Principais */}
            <div>
              <h2 className="text-lg font-semibold text-emerald-400 mb-4 uppercase tracking-wider text-xs">1. Informações Básicas</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Título do Anúncio *</label>
                  <input
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                    placeholder="Ex: Lindo apartamento com 3 quartos no Centro"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Preço (R$) *</label>
                    <input
                      value={preco}
                      onChange={(e) => setPreco(e.target.value)}
                      required
                      inputMode="numeric"
                      placeholder="Ex: 450000"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Tipo de Imóvel</label>
                    <select
                      value={tipo}
                      onChange={(e) => setTipo(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition cursor-pointer"
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
                    <label className="block text-sm font-medium text-slate-300 mb-1">Finalidade</label>
                    <select
                      value={finalidade}
                      onChange={(e) => setFinalidade(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition cursor-pointer"
                    >
                      <option value="venda">Venda</option>
                      <option value="locacao">Aluguel</option>
                      <option value="ambos">Venda ou Aluguel</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Seção 2: Especificações */}
            <div className="pt-6 border-t border-slate-700/60">
              <h2 className="text-lg font-semibold text-emerald-400 mb-4 uppercase tracking-wider text-xs">2. Características do Imóvel</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Área (m²)</label>
                  <input
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="Ex: 85"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Quartos</label>
                  <input
                    type="number"
                    min={0}
                    value={quartos}
                    onChange={(e) => setQuartos(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Banheiros</label>
                  <input
                    type="number"
                    min={0}
                    value={banheiros}
                    onChange={(e) => setBanheiros(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Vagas</label>
                  <input
                    type="number"
                    min={0}
                    value={vagas}
                    onChange={(e) => setVagas(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Seção 3: Localização */}
            <div className="pt-6 border-t border-slate-700/60">
              <h2 className="text-lg font-semibold text-emerald-400 mb-4 uppercase tracking-wider text-xs">3. Localização</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Endereço / Rua</label>
                  <input
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    placeholder="Rua, Av., Número..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Bairro</label>
                  <input
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    placeholder="Nome do bairro"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Cidade</label>
                  <input
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    placeholder="Ex: Florianópolis"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Estado (UF)</label>
                  <input
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    maxLength={2}
                    placeholder="SC"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white uppercase placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Seção 4: Descrição e Contato */}
            <div className="pt-6 border-t border-slate-700/60">
              <h2 className="text-lg font-semibold text-emerald-400 mb-4 uppercase tracking-wider text-xs">4. Descrição & Contato</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Descrição Completa</label>
                  <textarea
                    rows={4}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Conte mais sobre os diferenciais do imóvel, condomínio, mobília, etc."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Nome do Anunciante</label>
                    <input
                      value={contatoNome}
                      onChange={(e) => setContatoNome(e.target.value)}
                      placeholder="Seu nome"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Telefone / WhatsApp</label>
                    <input
                      value={contatoTelefone}
                      onChange={(e) => setContatoTelefone(e.target.value)}
                      placeholder="(49) 99999-9999"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">E-mail</label>
                    <input
                      type="email"
                      value={contatoEmail}
                      onChange={(e) => setContatoEmail(e.target.value)}
                      placeholder="seuemail@exemplo.com"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Ações e Submit */}
            <div className="pt-6 border-t border-slate-700/60 flex flex-col md:flex-row items-center justify-between gap-4">
              <label className="flex items-center gap-3 text-sm text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ocultarNumero}
                  onChange={(e) => setOcultarNumero(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-800"
                />
                Ocultar número exato no endereço público
              </label>

              <div className="flex items-center gap-4 w-full md:w-auto">
                <Link
                  href="/"
                  className="w-1/2 md:w-auto text-center px-6 py-3 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-700 transition font-medium text-sm"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  className="w-1/2 md:w-auto px-8 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-900/30 transition"
                >
                  Enviar Anúncio
                </button>
              </div>
            </div>
          </form>

          {mensagem && (
            <div className="p-4 m-8 mt-0 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-sm text-center font-medium">
              {mensagem}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}