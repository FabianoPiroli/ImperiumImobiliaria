"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";

interface PropertyMapProps {
  latitude?: number | null;
  longitude?: number | null;
  editable?: boolean;
  ocultarNumeroExato?: boolean;
  onLocationChange?: (coords: { lat: number; lng: number }) => void;
  height?: string;
  popupTitle?: string;
}

// Ícone personalizado com as cores da Imperium Imobiliária (--green: #185c4b)
const pinIconSvg = `
  <svg width="34" height="44" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 3px 6px rgba(0,0,0,0.3));">
    <path d="M16 0C7.16344 0 0 7.16344 0 16C0 26.5 16 42 16 42C16 42 32 26.5 32 16C32 7.16344 24.8366 0 16 0Z" fill="#185c4b"/>
    <circle cx="16" cy="16" r="6.5" fill="#fffdf8"/>
    <circle cx="16" cy="16" r="3" fill="#185c4b"/>
  </svg>
`;

export default function PropertyMap({
  latitude,
  longitude,
  editable = false,
  ocultarNumeroExato = false,
  onLocationChange,
  height = "320px",
  popupTitle,
}: PropertyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);

  const hasCoords =
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    !isNaN(latitude) &&
    !isNaN(longitude);

  // Inicializar o mapa
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Se já foi inicializado, não recriar
    if (mapInstanceRef.current) return;

    const initialCenter: [number, number] = hasCoords
      ? [latitude!, longitude!]
      : [-27.5954, -48.548]; // Florianópolis / SC padrão

    const initialZoom = hasCoords ? 16 : 8;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      scrollWheelZoom: editable, // No modo visualização, evita rolagem acidental
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    // Clique no mapa para posicionar o pin (modo edição)
    if (editable) {
      map.on("click", (e: L.LeafletMouseEvent) => {
        if (onLocationChange) {
          onLocationChange({ lat: e.latlng.lat, lng: e.latlng.lng });
        }
      });
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [editable, hasCoords, latitude, longitude, onLocationChange]);

  // Atualizar marcador e círculo quando as coordenadas ou opções mudarem
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remover marcador e círculo anteriores
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
    if (circleRef.current) {
      circleRef.current.remove();
      circleRef.current = null;
    }

    if (!hasCoords) return;

    const pos: [number, number] = [latitude!, longitude!];
    map.setView(pos, map.getZoom() < 14 ? 15 : map.getZoom());

    const customPin = L.divIcon({
      className: "custom-map-pin",
      html: pinIconSvg,
      iconSize: [34, 44],
      iconAnchor: [17, 44],
      popupAnchor: [0, -40],
    });

    // Se for visualização pública com número oculto: renderiza círculo de aproximação
    if (ocultarNumeroExato && !editable) {
      const circle = L.circle(pos, {
        radius: 400,
        color: "#185c4b",
        fillColor: "#c8dd8d",
        fillOpacity: 0.35,
        weight: 2,
      }).addTo(map);

      circle.bindPopup(
        `<strong>Localização aproximada</strong><br/><small>Por motivos de privacidade, exibimos a região aproximada do imóvel.</small>`
      );
      circleRef.current = circle;
      return;
    }

    // Criar marcador
    const marker = L.marker(pos, {
      icon: customPin,
      draggable: editable,
    }).addTo(map);

    if (popupTitle) {
      marker.bindPopup(`<strong>${popupTitle}</strong>`);
    } else if (editable) {
      marker.bindPopup(
        "<strong>Localização do Imóvel</strong><br/><small>Arraste para ajustar o ponto exato se necessário.</small>"
      );
    }

    if (editable) {
      marker.on("dragend", (e: L.DragEndEvent) => {
        const latLng = e.target.getLatLng();
        if (onLocationChange) {
          onLocationChange({ lat: latLng.lat, lng: latLng.lng });
        }
      });

      // No modo edição, se ocultarNumeroExato estiver marcado, mostra o círculo em volta do pin para pré-visualização
      if (ocultarNumeroExato) {
        const circle = L.circle(pos, {
          radius: 400,
          color: "#185c4b",
          dashArray: "6, 6",
          fillColor: "#c8dd8d",
          fillOpacity: 0.25,
          weight: 2,
        }).addTo(map);
        circleRef.current = circle;
      }
    }

    markerRef.current = marker;
  }, [hasCoords, latitude, longitude, editable, ocultarNumeroExato, popupTitle, onLocationChange]);

  return (
    <div style={{ position: "relative", width: "100%", borderRadius: "8px", overflow: "hidden" }}>
      <div
        ref={mapContainerRef}
        style={{
          width: "100%",
          height,
          zIndex: 1,
          border: "1px solid var(--line)",
          borderRadius: "8px",
        }}
      />
      {!hasCoords && editable && (
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(255, 253, 248, 0.92)",
            border: "1px solid var(--line)",
            padding: "6px 14px",
            borderRadius: "20px",
            fontSize: "0.78rem",
            color: "var(--ink)",
            zIndex: 1000,
            pointerEvents: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          }}
        >
          📍 Clique no mapa ou use a busca acima para definir a posição
        </div>
      )}
    </div>
  );
}

