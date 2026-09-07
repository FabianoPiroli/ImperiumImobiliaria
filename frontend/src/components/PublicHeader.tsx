import { Brand } from "./Brand";

export function PublicHeader() {
  return (
    <header className="public-header">
      <a className="brand" href="/">
        <Brand />
      </a>
      <nav className="public-nav" aria-label="Navegação principal">
        <a href="/">Início</a>
        <a href="/sobre">Sobre</a>
        <details className="nav-dropdown">
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
        <details className="nav-dropdown">
          <summary>Alugar</summary>
          <div className="dropdown-menu">
            <a href="/alugar?tipo=apartamento">Apartamento</a>
            <a href="/alugar?tipo=casa">Casa</a>
            <a href="/alugar">Todos os imóveis</a>
          </div>
        </details>
        <details className="nav-dropdown">
          <summary>Contato</summary>
          <div className="dropdown-menu dropdown-menu-right">
            <a href="/contato">Fale conosco</a>
            <a href="https://wa.me/5511999999999">WhatsApp</a>
            <a href="mailto:contato@imperiumimobiliaria.com.br">E-mail</a>
          </div>
        </details>
      </nav>
      <a className="button secondary admin-button" href="/login">
        Acesso administrativo
      </a>
    </header>
  );
}
