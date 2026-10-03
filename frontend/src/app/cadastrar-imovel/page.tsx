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

      setMensagem("Anúncio enviado com sucesso. Status: PENDENTE");
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
    <>
      <PublicHeader />
      <main className="page py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white shadow-md rounded-xl p-8 max-w-3xl mx-auto my-8">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold">Cadastrar imóvel</h1>
              <p className="text-sm text-gray-600">Os anúncios enviados ficarão com status <strong>PENDENTE</strong> para aprovação administrativa.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Linha 1: Título */}
              <div>
                <label className="block text-sm font-medium mb-2">Título do anúncio</label>
                <input
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                  placeholder="Ex: Apartamento espaçoso com vista"
                  className="border border-gray-400 bg-white rounded p-2 text-black w-full block focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none"
                  style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px', background: '#fff' }}
                />
              </div>

              {/* Linha 2: Preço, Tipo, Finalidade */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Preço (R$)</label>
                  <input
                    className="border border-gray-400 bg-white rounded p-2 text-black w-full block focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none"
                    style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px', background: '#fff' }}
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    required
                    inputMode="numeric"
                    placeholder="Ex: 350000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tipo</label>
                  <select
                    className="border border-gray-400 bg-white rounded p-2 text-black w-full block focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none"
                    style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px', background: '#fff' }}
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
                  <label className="block text-sm font-medium mb-2">Finalidade</label>
                  <select
                    className="border border-gray-400 bg-white rounded p-2 text-black w-full block focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none"
                    style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px', background: '#fff' }}
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Área (m²)</label>
                  <input
                    className="border border-gray-400 bg-white rounded p-2 text-black w-full block focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none"
                    style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px', background: '#fff' }}
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="Ex: 120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Quartos</label>
                  <input
                    type="number"
                    min={0}
                    className="border border-gray-400 bg-white rounded p-2 text-black w-full block focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none"
                    style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px', background: '#fff' }}
                    value={quartos}
                    onChange={(e) => setQuartos(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Banheiros</label>
                  <input
                    type="number"
                    min={0}
                    className="border border-gray-400 bg-white rounded p-2 text-black w-full block focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none"
                    style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px', background: '#fff' }}
                    value={banheiros}
                    onChange={(e) => setBanheiros(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Vagas</label>
                  <input
                    type="number"
                    min={0}
                    className="border border-gray-400 bg-white rounded p-2 text-black w-full block focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none"
                    style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px', background: '#fff' }}
                    value={vagas}
                    onChange={(e) => setVagas(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Linha 4: Descrição */}
              <div>
                <label className="block text-sm font-medium mb-2">Descrição completa</label>
                <textarea
                  rows={4}
                  className="border border-gray-400 bg-white rounded p-2 text-black w-full block focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none"
                  style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px', background: '#fff' }}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descreva o imóvel, diferenciais e condições"
                />
              </div>

              {/* Linha 5: Contato */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome do contato</label>
                  <input className="border border-gray-400 bg-white rounded p-2 text-black w-full block focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none" style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px', background: '#fff' }} value={contatoNome} onChange={(e) => setContatoNome(e.target.value)} placeholder="Nome para contato" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Telefone</label>
                  <input className="border border-gray-400 bg-white rounded p-2 text-black w-full block focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none" style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px', background: '#fff' }} value={contatoTelefone} onChange={(e) => setContatoTelefone(e.target.value)} placeholder="(XX) XXXXX-XXXX" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">E-mail</label>
                  <input className="border border-gray-400 bg-white rounded p-2 text-black w-full block focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none" style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px', background: '#fff' }} type="email" value={contatoEmail} onChange={(e) => setContatoEmail(e.target.value)} placeholder="contato@exemplo.com" />
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={ocultarNumero} onChange={(e) => setOcultarNumero(e.target.checked)} className="h-4 w-4 text-emerald-600" />
                  Ocultar número exato no endereço
                </label>
                <div className="flex items-center gap-3">
                  <Link href="/" className="inline-block px-4 py-2 rounded-md border border-gray-200 text-sm">Cancelar</Link>
                  <button type="submit" className="bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-emerald-800 transition">Enviar anúncio (PENDENTE)</button>
                </div>
              </div>
            </form>
            {mensagem && <div className="p-4 border-t text-sm mt-4">{mensagem}</div>}
          </div>
        </div>
      </main>
    </>
  );
}
