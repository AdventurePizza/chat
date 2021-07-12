import { createContext } from 'react';

interface ICoordinates {
    lat: number, 
    lng: number
}

export type MapsContent = {
    coordinates: ICoordinates
    setCoordinates: (coordinates: ICoordinates) => void
    markerCoordinates: ICoordinates
    setMarkerCoordinates: (coordinates: ICoordinates) => void
    markers: Array<ICoordinates>,
    setMarkers: (markers: Array<ICoordinates>) => void
    zoom: number
    setZoom: (zoom: number) => void
    isMapShowing: boolean
    setIsMapShowing: (isMapShowing: boolean) => void
}

export const MapsContext = createContext<MapsContent>({
    coordinates: {
        lat: 33.91925555555555,
        lng: -118.41655555555555
    },
    setCoordinates: () => {},
    markerCoordinates: {
        lat: 33.91925555555555,
        lng: -118.41655555555555
    },
    setMarkerCoordinates: () => {},
    markers: [],
    setMarkers: () => {},
    zoom: 12,
    setZoom: () => {},
    isMapShowing: false,
    setIsMapShowing: () => {}
})