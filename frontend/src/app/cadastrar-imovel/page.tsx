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
          <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b">
              <h1 className="text-2xl font-semibold">Cadastrar imóvel</h1>
              <p className="text-sm text-gray-600">Os anúncios enviados ficarão com status <strong>PENDENTE</strong> para aprovação administrativa.</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 gap-6">
              <section>
                <h2 className="text-lg font-medium mb-3">Informações Básicas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex flex-col">
                    <span className="text-sm font-medium">Título do anúncio</span>
                    <input className="input" value={titulo} onChange={(e) => setTitulo(e.target.value)} required placeholder="Ex: Apartamento espaçoso com vista" />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-sm font-medium">Tipo</span>
                    <select className="input" value={tipo} onChange={(e) => setTipo(e.target.value)} required>
                      <option value="apartamento">Apartamento</option>
                      <option value="casa">Casa</option>
                      <option value="terreno">Terreno</option>
                      <option value="comercial">Comercial</option>
                      <option value="cobertura">Cobertura</option>
                      <option value="outro">Outro</option>
                    </select>
                  </label>
                  <label className="flex flex-col">
                    <span className="text-sm font-medium">Finalidade</span>
                    <select className="input" value={finalidade} onChange={(e) => setFinalidade(e.target.value)}>
                      <option value="venda">Venda</option>
                      <option value="locacao">Aluguel</option>
                      <option value="ambos">Ambos</option>
                    </select>
                  </label>
                  <label className="flex flex-col">
                    <span className="text-sm font-medium">Preço (R$)</span>
                    <input className="input" value={preco} onChange={(e) => setPreco(e.target.value)} required inputMode="numeric" placeholder="Ex: 350000" />
                  </label>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-medium mb-3">Detalhes do Imóvel</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex flex-col">
                    <span className="text-sm font-medium">Área (m²)</span>
                    <input className="input" value={area} onChange={(e) => setArea(e.target.value)} placeholder="Ex: 120" />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-sm font-medium">Quartos</span>
                    <input className="input" type="number" min={0} value={quartos} onChange={(e) => setQuartos(Number(e.target.value))} />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-sm font-medium">Banheiros</span>
                    <input className="input" type="number" min={0} value={banheiros} onChange={(e) => setBanheiros(Number(e.target.value))} />
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <label className="flex flex-col">
                    <span className="text-sm font-medium">Vagas de garagem</span>
                    <input className="input" type="number" min={0} value={vagas} onChange={(e) => setVagas(Number(e.target.value))} />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-sm font-medium">Endereço / Bairro</span>
                    <input className="input" value={endereco} onChange={(e) => setEndereco(e.target.value)} placeholder="Rua, número - Bairro" />
                  </label>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-medium mb-3">Descrição e Contato</h2>
                <label className="flex flex-col">
                  <span className="text-sm font-medium">Descrição completa</span>
                  <textarea className="textarea" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descreva o imóvel, diferenciais e condições" />
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <label className="flex flex-col">
                    <span className="text-sm font-medium">Nome do contato</span>
                    <input className="input" value={contatoNome} onChange={(e) => setContatoNome(e.target.value)} placeholder="Nome para contato" />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-sm font-medium">Telefone</span>
                    <input className="input" value={contatoTelefone} onChange={(e) => setContatoTelefone(e.target.value)} placeholder="(XX) XXXXX-XXXX" />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-sm font-medium">E-mail</span>
                    <input className="input" type="email" value={contatoEmail} onChange={(e) => setContatoEmail(e.target.value)} placeholder="contato@exemplo.com" />
                  </label>
                </div>
              </section>

              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={ocultarNumero} onChange={(e) => setOcultarNumero(e.target.checked)} />
                  Ocultar número exato no endereço
                </label>
                <div className="flex items-center gap-3">
                  <Link href="/" className="button secondary">Cancelar</Link>
                  <button type="submit" className="button bg-primary text-white">Enviar anúncio (PENDENTE)</button>
                </div>
              </div>
            </form>
            {mensagem && <div className="p-4 border-t text-sm">{mensagem}</div>}
          </div>
        </div>
      </main>
    </>
  );
}
