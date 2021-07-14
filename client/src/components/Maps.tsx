import GoogleMapReact from 'google-map-react';
import React from 'react';
import { useContext, useState, useEffect } from 'react';
import { MapsContext } from "../contexts/MapsContext";
import { AppStateContext } from "../contexts/AppStateContext";
import "./Marker.css";
import { IMap } from "../types"

interface IMarkerProps {
    lat: number,
    lng: number,
    text?: string,
    index: number
}

const Marker = ({lat, lng, text, index }: IMarkerProps) => {
    const [inputVal, setInputVal] = useState("");
    const { markers, setMarkers } = useContext(MapsContext);
    const { socket } = useContext(AppStateContext);


    const onUpdateName = () => {
        markers[index].text = inputVal;
        const newMarkers = [...markers];
        setMarkers(newMarkers);
        socket.emit('event', {
            key: 'map',
            markers: newMarkers
        });
        setInputVal("");
    }

    const onMarkerDelete = () => {
        markers.splice(index, 1);
        const newMarkers = [...markers];
        setMarkers(newMarkers);
        socket.emit('event', {
            key: 'map',
            markers: newMarkers
        });
    }

    /* useEffect(() => {
        console.log("Markers", markers);
    }, [markers]); */

    return (
     <>
        <div className="pulse"></div>
        <div className="pin"></div>
        <div className="text">
            {text ? text : `Location ${index+1}`}
            <div className="location_input_container">
                <input className="location_input" type="text" placeholder="change location tag" onChange={e => setInputVal(e.target.value)} value={inputVal}/>
                <button className="location_submit" onClick={onUpdateName} >go</button>
            </div>
            <button className="location_delete" onClick={onMarkerDelete}> x </button>
        </div>
    </>
    )
}

interface IMapProps {
    mapData? : IMap
}

export const Map = ({mapData}: IMapProps) => {
    const { coordinates, setCoordinates, zoom, setZoom } = useContext(MapsContext);
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

    const apiIsLoaded = (map: any, maps: any ) => {
        /* console.log("maploaded"); */
        map.addListener('dblclick', (event: any) => {
            /* console.log(passedMarkers); */
            /* console.log(markers); */
            /* let retMarkers = getMarkers(); */
            /* console.log("returned markers: ", retMarkers); */
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
            /* console.log(newMarkers); */
        })
      };

      useEffect(() => {
          console.log("MapContext Markers: ", markers);
      }, [markers]);

    return (
        <div style={{width: "100%", height: "100%", position: "relative", top: "0", left: "0"}}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyArAlGMMvreircH6LgluU4xHTBDJR7KBzs"}}
                center={ !mapData ? coordinates : mapData.coordinates}
                zoom= { !mapData ? zoom : mapData.zoom}
                onChange={({center, zoom, bounds, marginBounds }) => {
                    updateCoordinates(center, zoom);
                }}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps)}
                options={{
                    disableDoubleClickZoom: true
                }}
            >
                {!mapData ? markers.map((marker, index) => <Marker lat={marker.lat} lng={marker.lng} key={index} text={marker.text} index={index} />)
                    : mapData.markers.map((marker, index) => <Marker lat={marker.lat} lng={marker.lng} key={index} text={marker.text} index={index} />)}
            </GoogleMapReact>
        </div>
    )
}