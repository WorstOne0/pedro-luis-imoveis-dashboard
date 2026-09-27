"use client";

// Next
import { useCallback, useEffect, useState } from "react";
import { GoogleMap, MarkerF, useJsApiLoader, type Libraries } from "@react-google-maps/api";
// Components
import { useDistanceMeasure, DistanceOverlay, DistanceReadout } from "./components/distance_tool";
// Utils
import { MAP_COLORS } from "@/utils";
// Icons
import {
  MdOutlineLayers,
  MdOutlineNavigation,
  MdOutlineAdd,
  MdOutlineRemove,
  MdOutlineStraighten,
  MdOutlineMyLocation,
  MdOutlineFullscreen,
  MdOutlineCheck,
} from "react-icons/md";

// Module scope: a new array per render makes the loader reload the script.
const LIBRARIES: Libraries = ["geometry"];

// Cascavel/PR, where the map opens when no centre is given.
const DEFAULT_CENTER = { lat: -24.960731, lng: -53.519697 };

const MAP_TYPES = [
  { value: "hybrid", label: "Satélite com nomes" },
  { value: "satellite", label: "Satélite" },
  { value: "roadmap", label: "Mapa" },
  { value: "terrain", label: "Relevo" },
];

const MY_LOCATION_ICON = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="${MAP_COLORS.myLocation}" opacity="0.25"/><circle cx="12" cy="12" r="6" fill="${MAP_COLORS.myLocation}" stroke="#fff" stroke-width="2.5"/></svg>`
)}`;

type GoogleMapsProps = {
  children?: React.ReactNode;
  onCreateMap?: (map: google.maps.Map) => void;
  height?: string;
  width?: string;
  zoom?: number;
  center?: google.maps.LatLngLiteral;
  gestureHandling?: "auto" | "cooperative" | "greedy" | "none";
  mapTypeId?: string;
  showControls?: boolean;
};

