import { createContext } from 'react';

export type MapsContent = {
    lat: number
    setLat:(lat: number) => void
    lng: number
    setLng: (lng: number) => void
    isMapShowing: boolean
    setIsMapShowing: (isMapShowing: boolean) => void
}

export const MapsContext = createContext<MapsContent>({
    lat: 45.5555, // set a default value
    setLat: () => {},
    lng: -71.5555,
    setLng: () => {},
    isMapShowing: false,
    setIsMapShowing: () => {}
})