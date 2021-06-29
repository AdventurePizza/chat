import GoogleMapReact from 'google-map-react';
import React from 'react';
import { useContext } from 'react';
import { MapsContext } from "../contexts/MapsContext";


interface IMapProps {
    zoom: number
}

export const Map = ({zoom} : IMapProps) => {
    const { lat, lng } = useContext(MapsContext);

    return (
        <div style={{width: "100%", height: "100%", position: "relative"}}>

            <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyArAlGMMvreircH6LgluU4xHTBDJR7KBzs'}}
                center= { {lat: lat, lng: lng} }
                defaultZoom= { zoom }
            >
            </GoogleMapReact>
        </div>
    )
}

Map.defaultProps = {
    zoom: 12
}