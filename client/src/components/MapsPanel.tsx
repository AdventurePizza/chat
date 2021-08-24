import React, { useContext, useState } from 'react';
import PlacesAutocomplete, {
	geocodeByAddress,
	getLatLng
} from 'react-places-autocomplete';
import './MapsPanel.css';

import { AppStateContext } from '../contexts/AppStateContext';
import { IMap } from '../types';

interface IMapsPanelProps {
	updateMap?: (mapData: IMap) => void;
	mapData?: IMap;
}

export const MapsPanel = ({updateMap, mapData} : IMapsPanelProps) => {
	const [address, setAddress] = useState('');

	const { socket } = useContext(AppStateContext);

	const handleSelect = async (value: string) => {
		const results = await geocodeByAddress(value);
		const latLng = await getLatLng(results[0]);
		setAddress(value);
		
		if(updateMap){
			updateMap({
				coordinates: latLng,
				markers: [...mapData!.markers].concat({
					...latLng,
					text: value
				}),
				zoom: 12}
			)
		}
		socket.emit('event', {
			key: 'map',
			func: 'add',
			marker: {
				lat: latLng.lat,
				lng: latLng.lng,
				text: value
			}
		})
	};

	return (
		<div className="maps-panel-container">

			<PlacesAutocomplete
				value={address}
				onChange={setAddress}
				onSelect={handleSelect}
			>
				{({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
					<div className="maps-input-container">
						<input {...getInputProps({ placeholder: 'Type address' })} />
						<div className="map-options-container">
							{suggestions.length > 0 && (
								<div className="map-input-options">
									{suggestions.map((suggestion, index) => {
										const style = {
											color: '#fff',
											backgroundColor: suggestion.active
												? 'rgb(135 211 243)'
												: 'rgb(33 33 33)',
											padding: '2px 5px'
										};

										return (
											<div
												{...getSuggestionItemProps(suggestion, { style })}
												key={index}
											>
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
