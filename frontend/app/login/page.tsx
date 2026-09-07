"use client";

import { FormEvent, useState } from "react";
import { login } from "@/src/lib/api";
import { Brand } from "@/src/components/Brand";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@imperium.com");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      const result = await login(email, senha);
      localStorage.setItem("imperium_token", result.accessToken);
      window.location.href = "/imoveis";
    } catch (error) {
      setErro(
        error instanceof TypeError
          ? "Não foi possível conectar à API. Inicie o backend na porta 3000 e tente novamente."
          : error instanceof Error
            ? error.message
            : "Falha no login.",
      );
      setCarregando(false);
    }
  }

  return (
    <main className="login shell">
      <form className="panel" onSubmit={submit}>
        <a className="brand" href="/">
          <Brand />
        </a>
        <h1>Entrar no painel</h1>
        <p className="eyebrow">Área exclusiva da equipe</p>
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="field" style={{ marginTop: 16 }}>
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            minLength={6}
            required
          />
        </div>
        {erro && <p style={{ color: "#a64736" }}>{erro}</p>}
        <button
          className="button"
          style={{ width: "100%", marginTop: 22 }}
          disabled={carregando}
        >
          {carregando ? "Entrando..." : "Entrar"}
        </button>
        <a className="back-home" href="/">
          ← Voltar ao início
        </a>
      </form>
    </main>
  );
}
