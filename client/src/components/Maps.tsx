import GoogleMapReact from 'google-map-react';
import React from 'react';
import { useContext } from 'react';
import { MapsContext } from "../contexts/MapsContext";
import { AppStateContext } from "../contexts/AppStateContext";
import "./Marker.css";
import { IMap } from "../types"

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

interface IMapProps {
    mapData? : IMap
}

export const Map = ({mapData}: IMapProps) => {
    const { coordinates, setCoordinates, markerCoordinates, zoom, setZoom } = useContext(MapsContext);
    const { socket } = useContext(AppStateContext);
    const { markers, setMarkers} = useContext(MapsContext);

    const updateCoordinates = (newCoordinates: {lat: number, lng: number}, newZoom: number) => {
        setCoordinates(newCoordinates);
        setZoom(newZoom);
        socket.emit('event', {
            key: 'map',
            coordinates: newCoordinates,
            zoom: newZoom
        });
        
    }

    const apiIsLoaded = (map: any, maps: any) => {
        map.addListener('dblclick', (event: any) => {
            markers.push({
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
            });
            const newMarkers = [...markers];
            setMarkers(newMarkers);
            socket.emit('event', {
                key: 'map',
                markers: newMarkers
            });
        })
      };

    return (
        <div style={{width: "100%", height: "100%", position: "relative", top: "0", left: "0"}}>
            {mapData && (
                <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyArAlGMMvreircH6LgluU4xHTBDJR7KBzs"}}
                center={ mapData.coordinates }
                zoom= { mapData.zoom }
                onChange={({center, zoom, bounds, marginBounds }) => {
                    updateCoordinates(center, zoom);
                }}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps)}
                options={{
                    disableDoubleClickZoom: true
                }}
            >
                <Marker lat={mapData.markerCoordinates.lat} lng={mapData.markerCoordinates.lng} />
                {mapData.markers.map((marker, index) => <Marker lat={marker.lat} lng={marker.lng} key={index} />)}
            </GoogleMapReact>
            )}
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
                <Marker lat={markerCoordinates.lat} lng={markerCoordinates.lng} />
                {markers.map((marker, index) => <Marker lat={marker.lat} lng={marker.lng} key={index} />)}
            </GoogleMapReact>
        </div>
    )
}