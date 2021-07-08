import React, { useContext, useState } from "react";
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
  } from 'react-places-autocomplete';
import "./MapsPanel.css"

import { MapsContext } from "../contexts/MapsContext";

import {
	FormControlLabel,
	Switch
} from '@material-ui/core';
import { AppStateContext } from "../contexts/AppStateContext";


export const MapsPanel = () => {
	const [address, setAddress] = useState("");

    const {coordinates, setCoordinates, markerCoordinates, setMarkerCoordinates, isMapShowing, setIsMapShowing} = useContext(MapsContext);
    const { socket } = useContext(AppStateContext);

    const handleSelect = async (value : string)  => {
        const results =  await geocodeByAddress(value);
        const latLng = await getLatLng(results[0]);
        setAddress(value);
        setCoordinates(latLng);
        setMarkerCoordinates(latLng);
        setIsMapShowing(true);


        socket.emit('event', {
            key: 'map',
            coordinates: coordinates,
            markerCoordinates: latLng
        });
    }

	return (
		<div className="maps-panel-container">
			<div style={{ display: 'flex' }}>
					<FormControlLabel
						checked={isMapShowing}
						onChange={() => {
                            const newVal = !isMapShowing;
                            setIsMapShowing(newVal);
                            socket.emit('event', {
                                key: 'map',
                                isMapShowing: newVal
                            });
                        }}
						control={<Switch color="primary" />}
						label="show map"
					/>
				</div>

			<PlacesAutocomplete
                value={address}
                onChange={setAddress}
                onSelect={handleSelect}
                >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div className="maps-input-container"> 
                        <input {...getInputProps({placeholder: "Type address"})} />
                        <div className="map-options-container">
                            { suggestions.length > 0 && (
                                <div className="map-input-options">
                                {suggestions.map((suggestion, index) => {
                                    const style = {
                                        color: "#fff",
                                        backgroundColor: suggestion.active ? "rgb(135 211 243)" : "rgb(33 33 33)",
                                        padding: "2px 5px"
                                    }

                                        return (
                                            <div {...getSuggestionItemProps(suggestion, { style })} key={index}>
                                                {suggestion.description}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                        </div>
                        
                    </div>
                )}
            </PlacesAutocomplete>
		</div>
	);
};