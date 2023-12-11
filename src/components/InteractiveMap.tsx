import { type Component, createSignal } from "solid-js";
import MapGL, { Viewport, Control } from "solid-map-gl";
import * as maplibre from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const InteractiveMap: Component = () => {
	const [viewport, setViewport] = createSignal({
		center: [-122.45, 37.78],
		zoom: 11,
	} as Viewport);

	const [waveHeight, setWaveHeight] = createSignal(
		"Click on the location to show maximum wave height"
	);
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
					setWaveHeight(Math.random() * 10);
				}}
			>
				<Control type="navigation" position="top-left" />
				<Control type="fullscreen" position="top-right" />
			</MapGL>
			<div class="text-gray-50 text-center font-mono mt-5">Max wave height: </div>
			<div class="text-gray-50 text-center font-mono mt-5 text-xl ">{waveHeight} </div>
		</div>
	);
};

export default InteractiveMap;
