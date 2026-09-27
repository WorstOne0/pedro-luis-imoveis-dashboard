"use client";

// Next
import { useEffect, useState } from "react";
import { MarkerF, PolylineF } from "@react-google-maps/api";
// Utils
import { MAP_COLORS } from "@/utils";
// Icons
import { MdOutlineClose, MdOutlineUndo } from "react-icons/md";

const formatDistance = (metres: number) => {
  if (metres < 1000) return `${Math.round(metres)} m`;

  return `${(metres / 1000).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} km`;
};

const VERTEX_ICON = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="5.5" fill="#fff" stroke="${MAP_COLORS.action}" stroke-width="2.5"/></svg>`
)}`;

// State in the parent, the path inside <GoogleMap>, the readout outside it — see google_maps/index.tsx.
export const useDistanceMeasure = (map: google.maps.Map | null, isActive: boolean) => {
  const [points, setPoints] = useState<google.maps.LatLngLiteral[]>([]);

  useEffect(() => {
    if (!map || !isActive) return;

    const listener = map.addListener("click", (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return;

      setPoints((current) => [...current, { lat: event.latLng!.lat(), lng: event.latLng!.lng() }]);
    });

    const previousCursor = map.get("draggableCursor");
    map.setOptions({ draggableCursor: "crosshair" });

    return () => {
      listener.remove();
      map.setOptions({ draggableCursor: previousCursor ?? null });
    };
  }, [map, isActive]);

  const total = points.reduce((sum, point, index) => {
    if (index === 0) return 0;

    return sum + google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(points[index - 1]), new google.maps.LatLng(point));
  }, 0);

  return {
    points,
    total,
    label: formatDistance(total),
    undo: () => setPoints((current) => current.slice(0, -1)),
    clear: () => setPoints([]),
  };
};

export const DistanceOverlay = ({ points }: { points: google.maps.LatLngLiteral[] }) => (
  <>
    <PolylineF path={points} options={{ strokeColor: MAP_COLORS.action, strokeWeight: 4, strokeOpacity: 0.9, clickable: false }} />

    {points.map((point, index) => (
      <MarkerF
        key={`measure_${index}`}
        position={point}
        icon={{ url: VERTEX_ICON, scaledSize: new google.maps.Size(16, 16), anchor: new google.maps.Point(8, 8) }}
        zIndex={20}
        clickable={false}
      />
    ))}
  </>
);

export const DistanceReadout = ({ label, count, onUndo, onClose }: { label: string; count: number; onUndo: () => void; onClose: () => void }) => (
  // Bottom, not top: the fixed navbar covers the top of the map.
  <div className="px-[1.4rem] py-[1rem] flex items-center gap-[1.2rem] bg-surface rounded-card floating absolute bottom-[2rem] left-1/2 -translate-x-1/2 z-20">
    <div className="flex flex-col">
      <span className="text-[1.8rem] font-bold text-title tabular-nums leading-[2.2rem]">{label}</span>
      <span className="text-[1.2rem] text-meta">{count === 0 ? "Clique no mapa para medir" : `${count} ponto${count === 1 ? "" : "s"}`}</span>
    </div>

    <button
      type="button"
      aria-label="Desfazer último ponto"
      title="Desfazer último ponto"
      onClick={onUndo}
      disabled={count === 0}
      className="h-[3.2rem] w-[3.2rem] flex items-center justify-center rounded-control text-body hover:bg-surface-2 disabled:opacity-40 cursor-pointer"
    >
      <MdOutlineUndo size={18} />
    </button>

    <button
      type="button"
      aria-label="Fechar medição"
      title="Fechar medição"
      onClick={onClose}
      className="h-[3.2rem] w-[3.2rem] flex items-center justify-center rounded-control text-body hover:bg-surface-2 cursor-pointer"
    >
      <MdOutlineClose size={18} />
    </button>
  </div>
);
