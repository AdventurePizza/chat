import GoogleMapReact from 'google-map-react';
import React from 'react';
import { useContext, useState } from 'react';
import { MapsContext } from "../contexts/MapsContext";
import { AppStateContext } from "../contexts/AppStateContext";
import "./Marker.css";
import { PinButton } from "./shared/PinButton";

interface IMarkerProps {
    lat: number;
    lng: number;
}

const Marker = ({lat, lng}: IMarkerProps) => {
    return (
     <>
        <div className="pin"></div>
        <div className="pulse"></div>
    </>
    )
}

export const Map = () => {
    const { coordinates, setCoordinates, markerCoordinates, setMarkerCoordinates, zoom, setZoom } = useContext(MapsContext);
    const { socket } = useContext(AppStateContext);
    const { markers, setMarkers} = useContext(MapsContext);
    /* const [markers, setMarkers] = useState<IMarkerProps[]>([]); */

    const updateCoordinates = (newCoordinates: {lat: number, lng: number}, newZoom: number) => {
        setCoordinates(newCoordinates);
        setZoom(newZoom);
        socket.emit('event', {
            key: 'map',
            coordinates: newCoordinates,
            zoom: newZoom
        });
        
    }

    const apiIsLoaded = (map: any /* google.maps.MapTypeId.ROADMAP */, maps: any) => {
        map.addListener('dblclick', (event: any) => {
            markers.push({
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
            });
            const newMarkers = [...markers];
            console.log(newMarkers);
            setMarkers(newMarkers);
            socket.emit('event', {
                key: 'map',
                markers: newMarkers
            });
        })
      };

    return (
        <div style={{width: "100%", height: "100%", position: "relative"}}>
            <PinButton
                isPinned={true}
                onPin={() => {}}
                onUnpin={() => {}}
                placeholder="background"
            />
            <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyArAlGMMvreircH6LgluU4xHTBDJR7KBzs"}}
                center={ coordinates }
                zoom= { zoom }
                onChange={({center, zoom, bounds, marginBounds }) => {
                    updateCoordinates(center, zoom);
                }}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps)}
                options={{
                    disableDoubleClickZoom: true
                }}
            >
                <Marker lat={markerCoordinates.lat} lng={markerCoordinates.lng}/>
                {markers.map((marker, index) => <Marker lat={marker.lat} lng={marker.lng} key={index}/>)}
            </GoogleMapReact>
        </div>
    )
}