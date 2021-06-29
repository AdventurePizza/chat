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
    lat: 33.9192, // set a default value
    setLat: () => {},
    lng: -118.4165,
    setLng: () => {},
    isMapShowing: false,
    setIsMapShowing: () => {}
})