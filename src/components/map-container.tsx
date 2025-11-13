"use client";

import {
	useEffect,
	useRef,
	forwardRef,
	useImperativeHandle,
	useState,
	useCallback,
} from "react";
import { Search } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import type { Landmark } from "@/src/lib/types";

// 💡 FIX 1: Importamos *solo* los tipos de Leaflet de forma estática.
// Esto permite usar 'L.Map', 'L.Marker', etc., en el tipado.
import type * as L from "leaflet";

// Tipado para la referencia del mapa
// 💡 FIX 2: LeafletMap ahora usa el tipo L.Map
type LeafletMap = L.Map | null;

interface MapContainerProps {
	landmarks: Landmark[];
	onMapClick?: (lat: number, lng: number) => void;
	interactive?: boolean;
}

// Tipado de forwardRef ya es correcto
export const MapContainer = forwardRef<
	{ getMap: () => LeafletMap },
	MapContainerProps
>(({ landmarks, onMapClick, interactive = true }, ref) => {
	const mapContainerRef = useRef<HTMLDivElement>(null);
	// mapRef, markersRef, y polylineRef ya estaban correctamente tipados con L.X
	const mapRef = useRef<L.Map | null>(null);
	const markersRef = useRef<L.Marker[]>([]);
	const polylineRef = useRef<L.Polyline | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [searching, setSearching] = useState(false);

	// Proveedor de Leaflet para uso asíncrono
	// 💡 FIX 3: Tipado correcto de LRef usando typeof L (referencia a la librería)
	const LRef = useRef<typeof L | null>(null);

	useImperativeHandle(ref, () => ({
		getMap: () => mapRef.current,
	}));

	// --- 1. Inicialización del Mapa ---
	useEffect(() => {
		// Evitar la ejecución en el servidor o si ya está inicializado
		if (
			typeof window === "undefined" ||
			!mapContainerRef.current ||
			mapRef.current
		)
			return;

		const initMap = async () => {
			// Importación dinámica para cargar Leaflet solo en el cliente
			const L = (await import("leaflet")).default as typeof L; // Aseguramos el tipo después de la importación
			LRef.current = L; // Guardamos la referencia a L

			// 💡 IMPORTANTE: La importación de CSS fue eliminada para evitar el error de Next.js.
			// Asegúrate de que `leaflet/dist/leaflet.css` está importado en `globals.css`.

			// Fix para los iconos por defecto de Leaflet, cargando desde CDN
			// 💡 FIX 4: El `as any` en el prototype ahora es más seguro, aunque necesario.
			delete (L.Icon.Default.prototype as any)._getIconUrl;
			L.Icon.Default.mergeOptions({
				iconRetinaUrl:
					"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
				iconUrl:
					"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
				shadowUrl:
					"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
			});

			const map = L.map(mapContainerRef.current!, {
				center: [40.4168, -3.7038], // Madrid, Spain
				zoom: 13,
			});

			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
				maxZoom: 19,
			}).addTo(map);

			if (interactive && onMapClick) {
				// L.LeafletMouseEvent ya es el tipo correcto
				map.on("click", (e: L.LeafletMouseEvent) => {
					onMapClick(e.latlng.lat, e.latlng.lng);
				});
			}

			mapRef.current = map;
		};

		initMap();

		// Función de limpieza: elimina el mapa al desmontar el componente
		return () => {
			if (mapRef.current) {
				mapRef.current.remove();
				mapRef.current = null;
			}
		};
	}, [interactive, onMapClick]);

	// --- 2. Actualización de Marcadores y Ruta ---
	useEffect(() => {
		const L = LRef.current; // Usamos la referencia guardada de L
		if (!mapRef.current || !L) return;

		const updateMap = () => {
			const map = mapRef.current!;

			// Limpiar elementos anteriores
			markersRef.current.forEach((marker) => marker.remove());
			markersRef.current = [];
			if (polylineRef.current) {
				polylineRef.current.remove();
				polylineRef.current = null;
			}

			if (landmarks.length === 0) return;

			// Crear y añadir nuevos marcadores
			const newMarkers = landmarks.map((landmark, index) => {
				// El resto del código de marcadores usa L.divIcon, L.marker, etc., que son correctos
				const customIcon = L.divIcon({
					className: "custom-marker",
					html: `
            <div style="
              width: 32px; height: 32px; background-color: #2563eb;
              border: 3px solid white; border-radius: 50%;
              display: flex; align-items: center; justify-content: center;
              font-weight: bold; color: white; font-size: 14px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
              ${index + 1}
            </div>
          `,
					iconSize: [32, 32],
					iconAnchor: [16, 16],
				});

				const marker = L.marker([landmark.lat, landmark.lng], {
					icon: customIcon,
				}).addTo(map).bindPopup(`
            <div style="min-width: 200px; padding: 8px;">
              <h3 style="font-weight: bold; margin-bottom: 4px; font-size: 14px; color: #1f2937;">
                ${index + 1}. ${landmark.name}
              </h3>
              <p style="font-size: 12px; color: #6b7280; margin: 0;">
                ${landmark.description}
              </p>
            </div>
          `);

				return marker;
			});
			markersRef.current = newMarkers;

			// Dibujar línea de ruta y ajustar vista
			const latLngs = landmarks.map(
				(l) => [l.lat, l.lng] as [number, number]
			);

			if (landmarks.length > 1) {
				polylineRef.current = L.polyline(latLngs, {
					color: "#2563eb",
					weight: 4,
					opacity: 0.8,
				}).addTo(map);

				const bounds = L.latLngBounds(latLngs);
				map.fitBounds(bounds, { padding: [80, 80], maxZoom: 15 });
			} else {
				// Si solo hay un punto, centrar y hacer zoom en ese punto
				map.setView([landmarks[0].lat, landmarks[0].lng], 15);
			}
		};

		updateMap();
	}, [landmarks]);

	// --- 3. Lógica de Búsqueda ---
	const handleSearch = useCallback(async () => {
		const L = LRef.current;
		if (!searchQuery.trim() || !mapRef.current || !L) return;

		setSearching(true);
		try {
			// Uso de Nominatim (OSM) para geocodificación
			const response = await fetch(
				`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
					searchQuery
				)}&limit=1`,
				{
					headers: {
						"User-Agent": "RouteShare App (v1.0)",
					},
				}
			);
			const data = await response.json();

			if (data && data.length > 0) {
				const { lat, lon } = data[0];
				const targetLat = parseFloat(lat);
				const targetLon = parseFloat(lon);

				// Mover el mapa de forma animada
				mapRef.current.flyTo([targetLat, targetLon], 16, {
					duration: 1.5,
				});

				// Llamar al callback como si se hubiera hecho clic
				if (onMapClick) {
					onMapClick(targetLat, targetLon);
				}
			}
		} catch (error) {
			console.error("Error searching location:", error);
		} finally {
			setSearching(false);
		}
	}, [searchQuery, onMapClick]);

	// --- Renderizado de la UI ---
	return (
		<div className="relative w-full h-full">
			{interactive && (
				<div className="absolute top-4 left-4 right-4 z-[1000] flex gap-2">
					<Input
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Buscar ubicación..."
						className="bg-background shadow-lg"
						onKeyDown={(e) => e.key === "Enter" && handleSearch()}
					/>
					<Button
						onClick={handleSearch}
						disabled={searching}
						className="shadow-lg"
					>
						<Search className="w-4 h-4" />
					</Button>
				</div>
			)}
			<div ref={mapContainerRef} className="w-full h-full" />
		</div>
	);
});

MapContainer.displayName = "MapContainer";
