import GoogleMapReact from 'google-map-react';
import React from 'react';
import { useContext, useState } from 'react';
import { AppStateContext } from '../contexts/AppStateContext';
import './Marker.css';
import { IMap } from '../types';

interface IMarkerProps {
	lat: number;
	lng: number;
	text?: string;
	index: number;
	removeMarker: (index: number) => void;
	updateMarker: (index: number, text: string) => void;
}

const Marker = ({ lat, lng, text, index, removeMarker, updateMarker }: IMarkerProps) => {
	const [inputVal, setInputVal] = useState('');
	const { socket } = useContext(AppStateContext);
	const [keepOpen, setKeepOpen] = useState(false);

	const onUpdateName = () => {
		updateMarker(index, inputVal);
		setInputVal('');
		socket.emit('event', {
			key: 'map',
			func: 'update-marker',
			index,
			text: inputVal
		})
	};

	const onMarkerDelete = () => {
		removeMarker(index);
		socket.emit('event', {
			key: 'map',
			func: 'remove-marker',
			index
		})
	};

	return (
		<>
			<div className="pulse"></div>
			<div className="pin" onClick={() => setKeepOpen(!keepOpen)}></div>
			<div className={keepOpen ? "text text-important" : "text"}>
				{text ? text : `Marker ${index + 1}`}
				<div className="location_input_container">
					<input
						className="location_input"
						type="text"
						placeholder="change location tag"
						onChange={(e) => setInputVal(e.target.value)}
						value={inputVal}
					/>
					<div className="location_submit" onClick={onUpdateName}>
					&#x279C;
					</div>
				</div>
				<button className="location_delete" onClick={onMarkerDelete}>
					{' '}
					x{' '}
				</button>
			</div>
		</>
	);
};

interface IMapProps {
	mapData: IMap;
	updateMap: (data: IMap) => void;
	addNewMarker: (coordinates: {lat: number, lng: number, text: string}) => void;
	removeMarker: (index: number) => void;
	updateMarker: (index: number, text: string) => void;
	showMap: boolean;
}

export const Map = ({ 
	mapData, 
	updateMap, 
	addNewMarker,
	removeMarker,
	updateMarker,
	showMap
	}: IMapProps) => {
	const { socket } = useContext(AppStateContext);

	const onChangeCoordinates = (
		newCoordinates: { lat: number; lng: number },
		newZoom: number
		) => {
			const newMapData = {
				coordinates : newCoordinates,
				markers : mapData.markers,
				zoom: newZoom
			}
			updateMap(newMapData);
			
			socket.emit('event', {
				key: 'map',
				func: 'update',
				mapData: newMapData
			});
	};

	const apiIsLoaded = (map: any, maps: any) => {
		map.addListener('dblclick', (event: any) => {
			addNewMarker({
				lat: event.latLng.lat(),
				lng: event.latLng.lng(),
				text: ""
			}); 
			
			socket.emit('event', {
				key: 'map',
				func: 'add-marker',
				marker: {
					lat: event.latLng.lat(),
					lng: event.latLng.lng(),
					text: ""
				}
			})
		});
	};

	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				position: 'relative',
				top: '0',
				left: '0',
				display: showMap ? 'block' : 'none'
			}}
		>
			<GoogleMapReact
				bootstrapURLKeys={{ key: 'AIzaSyArAlGMMvreircH6LgluU4xHTBDJR7KBzs' }}
				center={mapData.coordinates}
				zoom={mapData.zoom}
				onChange={({ center, zoom, bounds, marginBounds }) => {
					onChangeCoordinates(center, zoom);
				}}
				yesIWantToUseGoogleMapApiInternals
				onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps)}
				options={{
					disableDoubleClickZoom: true
				}}
			>
				{mapData.markers.map((marker, index) => (
							<Marker
								lat={marker.lat}
								lng={marker.lng}
								key={index}
								text={marker.text}
								index={index}
								removeMarker={removeMarker}
								updateMarker={updateMarker}
							/>
					  ))}
			</GoogleMapReact>
		</div>
	);
};
