import React, { createContext, useState } from 'react';

interface ICoordinates {
	lat: number;
	lng: number;
	text?: string;
}

export interface IMapsContext {
	coordinates: ICoordinates;
	updateCoordinates: (coordinates: ICoordinates) => void;
	markers: Array<ICoordinates>;
	zoom: number;
	updateZoom: (zoom: number) => void;
	isMapShowing: boolean;
	updateIsMapShowing: (isMapShowing: boolean) => void;
	addMarker: (marker: ICoordinates) => void;
	deleteMarker: (index: number) => void;
	updateMarkerText: (index: number, text: string) => void;
	resetMap: () => void;
}

export const MapsContext = createContext<IMapsContext>({
	coordinates: {
		lat: 33.91925555555555,
		lng: -118.41655555555555
	},
	updateCoordinates: () => {},
	markers: [],
	zoom: 12,
	updateZoom: () => {},
	isMapShowing: false,
	updateIsMapShowing: () => {},
	addMarker: () => {},
	deleteMarker: () => {},
	updateMarkerText: () => {},
	resetMap: () => {}
});

export const MapsProvider = ({ children }: { children: React.ReactNode }) => {
	const [coordinates, setCoordinates] = useState<ICoordinates>({
		lat: 33.91925555555555,
		lng: -118.41655555555555
	});
	const [markers, setMarkers] = useState<ICoordinates[]>([]);
	const [zoom, setZoom] = useState(12);
	const [isMapShowing, setIsMapShowing] = useState(false);

	//update markers
	const addMarker = (marker: ICoordinates) => {
		setMarkers((markers) => markers.concat(marker));
	};

	const deleteMarker = (index: number) => {
		setMarkers([...markers.slice(0, index), ...markers.slice(index + 1)]);
	};

	const updateMarkerText = (index: number, text: string) => {
		setMarkers([
			...markers.slice(0, index),
			{ ...markers[index], text },
			...markers.slice(index + 1)
		]);
	};

	const resetMap = () => {
		setCoordinates({
			lat: 33.91925555555555,
			lng: -118.41655555555555
		});
		setZoom(12);
		setIsMapShowing(false);
		setMarkers([]);
	}

	return (
		<MapsContext.Provider
			value={{
				coordinates,
				markers,
				zoom,
				isMapShowing,
				updateZoom: setZoom,
				updateIsMapShowing: setIsMapShowing,
				updateCoordinates: setCoordinates,
				addMarker,
				deleteMarker,
				updateMarkerText,
				resetMap
			}}
		>
			{children}
		</MapsContext.Provider>
	);
};
