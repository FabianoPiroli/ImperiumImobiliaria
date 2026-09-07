"use client";
import { FormEvent } from "react";

export function PropertySearch() {
  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const negociacao = String(data.get("negociacao"));
    const params = new URLSearchParams();
    ["tipo", "precoMax", "estado", "cidade", "bairro"].forEach((field) => {
      const value = String(data.get(field) ?? "").trim();
      if (value) params.set(field, value);
    });
    window.location.href = `/${negociacao}${params.toString() ? `?${params}` : ""}`;
  }
  return (
    <form className="property-search" onSubmit={search}>
      <div className="search-heading">
        <span className="eyebrow">Encontre seu imóvel</span>
        <h2>O próximo endereço começa aqui.</h2>
      </div>
      <div className="search-fields">
        <label className="field">
          <span>Tipo de negociação</span>
          <select name="negociacao" defaultValue="comprar">
            <option value="comprar">Comprar</option>
            <option value="alugar">Alugar</option>
          </select>
        </label>
        <label className="field">
          <span>Tipo do imóvel</span>
          <select name="tipo" defaultValue="">
            <option value="">Todos os tipos</option>
            <option value="apartamento">Apartamento</option>
            <option value="casa">Casa</option>
            <option value="comercial">Prédio comercial</option>
            <option value="terreno">Terreno / lote</option>
            <option value="rural">
              Terreno rural / sítio / fazenda / chácara
            </option>
          </select>
        </label>
        <label className="field">
          <span>Preço máximo</span>
          <input
            name="precoMax"
            type="number"
            min="0"
            placeholder="R$ máximo"
          />
        </label>
        <label className="field">
          <span>Estado</span>
          <select name="estado" defaultValue="">
            <option value="">Todos os estados</option>
            <option value="SC">Santa Catarina</option>
            <option value="PR">Paraná</option>
            <option value="RS">Rio Grande do Sul</option>
            <option value="SP">São Paulo</option>
          </select>
        </label>
        <label className="field">
          <span>Cidade</span>
          <input name="cidade" placeholder="Ex.: Videira" />
        </label>
        <label className="field">
          <span>Bairro</span>
          <input name="bairro" placeholder="Ex.: Centro" />
        </label>
      </div>
      <button className="button" type="submit">
        Buscar imóveis
      </button>
    </form>
  );
}
