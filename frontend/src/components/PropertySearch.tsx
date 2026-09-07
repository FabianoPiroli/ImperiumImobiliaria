"use client";

import { FormEvent, useEffect, useState } from "react";
import { EstadoIBGE, CidadeIBGE } from "./LocationFields";

export function PropertySearch() {
  const [estados, setEstados] = useState<EstadoIBGE[]>([]);
  const [cidades, setCidades] = useState<CidadeIBGE[]>([]);
  const [estadoSel, setEstadoSel] = useState("");

  // Carregar Estados do IBGE
  useEffect(() => {
    let active = true;
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
      .then((res) => res.json())
      .then((data: EstadoIBGE[]) => {
        if (active) setEstados(data);
      })
      .catch((err) => console.error("Erro ao buscar estados na busca:", err));
    return () => {
      active = false;
    };
  }, []);

  // Carregar Cidades do IBGE conforme Estado selecionado
  useEffect(() => {
    if (!estadoSel) {
      setCidades([]);
      return;
    }
    let active = true;
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSel}/municipios`)
      .then((res) => res.json())
      .then((data: CidadeIBGE[]) => {
        if (active) setCidades(data);
      })
      .catch((err) => console.error("Erro ao buscar cidades na busca:", err));
    return () => {
      active = false;
    };
  }, [estadoSel]);

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
          <select
            name="estado"
            value={estadoSel}
            onChange={(e) => setEstadoSel(e.target.value)}
          >
            <option value="">Todos os estados</option>
            {estados.map((uf) => (
              <option key={uf.sigla} value={uf.sigla}>
                {uf.nome} ({uf.sigla})
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Cidade</span>
          <select name="cidade" defaultValue="">
            <option value="">Todas as cidades</option>
            {cidades.map((cidade) => (
              <option key={cidade.id} value={cidade.nome}>
                {cidade.nome}
              </option>
            ))}
          </select>
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
