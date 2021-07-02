import GoogleMapReact from 'google-map-react';
import React from 'react';
import { useContext } from 'react';
import { MapsContext } from "../contexts/MapsContext";
import { AppStateContext } from "../contexts/AppStateContext";


export const Map = () => {
    const { coordinates, setCoordinates, zoom, setZoom } = useContext(MapsContext);
    const { socket } = useContext(AppStateContext);

    const updateCoordinates = (coordinates: {lat: number, lng: number}, zoom: number) => {
        setCoordinates(coordinates);
        setZoom(zoom);
        console.log("NEW CENTER", coordinates);
        socket.emit('event', {
            key: 'map',
            coordinates: coordinates,
            zoom: zoom
        });
    }

    return (
        <div style={{width: "100%", height: "100%", position: "relative"}}>

            <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyArAlGMMvreircH6LgluU4xHTBDJR7KBzs"}}
                center={ coordinates }
                zoom= { zoom }
                onChange={({center, zoom, bounds, marginBounds }) => {
                    updateCoordinates(center, zoom);
                }}
            >
            </GoogleMapReact>
        </div>
    )
}