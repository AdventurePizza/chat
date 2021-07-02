import { createContext } from 'react';

export type MapsContent = {
    coordinates: { lat: number, lng: number }
    setCoordinates: (coordinates: {lat: number, lng: number}) => void
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
    zoom: 12,
    setZoom: () => {},
    isMapShowing: false,
    setIsMapShowing: () => {}
})