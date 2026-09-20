/**
 * Utilitários de geolocalização e extração de coordenadas
 */

export interface Coordenadas {
  lat: number;
  lng: number;
}

/**
 * Tenta extrair coordenadas diretamente de um texto digitado/colado.
 * Suporta formatos:
 * 1. Coordenadas brutas: "-27.5969, -48.5495" ou "-27.5969 -48.5495"
 * 2. URLs normais do Google Maps:
 *    - https://www.google.com/maps/@-27.596901,-48.549523,17z
 *    - https://www.google.com/maps/place/.../@-27.596901,-48.549523,17z
 *    - https://www.google.com/maps?q=-27.5969,-48.5495
 *    - https://www.google.com/maps/search/?api=1&query=-27.5969,-48.5495
 */
export function extrairCoordenadas(input: string): Coordenadas | null {
  if (!input) return null;
  const texto = input.trim();

  // 1. Tentar casar coordenadas brutas: ex: -27.5969, -48.5495 ou -27.5969 -48.5495
  const regexCoordPura = /^(-?\d{1,2}(?:\.\d+)?)[,\s]+(-?\d{1,3}(?:\.\d+)?)$/;
  const matchPuro = texto.match(regexCoordPura);
  if (matchPuro) {
    const lat = parseFloat(matchPuro[1]);
    const lng = parseFloat(matchPuro[2]);
    if (isValidLatLng(lat, lng)) {
      return { lat, lng };
    }
  }

  // 2. URL do Google Maps com @lat,lng
  const regexUrlAt = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
  const matchAt = texto.match(regexUrlAt);
  if (matchAt) {
    const lat = parseFloat(matchAt[1]);
    const lng = parseFloat(matchAt[2]);
    if (isValidLatLng(lat, lng)) {
      return { lat, lng };
    }
  }

  // 3. URL do Google Maps com ?q=lat,lng ou ?query=lat,lng
  const regexUrlQuery = /[?&](?:q|query)=(-?\d+\.\d+),(-?\d+\.\d+)/;
  const matchQuery = texto.match(regexUrlQuery);
  if (matchQuery) {
    const lat = parseFloat(matchQuery[1]);
    const lng = parseFloat(matchQuery[2]);
    if (isValidLatLng(lat, lng)) {
      return { lat, lng };
    }
  }

  // 4. URL com coordenadas embutidas no caminho (/place/.../-27.5969,-48.5495/...)
  const regexUrlPath = /(-?\d{1,2}\.\d{4,})[,\s]+(-?\d{1,3}\.\d{4,})/;
  const matchPath = texto.match(regexUrlPath);
  if (matchPath) {
    const lat = parseFloat(matchPath[1]);
    const lng = parseFloat(matchPath[2]);
    if (isValidLatLng(lat, lng)) {
      return { lat, lng };
    }
  }

  return null;
}

/**
 * Verifica se uma URL é encurtada do Google Maps (celular)
 */
export function isShortGoogleMapsUrl(input: string): boolean {
  if (!input) return false;
  return /maps\.app\.goo\.gl|goo\.gl\/maps/i.test(input.trim());
}

/**
 * Validação simples de intervalo de latitude e longitude
 */
export function isValidLatLng(lat: number, lng: number): boolean {
  return (
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

/**
 * Busca coordenadas via API pública do Nominatim (OpenStreetMap)
 */
export async function buscarCoordenadasNominatim(params: {
  endereco: string;
  bairro?: string;
  cidade: string;
  estado?: string;
}): Promise<{ lat: number; lng: number; displayName: string } | null> {
  const partes: string[] = [];
  if (params.endereco) partes.push(params.endereco);
  if (params.bairro) partes.push(params.bairro);
  if (params.cidade) partes.push(params.cidade);
  if (params.estado) partes.push(params.estado);
  partes.push("Brasil");

  const query = encodeURIComponent(partes.join(", "));
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&addressdetails=1`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const primeiro = data[0];
      const lat = parseFloat(primeiro.lat);
      const lng = parseFloat(primeiro.lon);
      if (isValidLatLng(lat, lng)) {
        return {
          lat,
          lng,
          displayName: primeiro.display_name,
        };
      }
    }
    return null;
  } catch (error) {
    console.error("Erro ao consultar Nominatim:", error);
    return null;
  }
}