// Loads the Maps script itself, so only pages that show a map pay for it.
export default function GoogleMaps({
  children,
  onCreateMap,
  height = "100%",
  width = "100%",
  zoom = 13,
  center,
  gestureHandling = "auto",
  mapTypeId = "hybrid",
  showControls = true,
}: GoogleMapsProps) {
  const { isLoaded, loadError } = useJsApiLoader({ googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API as string, libraries: LIBRARIES });

  const [myMap, setMyMap] = useState<google.maps.Map | null>(null);
  const [currentMapType, setCurrentMapType] = useState(mapTypeId);
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [myLocation, setMyLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [heading, setHeading] = useState(0);
  const [tilt, setTilt] = useState(0);

  const measure = useDistanceMeasure(myMap, isMeasuring);

  // The needle follows the camera, so it doubles as a bearing readout.
  useEffect(() => {
    if (!myMap) return;

    const sync = () => {
      setHeading(myMap.getHeading() ?? 0);
      setTilt(myMap.getTilt() ?? 0);
    };
    const listeners = [myMap.addListener("heading_changed", sync), myMap.addListener("tilt_changed", sync), myMap.addListener("idle", sync)];

    return () => listeners.forEach((listener) => listener.remove());
  }, [myMap]);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      map.moveCamera({ center: center ?? DEFAULT_CENTER });

      onCreateMap?.(map);
      setMyMap(map);
    },
    [onCreateMap, center]
  );

  // Closing discards the path, so reopening starts clean.
  const toggleMeasuring = () => {
    if (isMeasuring) measure.clear();

    setIsMeasuring(!isMeasuring);
  };

  const selectMapType = (value: string) => {
    myMap?.setOptions({ mapTypeId: value });
    setCurrentMapType(value);
    setIsLayerMenuOpen(false);
  };

  const resetNorth = () => {
    myMap?.setHeading(0);
    myMap?.setTilt(0);

    setHeading(0);
    setTilt(0);
  };

  const locateMe = () => {
    if (!navigator.geolocation) return setLocationError("Localização não suportada neste navegador.");

    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const point = { lat: position.coords.latitude, lng: position.coords.longitude };

        setMyLocation(point);
        myMap?.moveCamera({ center: point, zoom: 15 });
      },
      () => setLocationError("Não foi possível obter sua localização."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Found from the button, not a ref: buildButton runs during render, where refs may not be read.
  const toggleFullscreen = (button: HTMLElement) => {
    if (document.fullscreenElement) return document.exitFullscreen();

    button.closest<HTMLElement>("[data-map]")?.requestFullscreen();
  };

  const zoomBy = (delta: number) => myMap?.setZoom((myMap.getZoom() ?? zoom) + delta);

  const buildButton = ({
    label,
    onClick,
    isActive = false,
    children,
  }: {
    label: string;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    isActive?: boolean;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={isActive}
      onClick={onClick}
      className={`h-[4rem] w-[4rem] flex items-center justify-center rounded-control floating transition-colors cursor-pointer
        ${isActive ? "bg-action text-on-action" : "bg-surface text-title hover:bg-surface-2"}`}
    >
      {children}
    </button>
  );

  if (loadError) return <div className="h-full w-full flex items-center justify-center bg-surface-3 text-[1.4rem] text-meta">Não foi possível carregar o mapa.</div>;

  if (!isLoaded) return <div className="h-full w-full bg-surface-3 animate-pulse" />;

  return (
    <div data-map className="h-full w-full relative">
      <GoogleMap onLoad={onLoad} mapContainerStyle={{ height, width }} zoom={zoom} options={{ tilt: 0, gestureHandling, mapTypeId, disableDefaultUI: true }}>
        {children}

        {isMeasuring && <DistanceOverlay points={measure.points} />}

        {myLocation && (
          <MarkerF
            position={myLocation}
            title="Você está aqui"
            icon={{ url: MY_LOCATION_ICON, scaledSize: new window.google.maps.Size(24, 24), anchor: new window.google.maps.Point(12, 12) }}
          />
        )}
      </GoogleMap>

      {/* HTML overlays stay outside <GoogleMap>: among its children they render under Google's own layers. */}
      {isMeasuring && <DistanceReadout label={measure.label} count={measure.points.length} onUndo={measure.undo} onClose={toggleMeasuring} />}

      {showControls && (
        <>
          <div className="flex flex-col gap-[1.2rem] absolute top-1/2 right-[1rem] -translate-y-1/2 z-20">
            <div className="flex flex-col gap-[0.6rem] relative">
              {buildButton({
                label: "Tipo de mapa",
                onClick: () => setIsLayerMenuOpen(!isLayerMenuOpen),
                isActive: isLayerMenuOpen,
                children: <MdOutlineLayers size={19} />,
              })}

              {isLayerMenuOpen && (
                <div className="w-[20rem] p-[0.4rem] flex flex-col bg-surface rounded-card floating absolute top-0 right-[calc(100%+0.8rem)]">
                  {MAP_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => selectMapType(type.value)}
                      className={`h-[3.6rem] px-[1rem] flex items-center justify-between gap-[1rem] rounded-control text-left text-[1.4rem] cursor-pointer
                        ${currentMapType === type.value ? "bg-surface-2 font-semibold text-title" : "text-body hover:bg-surface-2"}`}
                    >
                      {type.label}
                      {currentMapType === type.value && <MdOutlineCheck size={16} className="shrink-0 text-action" />}
                    </button>
                  ))}
                </div>
              )}

              {buildButton({
                label: tilt || heading ? "Apontar para o norte" : "Já está apontado para o norte",
                onClick: resetNorth,
                children: <MdOutlineNavigation size={18} style={{ transform: `rotate(${-heading}deg)`, transition: "transform 0.2s" }} />,
              })}
            </div>

            <div className="flex flex-col gap-[0.6rem]">
              {buildButton({ label: "Aproximar", onClick: () => zoomBy(1), children: <MdOutlineAdd size={20} /> })}
              {buildButton({ label: "Afastar", onClick: () => zoomBy(-1), children: <MdOutlineRemove size={20} /> })}
              {buildButton({ label: "Medir distância", onClick: toggleMeasuring, isActive: isMeasuring, children: <MdOutlineStraighten size={19} /> })}
            </div>

            <div className="flex flex-col gap-[0.6rem]">
              {buildButton({ label: "Minha localização", onClick: locateMe, children: <MdOutlineMyLocation size={18} /> })}
              {buildButton({ label: "Tela cheia", onClick: (event) => toggleFullscreen(event.currentTarget), children: <MdOutlineFullscreen size={20} /> })}
            </div>
          </div>

          <span className="h-[2.6rem] px-[1rem] flex items-center rounded-control bg-surface/90 text-[1.2rem] font-semibold text-body floating absolute bottom-[2.6rem] right-[1rem] select-none pointer-events-none">
            {MAP_TYPES.find((type) => type.value === currentMapType)?.label ?? currentMapType}
          </span>

          {locationError && (
            <span className="px-[1.2rem] py-[0.8rem] rounded-control bg-surface text-[1.3rem] text-title floating absolute bottom-[8rem] left-1/2 -translate-x-1/2 z-20">
              {locationError}
            </span>
          )}
        </>
      )}
    </div>
  );
}
