"use client";

import { useEffect, useRef } from "react";
import { Brand } from "./Brand";
import { ThemeToggle } from "./ThemeToggle";
import { ClientAccess } from "./ClientAccess";

export function PublicHeader() {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleGlobalClick(event: MouseEvent) {
      if (!headerRef.current) return;
      const target = event.target as Node;
      if (!headerRef.current.contains(target)) {
        const openDetails =
          headerRef.current.querySelectorAll<HTMLDetailsElement>(
            "details[open]",
          );
        openDetails.forEach((detail) => detail.removeAttribute("open"));
      }
    }

    function handleToggle(event: Event) {
      const targetDetail = event.target as HTMLDetailsElement;
      if (targetDetail.open && headerRef.current) {
        const allDetails =
          headerRef.current.querySelectorAll<HTMLDetailsElement>(
            "details.nav-dropdown",
          );
        allDetails.forEach((detail) => {
          if (detail !== targetDetail && detail.open) {
            detail.removeAttribute("open");
          }
        });
      }
    }

    const currentHeader = headerRef.current;
    if (currentHeader) {
      currentHeader.addEventListener("toggle", handleToggle, true);
    }
    document.addEventListener("click", handleGlobalClick);

    return () => {
      if (currentHeader) {
        currentHeader.removeEventListener("toggle", handleToggle, true);
      }
      document.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  return (
    <header className="public-header" ref={headerRef}>
      <a className="brand" href="/">
        <Brand />
      </a>
      <nav className="public-nav" aria-label="Navegação principal">
        <a href="/">Início</a>
        <a href="/sobre">Sobre</a>
        <details className="nav-dropdown" name="header-nav">
          <summary>Comprar</summary>
          <div className="dropdown-menu">
            <a href="/comprar?tipo=apartamento">Apartamento</a>
            <a href="/comprar?tipo=casa">Casa</a>
            <a href="/comprar?tipo=comercial">Prédio comercial</a>
            <a href="/comprar?tipo=terreno">Terreno / lote</a>
            <a href="/comprar?tipo=rural">
              Terreno rural / sítio / fazenda / chácara
            </a>
            <a href="/comprar">Ver todos</a>
          </div>
        </details>
        <details className="nav-dropdown" name="header-nav">
          <summary>Alugar</summary>
          <div className="dropdown-menu">
            <a href="/alugar?tipo=apartamento">Apartamento</a>
            <a href="/alugar?tipo=casa">Casa</a>
            <a href="/alugar">Todos os imóveis</a>
          </div>
        </details>
        <details className="nav-dropdown" name="header-nav">
          <summary>Contato</summary>
          <div className="dropdown-menu dropdown-menu-right">
            <a href="/contato">Fale conosco</a>
            <a href="https://wa.me/5511999999999">WhatsApp</a>
            <a href="mailto:contato@imperiumimobiliaria.com.br">E-mail</a>
          </div>
        </details>
      </nav>
      <ThemeToggle />
      <ClientAccess />
    </header>
  );
}
