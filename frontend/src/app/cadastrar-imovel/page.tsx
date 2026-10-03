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
      setOcultarNumero(false);
    } catch (err: any) {
      setMensagem(err?.message ?? "Erro ao enviar o anúncio.");
    }
  }

  const fieldClass =
    "w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/15";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <PublicHeader />
      <main className="px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-white p-6 sm:p-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Cadastro de imóvel
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Cadastrar novo anúncio
            </h1>
            <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />
              Os anúncios enviados ficarão com status <strong className="text-amber-700">PENDENTE</strong> para aprovação administrativa.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 p-6 sm:p-8">
            <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/70 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-800">
                1. Informações básicas
              </h2>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Título do anúncio *</label>
                <input
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                  placeholder="Ex: Apartamento com 3 quartos e vista para o mar"
                  className={fieldClass}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Preço (R$) *</label>
                  <input
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    required
                    inputMode="numeric"
                    placeholder="450000"
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Tipo</label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className={fieldClass}
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
                  <label className="mb-2 block text-sm font-medium text-slate-700">Finalidade</label>
                  <select
                    value={finalidade}
                    onChange={(e) => setFinalidade(e.target.value)}
                    className={fieldClass}
                  >
                    <option value="venda">Venda</option>
                    <option value="locacao">Aluguel</option>
                    <option value="ambos">Venda ou Aluguel</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/70 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-800">
                2. Características
              </h2>

              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Área (m²)</label>
                  <input
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="85"
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Quartos</label>
                  <input
                    type="number"
                    min={0}
                    value={quartos}
                    onChange={(e) => setQuartos(Number(e.target.value))}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Banheiros</label>
                  <input
                    type="number"
                    min={0}
                    value={banheiros}
                    onChange={(e) => setBanheiros(Number(e.target.value))}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Vagas</label>
                  <input
                    type="number"
                    min={0}
                    value={vagas}
                    onChange={(e) => setVagas(Number(e.target.value))}
                    className={fieldClass}
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/70 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-800">
                3. Localização
              </h2>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">Endereço / Rua</label>
                  <input
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    placeholder="Rua, avenida ou número"
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Bairro</label>
                  <input
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    placeholder="Centro"
                    className={fieldClass}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Cidade</label>
                  <input
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    placeholder="Florianópolis"
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Estado (UF)</label>
                  <input
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    maxLength={2}
                    placeholder="SC"
                    className={fieldClass}
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/70 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-800">
                4. Descrição e contato
              </h2>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Descrição completa</label>
                <textarea
                  rows={4}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Conte os diferenciais, vagas, acabamento e mobilia."
                  className={`${fieldClass} min-h-[120px] resize-y`}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Nome do anunciante</label>
                  <input
                    value={contatoNome}
                    onChange={(e) => setContatoNome(e.target.value)}
                    placeholder="Seu nome"
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Telefone / WhatsApp</label>
                  <input
                    value={contatoTelefone}
                    onChange={(e) => setContatoTelefone(e.target.value)}
                    placeholder="(49) 99999-9999"
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">E-mail</label>
                  <input
                    type="email"
                    value={contatoEmail}
                    onChange={(e) => setContatoEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className={fieldClass}
                  />
                </div>
              </div>
            </section>

            <div className="flex flex-col gap-4 border-t border-slate-200 pt-4 md:flex-row md:items-center md:justify-between">
              <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={ocultarNumero}
                  onChange={(e) => setOcultarNumero(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 bg-white text-emerald-600 focus:ring-emerald-600"
                />
                Ocultar número exato no endereço público
              </label>

              <div className="flex w-full gap-3 md:w-auto">
                <Link
                  href="/"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 md:w-auto"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 md:w-auto"
                >
                  Enviar anúncio
                </button>
              </div>
            </div>
          </form>

          {mensagem && (
            <div className="mx-6 mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-800">
              {mensagem}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
