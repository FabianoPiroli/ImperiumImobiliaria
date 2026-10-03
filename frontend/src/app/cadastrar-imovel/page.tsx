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

  const fieldStyle = {
    border: "2px solid #94a3b8",
    borderRadius: "8px",
    padding: "10px 12px",
    backgroundColor: "#ffffff",
    color: "#0f172a",
    width: "100%",
    display: "block",
    boxSizing: "border-box" as const,
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <PublicHeader />
      <main className="py-10 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-300 p-8">
          <div className="mb-8 border-b pb-4">
            <h1 className="text-3xl font-bold text-slate-900">Cadastrar imóvel</h1>
            <p className="text-sm text-slate-600 mt-1">
              Os anúncios enviados ficarão com status <strong className="text-amber-700">PENDENTE</strong> para aprovação.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">Título do anúncio</label>
              <input value={titulo} onChange={(e) => setTitulo(e.target.value)} required placeholder="Ex: Apartamento amplo" style={fieldStyle} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">Preço (R$)</label>
                <input style={fieldStyle} value={preco} onChange={(e) => setPreco(e.target.value)} required placeholder="Ex: 350000" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">Tipo</label>
                <select style={fieldStyle} value={tipo} onChange={(e) => setTipo(e.target.value)}>
                  <option value="apartamento">Apartamento</option>
                  <option value="casa">Casa</option>
                  <option value="terreno">Terreno</option>
                  <option value="comercial">Comercial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">Finalidade</label>
                <select style={fieldStyle} value={finalidade} onChange={(e) => setFinalidade(e.target.value)}>
                  <option value="venda">Venda</option>
                  <option value="locacao">Aluguel</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">Área (m²)</label>
                <input style={fieldStyle} value={area} onChange={(e) => setArea(e.target.value)} placeholder="120" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">Quartos</label>
                <input type="number" style={fieldStyle} value={quartos} onChange={(e) => setQuartos(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">Banheiros</label>
                <input type="number" style={fieldStyle} value={banheiros} onChange={(e) => setBanheiros(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">Vagas</label>
                <input type="number" style={fieldStyle} value={vagas} onChange={(e) => setVagas(Number(e.target.value))} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">Descrição</label>
              <textarea rows={4} style={fieldStyle} value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Detalhes do imóvel..." />
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase">Contato</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input style={fieldStyle} value={contatoNome} onChange={(e) => setContatoNome(e.target.value)} placeholder="Nome" />
                <input style={fieldStyle} value={contatoTelefone} onChange={(e) => setContatoTelefone(e.target.value)} placeholder="Telefone" />
                <input style={fieldStyle} type="email" value={contatoEmail} onChange={(e) => setContatoEmail(e.target.value)} placeholder="E-mail" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={ocultarNumero} onChange={(e) => setOcultarNumero(e.target.checked)} className="h-4 w-4" />
                Ocultar número exato
              </label>
              <div className="flex gap-3">
                <Link href="/" className="px-4 py-2 border rounded-lg text-slate-700">Cancelar</Link>
                <button type="submit" className="bg-emerald-700 text-white font-bold px-6 py-2 rounded-lg">Enviar Anúncio</button>
              </div>
            </div>
          </form>

          {mensagem && <div className="mt-4 p-3 bg-emerald-100 text-emerald-800 rounded-lg">{mensagem}</div>}
        </div>
      </main>
    </div>
  );
}
EOFcat << 'EOF' > src/app/cadastrar-imovel/page.tsx
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

  const fieldStyle = {
    border: "2px solid #94a3b8",
    borderRadius: "8px",
    padding: "10px 12px",
    backgroundColor: "#ffffff",
    color: "#0f172a",
    width: "100%",
    display: "block",
    boxSizing: "border-box" as const,
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <PublicHeader />
      <main className="py-10 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-300 p-8">
          <div className="mb-8 border-b pb-4">
            <h1 className="text-3xl font-bold text-slate-900">Cadastrar imóvel</h1>
            <p className="text-sm text-slate-600 mt-1">
              Os anúncios enviados ficarão com status <strong className="text-amber-700">PENDENTE</strong> para aprovação.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">Título do anúncio</label>
              <input value={titulo} onChange={(e) => setTitulo(e.target.value)} required placeholder="Ex: Apartamento amplo" style={fieldStyle} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">Preço (R$)</label>
                <input style={fieldStyle} value={preco} onChange={(e) => setPreco(e.target.value)} required placeholder="Ex: 350000" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">Tipo</label>
                <select style={fieldStyle} value={tipo} onChange={(e) => setTipo(e.target.value)}>
                  <option value="apartamento">Apartamento</option>
                  <option value="casa">Casa</option>
                  <option value="terreno">Terreno</option>
                  <option value="comercial">Comercial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">Finalidade</label>
                <select style={fieldStyle} value={finalidade} onChange={(e) => setFinalidade(e.target.value)}>
                  <option value="venda">Venda</option>
                  <option value="locacao">Aluguel</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">Área (m²)</label>
                <input style={fieldStyle} value={area} onChange={(e) => setArea(e.target.value)} placeholder="120" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">Quartos</label>
                <input type="number" style={fieldStyle} value={quartos} onChange={(e) => setQuartos(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">Banheiros</label>
                <input type="number" style={fieldStyle} value={banheiros} onChange={(e) => setBanheiros(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">Vagas</label>
                <input type="number" style={fieldStyle} value={vagas} onChange={(e) => setVagas(Number(e.target.value))} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">Descrição</label>
              <textarea rows={4} style={fieldStyle} value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Detalhes do imóvel..." />
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase">Contato</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input style={fieldStyle} value={contatoNome} onChange={(e) => setContatoNome(e.target.value)} placeholder="Nome" />
                <input style={fieldStyle} value={contatoTelefone} onChange={(e) => setContatoTelefone(e.target.value)} placeholder="Telefone" />
                <input style={fieldStyle} type="email" value={contatoEmail} onChange={(e) => setContatoEmail(e.target.value)} placeholder="E-mail" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={ocultarNumero} onChange={(e) => setOcultarNumero(e.target.checked)} className="h-4 w-4" />
                Ocultar número exato
              </label>
              <div className="flex gap-3">
                <Link href="/" className="px-4 py-2 border rounded-lg text-slate-700">Cancelar</Link>
                <button type="submit" className="bg-emerald-700 text-white font-bold px-6 py-2 rounded-lg">Enviar Anúncio</button>
              </div>
            </div>
          </form>

          {mensagem && <div className="mt-4 p-3 bg-emerald-100 text-emerald-800 rounded-lg">{mensagem}</div>}
        </div>
      </main>
    </div>
  );
}
EOFcat << 'EOF' > src/app/cadastrar-imovel/page.tsx
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

  const fieldStyle = {
    border: "2px solid #94a3b8",
    borderRadius: "8px",
    padding: "10px 12px",
    backgroundColor: "#ffffff",
    color: "#0f172a",
    width: "100%",
    display: "block",
    boxSizing: "border-box" as const,
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <PublicHeader />
      <main className="py-10 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-300 p-8">
          <div className="mb-8 border-b pb-4">
            <h1 className="text-3xl font-bold text-slate-900">Cadastrar imóvel</h1>
            <p className="text-sm text-slate-600 mt-1">
              Os anúncios enviados ficarão com status <strong className="text-amber-700">PENDENTE</strong> para aprovação.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">Título do anúncio</label>
              <input value={titulo} onChange={(e) => setTitulo(e.target.value)} required placeholder="Ex: Apartamento amplo" style={fieldStyle} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">Preço (R$)</label>
                <input style={fieldStyle} value={preco} onChange={(e) => setPreco(e.target.value)} required placeholder="Ex: 350000" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">Tipo</label>
                <select style={fieldStyle} value={tipo} onChange={(e) => setTipo(e.target.value)}>
                  <option value="apartamento">Apartamento</option>
                  <option value="casa">Casa</option>
                  <option value="terreno">Terreno</option>
                  <option value="comercial">Comercial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">Finalidade</label>
                <select style={fieldStyle} value={finalidade} onChange={(e) => setFinalidade(e.target.value)}>
                  <option value="venda">Venda</option>
                  <option value="locacao">Aluguel</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">Área (m²)</label>
                <input style={fieldStyle} value={area} onChange={(e) => setArea(e.target.value)} placeholder="120" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">Quartos</label>
                <input type="number" style={fieldStyle} value={quartos} onChange={(e) => setQuartos(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">Banheiros</label>
                <input type="number" style={fieldStyle} value={banheiros} onChange={(e) => setBanheiros(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">Vagas</label>
                <input type="number" style={fieldStyle} value={vagas} onChange={(e) => setVagas(Number(e.target.value))} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">Descrição</label>
              <textarea rows={4} style={fieldStyle} value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Detalhes do imóvel..." />
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase">Contato</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input style={fieldStyle} value={contatoNome} onChange={(e) => setContatoNome(e.target.value)} placeholder="Nome" />
                <input style={fieldStyle} value={contatoTelefone} onChange={(e) => setContatoTelefone(e.target.value)} placeholder="Telefone" />
                <input style={fieldStyle} type="email" value={contatoEmail} onChange={(e) => setContatoEmail(e.target.value)} placeholder="E-mail" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={ocultarNumero} onChange={(e) => setOcultarNumero(e.target.checked)} className="h-4 w-4" />
                Ocultar número exato
              </label>
              <div className="flex gap-3">
                <Link href="/" className="px-4 py-2 border rounded-lg text-slate-700">Cancelar</Link>
                <button type="submit" className="bg-emerald-700 text-white font-bold px-6 py-2 rounded-lg">Enviar Anúncio</button>
              </div>
            </div>
          </form>

          {mensagem && <div className="mt-4 p-3 bg-emerald-100 text-emerald-800 rounded-lg">{mensagem}</div>}
        </div>
      </main>
    </div>
  );
}
