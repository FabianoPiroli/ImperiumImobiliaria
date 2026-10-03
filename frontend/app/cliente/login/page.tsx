"use client";

import { FormEvent, useState } from "react";
import { Brand } from "@/src/components/Brand";
import { ThemeToggle } from "@/src/components/ThemeToggle";
import { login, registerClient } from "@/src/lib/api";

export default function ClienteLoginPage() {
  const [cadastro, setCadastro] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      const result = cadastro ? await registerClient(nome, email, senha) : await login(email, senha);
      localStorage.setItem("imperium_token", result.accessToken);
      localStorage.setItem("imperium_user", JSON.stringify(result.user));
      window.location.href = "/cliente";
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível entrar.");
      setCarregando(false);
    }
  }

  return (
    <main className="login shell">
      <form className="panel" onSubmit={submit}>
        <div className="login-header"><a className="brand" href="/"><Brand /></a><ThemeToggle /></div>
        <p className="eyebrow">Área do cliente</p>
        <h1>{cadastro ? "Criar sua conta" : "Entrar na sua conta"}</h1>
        {cadastro && <div className="field"><label htmlFor="nome">Nome</label><input id="nome" value={nome} onChange={(event) => setNome(event.target.value)} required /></div>}
        <div className="field"><label htmlFor="cliente-email">E-mail</label><input id="cliente-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
        <div className="field"><label htmlFor="cliente-senha">Senha</label><input id="cliente-senha" type="password" minLength={6} value={senha} onChange={(event) => setSenha(event.target.value)} required /></div>
        {erro && <p style={{ color: "#a64736" }}>{erro}</p>}
        <button className="button" style={{ width: "100%", marginTop: 22 }} disabled={carregando}>{carregando ? "Aguarde..." : cadastro ? "Criar conta" : "Entrar"}</button>
        <button className="text-link" type="button" onClick={() => setCadastro((value) => !value)}>{cadastro ? "Já tenho uma conta" : "Ainda não tenho conta"}</button>
        <a className="back-home" href="/">Voltar ao início</a>
      </form>
    </main>
  );
}