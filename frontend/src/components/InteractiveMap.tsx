import { type Component, createSignal, createResource } from "solid-js";
import MapGL, { Viewport, Control, Marker } from "solid-map-gl";
import * as maplibre from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type Wave = {
	hmax: number;
	unit: string;
};

const InteractiveMap: Component = () => {
	const [viewport, setViewport] = createSignal({
		center: [10.736688435108459, 59.9129959529091],
		zoom: 10,
	} as Viewport);

	const [location, setLocation] = createSignal<maplibre.LngLat>();

	const fetchWaveHeight = async (latlng: maplibre.LngLat) => {
		let formData = new FormData();
		formData.append("latitude", latlng.lat.toString());
		formData.append("longitude", latlng.lng.toString());
		const response = await fetch(`http://127.0.0.1:5000`, { body: formData, method: "POST" });

		let hmax: number;
		let unit: string;

		if (response.ok) {
			const data = (await response.json()) as Wave;
			hmax = data.hmax;
			unit = data.unit;
		}
		return [hmax, unit];
	};

	const [waveHeight] = createResource(location, fetchWaveHeight); //When location changes, fetchWaveHeight is called with location as argument

	return (
		<div class="w-full h-full">
			<MapGL
				style={{ width: "100%", height: "100%", "border-radius": "5px" }}
				mapLib={maplibre} // <- Pass MapLibre package here
				options={{ style: "https://demotiles.maplibre.org/style.json" }}
				viewport={viewport()}
				onViewportChange={(evt: Viewport) => setViewport(evt)}
				onClick={(evt: maplibre.MapMouseEvent) => {
					setLocation(evt.lngLat);
				}}
			>
				<Control type="navigation" position="top-left" />
				<Control type="fullscreen" position="top-right" />
				<Marker></Marker>
			</MapGL>
			<div class="text-gray-50 text-center font-mono mt-3">
				Max wave height for ({location() ? location().lat.toFixed(2) : ""},{" "}
				{location() ? location().lng.toFixed(2) : ""}):
			</div>
			<div class="text-gray-50 text-center font-mono mt-2 text-xl ">{waveHeight()}</div>
		</div>
	);
};

export default InteractiveMap;
