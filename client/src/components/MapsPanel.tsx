import React, { useContext, useState } from "react";
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
  } from 'react-places-autocomplete';
import "./Weather.css"

import { MapsContext } from "../contexts/MapsContext";

import {
	FormControlLabel,
	Switch
} from '@material-ui/core';


export const MapsPanel = () => {
	const [address, setAddress] = useState("");
	/* const [coordinates, setCoordinates] = useState({
		lat: 0,
		lng: 0
	}) */

    const {lat, setLat, lng, setLng, isMapShowing, setIsMapShowing} = useContext(MapsContext);

    const handleSelect = async (value : string)  => {
        const results =  await geocodeByAddress(value);
        const latLng = await getLatLng(results[0]);
        setAddress(value);
        /* setCoordinates(latLng); */
        setLat(latLng.lat);
        setLng(latLng.lng);
    }

	return (
		<div className="location-input-container">
			<div style={{ display: 'flex' }}>
					<FormControlLabel
						checked={isMapShowing}
						onChange={() => setIsMapShowing(!isMapShowing)}
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
                    <div>
                        <p>Latitude: {/* coordinates. */lat}</p>
                        <p>Longitude: {/* coordinates. */lng}</p>


                        <input {...getInputProps({placeholder: "Type address"})}/>
                        <div>
                            {suggestions.map((suggestion, index) => {
                                const style = {
                                    backgroundColor: suggestion.active ? "#41b6e6" : "#fff"
                                }

                                return (
                                    <div {...getSuggestionItemProps(suggestion, { style })} key={index}>
                                        {suggestion.description}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </PlacesAutocomplete>
		</div>
	);
};