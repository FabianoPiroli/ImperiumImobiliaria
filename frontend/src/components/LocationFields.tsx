"use client";

import { useState, useEffect } from "react";

export interface EstadoIBGE {
  sigla: string;
  nome: string;
}

export interface CidadeIBGE {
  id: number;
  nome: string;
}

interface LocationFieldsProps {
  initialEstado?: string;
  initialCidade?: string;
  initialBairro?: string;
  initialEndereco?: string;
}

export function LocationFields({
  initialEstado = "SC",
  initialCidade = "",
  initialBairro = "",
  initialEndereco = "",
}: LocationFieldsProps) {
  const [cep, setCep] = useState("");
  const [estados, setEstados] = useState<EstadoIBGE[]>([]);
  const [cidades, setCidades] = useState<CidadeIBGE[]>([]);

  const [estado, setEstado] = useState(initialEstado);
  const [cidade, setCidade] = useState(initialCidade);
  const [bairro, setBairro] = useState(initialBairro);
  const [endereco, setEndereco] = useState(initialEndereco);

  const [buscandoCep, setBuscandoCep] = useState(false);
  const [cepMensagem, setCepMensagem] = useState("");

  // Sync initial values when editing existing property
  useEffect(() => {
    if (initialEstado) setEstado(initialEstado);
  }, [initialEstado]);

  useEffect(() => {
    if (initialCidade) setCidade(initialCidade);
  }, [initialCidade]);

  useEffect(() => {
    if (initialBairro) setBairro(initialBairro);
  }, [initialBairro]);

  useEffect(() => {
    if (initialEndereco) setEndereco(initialEndereco);
  }, [initialEndereco]);

  // Carregar Estados do IBGE
  useEffect(() => {
    let active = true;
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar estados");
        return res.json();
      })
      .then((data: EstadoIBGE[]) => {
        if (active) setEstados(data);
      })
      .catch((err) => {
        console.error("Erro ao buscar lista de estados no IBGE:", err);
      });
    return () => {
      active = false;
    };
  }, []);

  // Carregar Cidades do IBGE conforme o Estado selecionado
  useEffect(() => {
    if (!estado) {
      setCidades([]);
      return;
    }
    let active = true;
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar cidades");
        return res.json();
      })
      .then((data: CidadeIBGE[]) => {
        if (active) {
          setCidades(data);
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar cidades no IBGE:", err);
      });

    return () => {
      active = false;
    };
  }, [estado]);

  // Buscar CEP via ViaCEP
  async function buscarCep(valorCep: string) {
    const cleanCep = valorCep.replace(/\D/g, "");
    if (cleanCep.length !== 8) {
      if (cleanCep.length > 0) {
        setCepMensagem("O CEP deve conter 8 dígitos.");
      } else {
        setCepMensagem("");
      }
      return;
    }

    setBuscandoCep(true);
    setCepMensagem("");

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await res.json();

      if (data.erro) {
        setCepMensagem("CEP não encontrado.");
      } else {
        if (data.uf) setEstado(data.uf);
        if (data.localidade) setCidade(data.localidade);
        if (data.bairro) setBairro(data.bairro);
        if (data.logradouro) setEndereco(data.logradouro);
        setCepMensagem("Endereço preenchido com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      setCepMensagem("Erro ao consultar serviço de CEP.");
    } finally {
      setBuscandoCep(false);
    }
  }

  function handleCepChange(val: string) {
    setCep(val);
    const clean = val.replace(/\D/g, "");
    if (clean.length === 8) {
      buscarCep(val);
    }
  }

  return (
    <>
      <label className="field full">
        <span>
          Buscar por CEP <small>(preenchimento automático)</small>
        </span>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="00000-000"
            value={cep}
            onChange={(e) => handleCepChange(e.target.value)}
            onBlur={() => buscarCep(cep)}
            maxLength={9}
            style={{ flex: 1 }}
          />
          <button
            type="button"
            className="button secondary"
            onClick={() => buscarCep(cep)}
            disabled={buscandoCep}
            style={{ whiteSpace: "nowrap", padding: "0 16px" }}
          >
            {buscandoCep ? "Buscando..." : "Buscar CEP"}
          </button>
        </div>
        {cepMensagem && (
          <small
            style={{
              color: cepMensagem.includes("sucesso") ? "#2e7d32" : "#a64736",
              marginTop: "4px",
              display: "block",
            }}
          >
            {cepMensagem}
          </small>
        )}
      </label>

      <label className="field">
        <span>Estado</span>
        <select
          name="estado"
          value={estado}
          onChange={(e) => {
            setEstado(e.target.value);
            setCidade(""); // limpa a cidade ao trocar de estado
          }}
          required
        >
          <option value="">Selecione o estado</option>
          {estados.length > 0 ? (
            estados.map((uf) => (
              <option key={uf.sigla} value={uf.sigla}>
                {uf.nome} ({uf.sigla})
              </option>
            ))
          ) : (
            <>
              <option value="SC">Santa Catarina (SC)</option>
              <option value="PR">Paraná (PR)</option>
              <option value="RS">Rio Grande do Sul (RS)</option>
              <option value="SP">São Paulo (SP)</option>
            </>
          )}
        </select>
      </label>

      <label className="field">
        <span>Cidade</span>
        {cidades.length > 0 ? (
          <select
            name="cidade"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            required
          >
            <option value="">Selecione a cidade</option>
            {cidades.map((c) => (
              <option key={c.id} value={c.nome}>
                {c.nome}
              </option>
            ))}
          </select>
        ) : (
          <input
            name="cidade"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="Digite ou selecione a cidade"
            required
          />
        )}
      </label>

      <label className="field">
        <span>Bairro</span>
        <input
          name="bairro"
          value={bairro}
          onChange={(e) => setBairro(e.target.value)}
          placeholder="Ex.: Centro"
          required
        />
      </label>

      <label className="field full">
        <span>Endereço</span>
        <input
          name="endereco"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          placeholder="Ex.: Rua XV de Novembro, 123"
          required
        />
      </label>
    </>
  );
}
