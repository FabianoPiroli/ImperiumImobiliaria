"use client";

import { useEffect, useState } from "react";

type SessionUser = { nome: string; role: string };

export function ClientAccess() {
  const [user, setUser] = useState<SessionUser | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("imperium_token");
    const saved = localStorage.getItem("imperium_user");
    if (token && saved) setUser(JSON.parse(saved));
  }, []);
  if (!user || user.role !== "cliente") {
    return (
      <a className="button secondary admin-button" href="/login">
        Entrar ou criar conta
      </a>
    );
  }
  return (
    <div className="client-access">
      <a className="client-name" href="/cliente">
        Olá, {user.nome.split(" ")[0]}
      </a>
      <button
        className="button secondary"
        type="button"
        onClick={() => {
          localStorage.removeItem("imperium_token");
          localStorage.removeItem("imperium_user");
          window.location.reload();
        }}
      >
        Sair
      </button>
    </div>
  );
}
