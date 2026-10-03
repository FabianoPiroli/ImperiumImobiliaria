"use client";

import { useEffect, useState } from "react";
import type { CidadeIBGE, EstadoIBGE } from "./LocationFields";

interface ClientLocationFieldsProps {
  initialEstado?: string;
  initialCidade?: string;
  initialBairro?: string;
}

export function ClientLocationFields({
  initialEstado = "",
  initialCidade = "",
  initialBairro = "",
}: ClientLocationFieldsProps = {}) {
  const [estados, setEstados] = useState<EstadoIBGE[]>([]);
  const [cidades, setCidades] = useState<CidadeIBGE[]>([]);
  const [estado, setEstado] = useState(initialEstado);
  const [cidade, setCidade] = useState(initialCidade);
  const [bairro, setBairro] = useState(initialBairro);

  useEffect(() => {
    fetch("/api/ibge/estados")
      .then((response) => response.json())
      .then(setEstados)
      .catch(() => setEstados([]));
  }, []);

  useEffect(() => {
    if (!estado) {
      setCidades([]);
      setCidade("");
      return;
    }
    fetch(`/api/ibge/estados/${estado}/municipios`)
      .then((response) => response.json())
      .then((data) => {
        setCidades(data);
        if (initialCidade && estado === initialEstado) {
          setCidade(initialCidade);
        }
      })
      .catch(() => setCidades([]));
  }, [estado, initialCidade, initialEstado]);

  return (
    <>
      <label className="field">
        <span>Estado</span>
        <select
          name="estado"
          value={estado}
          onChange={(event) => {
            setEstado(event.target.value);
            setCidade("");
          }}
          required
        >
          <option value="">Selecione</option>
          {estados.map((item) => (
            <option key={item.sigla} value={item.sigla}>
              {item.nome} ({item.sigla})
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Cidade</span>
        <select
          name="cidade"
          value={cidade}
          onChange={(event) => setCidade(event.target.value)}
          required
          disabled={!estado || !cidades.length}
        >
          <option value="">{estado ? "Selecione" : "Escolha o estado"}</option>
          {cidades.map((item) => (
            <option key={item.id} value={item.nome}>
              {item.nome}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Bairro</span>
        <input
          name="bairro"
          value={bairro}
          onChange={(e) => setBairro(e.target.value)}
          placeholder="Ex.: Centro"
        />
      </label>
    </>
  );
}
