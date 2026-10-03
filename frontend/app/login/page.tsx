"use client";

import { FormEvent, useState } from "react";
import { login, registerClient } from "@/src/lib/api";
import { Brand } from "@/src/components/Brand";
import { ThemeToggle } from "@/src/components/ThemeToggle";

export default function LoginPage() {
  const [cadastro, setCadastro] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("admin@imperium.com");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      const result = cadastro
        ? await registerClient(nome, email, senha)
        : await login(email, senha);
      localStorage.setItem("imperium_token", result.accessToken);
      localStorage.setItem("imperium_user", JSON.stringify(result.user));
      window.location.href = result.user.role === "admin" ? "/imoveis" : "/cliente";
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
        <div className="login-header">
          <a className="brand" href="/">
            <Brand />
          </a>
          <ThemeToggle />
        </div>
        <h1>{cadastro ? "Criar conta de cliente" : "Entrar na conta"}</h1>
        <p className="eyebrow">Acesso para clientes e equipe</p>
        {cadastro && (
          <div className="field">
            <label htmlFor="nome">Nome</label>
            <input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
        )}
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
          {carregando ? "Aguarde..." : cadastro ? "Criar conta" : "Entrar"}
        </button>
        <button className="text-link" type="button" onClick={() => setCadastro((value) => !value)}>
          {cadastro ? "Já tenho uma conta" : "Criar conta de cliente"}
        </button>
        <a className="back-home" href="/">
          ← Voltar ao início
        </a>
      </form>
    </main>
  );
}
