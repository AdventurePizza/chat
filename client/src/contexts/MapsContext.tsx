import { createContext } from 'react';

interface ICoordinates {
    lat: number, 
    lng: number
}

export type MapsContent = {
    coordinates: { lat: number, lng: number }
    setCoordinates: (coordinates: {lat: number, lng: number}) => void
    markerCoordinates: { lat: number, lng: number }
    setMarkerCoordinates: (coordinates: {lat: number, lng: number}) => void
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