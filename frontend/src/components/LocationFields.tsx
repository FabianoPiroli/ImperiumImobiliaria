"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  extrairCoordenadas,
  isShortGoogleMapsUrl,
  buscarCoordenadasNominatim,
} from "@/src/lib/geoUtils";
import { resolveMapsUrl } from "@/src/lib/api";

const PropertyMap = dynamic(() => import("./PropertyMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "300px",
        background: "#f4f1ea",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "8px",
        border: "1px dashed var(--line)",
        color: "var(--muted)",
        fontSize: "0.9rem",
      }}
    >
      Carregando mapa interativo...
    </div>
  ),
});

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
  initialLatitude?: number | null;
  initialLongitude?: number | null;
  initialOcultarNumeroExato?: boolean;
}

export function LocationFields({
  initialEstado = "SC",
  initialCidade = "",
  initialBairro = "",
  initialEndereco = "",
  initialLatitude = null,
  initialLongitude = null,
  initialOcultarNumeroExato = false,
}: LocationFieldsProps) {
  const [cep, setCep] = useState("");
  const [estados, setEstados] = useState<EstadoIBGE[]>([]);
  const [cidades, setCidades] = useState<CidadeIBGE[]>([]);

  const [estado, setEstado] = useState(initialEstado);
  const [cidade, setCidade] = useState(initialCidade);
  const [bairro, setBairro] = useState(initialBairro);
  const [endereco, setEndereco] = useState(initialEndereco);

  // Coordenadas
  const [latitude, setLatitude] = useState<number | null>(initialLatitude);
  const [longitude, setLongitude] = useState<number | null>(initialLongitude);
  const [ocultarNumeroExato, setOcultarNumeroExato] = useState(
    initialOcultarNumeroExato
  );

  // Campo inteligente de entrada do Maps / Coordenadas
  const [inputLocalizacao, setInputLocalizacao] = useState("");
  const [processandoGeo, setProcessandoGeo] = useState(false);
  const [geoMensagem, setGeoMensagem] = useState<{
    tipo: "sucesso" | "erro" | "info";
    texto: string;
  } | null>(null);

  const [buscandoCep, setBuscandoCep] = useState(false);
  const [cepMensagem, setCepMensagem] = useState("");

  // Sincronizar valores iniciais
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

  useEffect(() => {
    if (typeof initialLatitude === "number") setLatitude(initialLatitude);
  }, [initialLatitude]);

  useEffect(() => {
    if (typeof initialLongitude === "number") setLongitude(initialLongitude);
  }, [initialLongitude]);

  useEffect(() => {
    setOcultarNumeroExato(Boolean(initialOcultarNumeroExato));
  }, [initialOcultarNumeroExato]);

  // Carregar Estados do IBGE
  useEffect(() => {
    let active = true;
    fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
    )
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
    fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar cidades");
        return res.json();
      })
      .then((data: CidadeIBGE[]) => {
        if (active) setCidades(data);
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

  // Processar o campo inteligente (link do Maps ou coordenadas coladas)
  async function processarEntradaLocalizacao(textoOriginal?: string) {
    const val = (textoOriginal ?? inputLocalizacao).trim();
    if (!val) return;

    setProcessandoGeo(true);
    setGeoMensagem(null);

    // 1. Tentar extrair diretamente no cliente (coordenadas ou URL comum)
    const direto = extrairCoordenadas(val);
    if (direto) {
      setLatitude(Number(direto.lat.toFixed(6)));
      setLongitude(Number(direto.lng.toFixed(6)));
      setGeoMensagem({
        tipo: "sucesso",
        texto: `Coordenadas localizadas: ${direto.lat.toFixed(5)}, ${direto.lng.toFixed(5)}`,
      });
      setProcessandoGeo(false);
      return;
    }

    // 2. Se for link encurtado (maps.app.goo.gl), chamar o backend para resolver
    if (isShortGoogleMapsUrl(val)) {
      try {
        setGeoMensagem({
          tipo: "info",
          texto: "Resolvendo link do Google Maps...",
        });
        const coords = await resolveMapsUrl(val);
        if (coords && coords.lat && coords.lng) {
          setLatitude(Number(coords.lat.toFixed(6)));
          setLongitude(Number(coords.lng.toFixed(6)));
          setGeoMensagem({
            tipo: "sucesso",
            texto: `Coordenadas resolvidas com sucesso! (${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)})`,
          });
        } else {
          setGeoMensagem({
            tipo: "erro",
            texto: "Não foi possível extrair coordenadas deste link encurtado.",
          });
        }
      } catch (err) {
        console.error(err);
        setGeoMensagem({
          tipo: "erro",
          texto:
            err instanceof Error
              ? err.message
              : "Erro ao resolver link do Google Maps.",
        });
      } finally {
        setProcessandoGeo(false);
      }
      return;
    }

    setGeoMensagem({
      tipo: "erro",
      texto:
        "Não reconhecemos o formato. Cole coordenadas (ex: -27.59, -48.54) ou um link válido do Google Maps.",
    });
    setProcessandoGeo(false);
  }

  // Buscar coordenadas pelo endereço via OpenStreetMap / Nominatim
  async function buscarPeloEndereco() {
    if (!cidade || !endereco) {
      setGeoMensagem({
        tipo: "erro",
        texto: "Preencha ao menos a Cidade e o Endereço para buscar no mapa.",
      });
      return;
    }

    setProcessandoGeo(true);
    setGeoMensagem({
      tipo: "info",
      texto: "Buscando localização no OpenStreetMap...",
    });

    try {
      const resultado = await buscarCoordenadasNominatim({
        endereco,
        bairro,
        cidade,
        estado,
      });

      if (resultado) {
        setLatitude(Number(resultado.lat.toFixed(6)));
        setLongitude(Number(resultado.lng.toFixed(6)));
        setGeoMensagem({
          tipo: "sucesso",
          texto: "Localização encontrada pelo endereço! Ajuste o pin se necessário.",
        });
      } else {
        setGeoMensagem({
          tipo: "erro",
          texto:
            "Endereço não localizado automaticamente. Cole o link do Google Maps ou clique no mapa para marcar o ponto.",
        });
      }
    } catch (err) {
      console.error(err);
      setGeoMensagem({
        tipo: "erro",
        texto: "Erro ao consultar o serviço de mapas.",
      });
    } finally {
      setProcessandoGeo(false);
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
            setCidade("");
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
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            name="endereco"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            placeholder="Ex.: Rua XV de Novembro, 123"
            required
            style={{ flex: 1 }}
          />
          <button
            type="button"
            className="button secondary"
            onClick={buscarPeloEndereco}
            disabled={processandoGeo}
            title="Localizar endereço automaticamente no mapa"
            style={{ whiteSpace: "nowrap", padding: "0 14px", fontSize: "0.85rem" }}
          >
            {processandoGeo ? "Buscando..." : "📍 Buscar no Mapa"}
          </button>
        </div>
      </label>

      {/* SEÇÃO DE GEOLOCALIZAÇÃO E MAPA */}
      <div
        className="field full"
        style={{
          marginTop: "10px",
          padding: "16px",
          borderRadius: "8px",
          background: "#faf8f4",
          border: "1px solid var(--line)",
        }}
      >
        <div style={{ marginBottom: "12px" }}>
          <span style={{ fontWeight: 600, display: "block", marginBottom: "4px" }}>
            Localização e Coordenadas no Mapa
          </span>
          <small style={{ color: "var(--muted)" }}>
            Cole o link do Google Maps, coordenadas ou use a busca automática. Você também pode clicar e arrastar o pin no mapa abaixo.
          </small>
        </div>

        {/* Campo Inteligente: Link do Maps ou Coordenadas */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Cole aqui o link do Google Maps ou coordenadas (-27.5969, -48.5495)..."
            value={inputLocalizacao}
            onChange={(e) => {
              setInputLocalizacao(e.target.value);
              // Tenta extração automática imediata se for coordenada ou URL conhecida
              const direto = extrairCoordenadas(e.target.value);
              if (direto) {
                setLatitude(Number(direto.lat.toFixed(6)));
                setLongitude(Number(direto.lng.toFixed(6)));
                setGeoMensagem({
                  tipo: "sucesso",
                  texto: `Coordenadas identificadas: ${direto.lat.toFixed(5)}, ${direto.lng.toFixed(5)}`,
                });
              }
            }}
            onPaste={(e) => {
              const pasted = e.clipboardData.getData("text");
              processarEntradaLocalizacao(pasted);
            }}
            style={{ flex: 1 }}
          />
          <button
            type="button"
            className="button secondary"
            onClick={() => processarEntradaLocalizacao()}
            disabled={processandoGeo || !inputLocalizacao.trim()}
            style={{ whiteSpace: "nowrap" }}
          >
            {processandoGeo ? "Processando..." : "Aplicar"}
          </button>
        </div>

        {/* Mensagem de Feedback */}
        {geoMensagem && (
          <div
            style={{
              padding: "6px 10px",
              borderRadius: "4px",
              marginBottom: "10px",
              fontSize: "0.82rem",
              background:
                geoMensagem.tipo === "sucesso"
                  ? "#e8f5e9"
                  : geoMensagem.tipo === "erro"
                  ? "#ffebee"
                  : "#e3f2fd",
              color:
                geoMensagem.tipo === "sucesso"
                  ? "#2e7d32"
                  : geoMensagem.tipo === "erro"
                  ? "#c62828"
                  : "#1565c0",
            }}
          >
            {geoMensagem.texto}
          </div>
        )}

        {/* Inputs numéricos de Latitude e Longitude (submetidos no FormData) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
          <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Latitude</span>
            <input
              type="number"
              step="any"
              name="latitude"
              value={latitude !== null ? latitude : ""}
              onChange={(e) =>
                setLatitude(e.target.value ? parseFloat(e.target.value) : null)
              }
              placeholder="Ex: -27.596901"
              style={{ padding: "8px", fontSize: "0.88rem" }}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Longitude</span>
            <input
              type="number"
              step="any"
              name="longitude"
              value={longitude !== null ? longitude : ""}
              onChange={(e) =>
                setLongitude(e.target.value ? parseFloat(e.target.value) : null)
              }
              placeholder="Ex: -48.549523"
              style={{ padding: "8px", fontSize: "0.88rem" }}
            />
          </label>
        </div>

        {/* Mini Mapa Interativo */}
        <div style={{ marginBottom: "10px" }}>
          <PropertyMap
            latitude={latitude}
            longitude={longitude}
            editable={true}
            ocultarNumeroExato={ocultarNumeroExato}
            height="260px"
            onLocationChange={({ lat, lng }) => {
              setLatitude(Number(lat.toFixed(6)));
              setLongitude(Number(lng.toFixed(6)));
              setGeoMensagem({
                tipo: "sucesso",
                texto: `Pin reposicionado: ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
              });
            }}
          />
        </div>

        {/* Opção de Privacidade / Ocultar Número Exato */}
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            fontSize: "0.86rem",
            color: "var(--ink)",
            userSelect: "none",
          }}
        >
          <input
            type="checkbox"
            name="ocultarNumeroExato"
            value="true"
            checked={ocultarNumeroExato}
            onChange={(e) => setOcultarNumeroExato(e.target.checked)}
            style={{ width: "16px", height: "16px", accentColor: "var(--green)" }}
          />
          <span>
            <strong>Ocultar número exato no site</strong> (exibe apenas a região aproximada para o cliente)
          </span>
        </label>
      </div>
    </>
  );
}
