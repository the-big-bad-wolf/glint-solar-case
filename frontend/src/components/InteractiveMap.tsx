import { type Component, createSignal, createResource } from "solid-js";
import MapGL, { Viewport, Control } from "solid-map-gl";
import * as maplibre from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type Wave = {
	height: number;
	unit: string;
};

const InteractiveMap: Component = () => {
	const [viewport, setViewport] = createSignal({
		center: [-122.45, 37.78],
		zoom: 11,
	} as Viewport);

	const [location, setLocation] = createSignal<string | maplibre.LngLat>(
		"Click on the location to show maximum wave height"
	);

	const fetchWaveHeight = async () => {
		const response = await fetch(`http://127.0.0.1:5000`);
		let height: number;
		let unit: string;
		if (response.ok) {
			const data = (await response.json()) as Wave;
			height = data.height;
			unit = data.unit;
		}
		return height;
	};
	const [waveHeight] = createResource(location, fetchWaveHeight);

	return (
		<div class="w-full h-full">
			<MapGL
				style={{ width: "100%", height: "100%", "border-radius": "5px" }}
				mapLib={maplibre} // <- Pass MapLibre package here
				options={{ style: "https://demotiles.maplibre.org/style.json" }}
				viewport={viewport()}
				onViewportChange={(evt: Viewport) => setViewport(evt)}
				onClick={(evt: maplibre.MapMouseEvent) => {
					console.log(evt.lngLat);
					setLocation(evt.lngLat);
				}}
			>
				<Control type="navigation" position="top-left" />
				<Control type="fullscreen" position="top-right" />
			</MapGL>
			<div class="text-gray-50 text-center font-mono mt-5">Max wave height: </div>
			<div class="text-gray-50 text-center font-mono mt-5 text-xl ">{waveHeight()}</div>
		</div>
	);
};

export default InteractiveMap;
