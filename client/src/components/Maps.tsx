import GoogleMapReact from 'google-map-react';
import React from 'react';
import { useContext, useState, useEffect } from 'react';
import { MapsContext } from '../contexts/MapsContext';
import { AppStateContext } from '../contexts/AppStateContext';
import './Marker.css';
import { IMap } from '../types';

interface IMarkerProps {
	lat: number;
	lng: number;
	text?: string;
	index: number;
}

const Marker = ({ lat, lng, text, index }: IMarkerProps) => {
	const [inputVal, setInputVal] = useState('');
	const { deleteMarker, updateMarkerText } = useContext(MapsContext);
	const { socket } = useContext(AppStateContext);

	const onUpdateName = () => {
		updateMarkerText(index, inputVal);
		setInputVal('');
		// socket.emit('event', {
		// 	key: 'map',
		// 	markers: newMarkers
		// });
	};

	const onMarkerDelete = () => {
		deleteMarker(index);
		// socket.emit('event', {
		// 	key: 'map',
		// 	markers: newMarkers
		// });
	};

	return (
		<>
			<div className="pulse"></div>
			<div className="pin"></div>
			<div className="text">
				{text ? text : `Location ${index + 1}`}
				<div className="location_input_container">
					<input
						className="location_input"
						type="text"
						placeholder="change location tag"
						onChange={(e) => setInputVal(e.target.value)}
						value={inputVal}
					/>
					<button className="location_submit" onClick={onUpdateName}>
						go
					</button>
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
	mapData?: IMap;
}

export const Map = ({ mapData }: IMapProps) => {
	const {
		coordinates,
		updateCoordinates,
		zoom,
		updateZoom,
		addMarker,
		markers
	} = useContext(MapsContext);
	const { socket } = useContext(AppStateContext);

	const onChangeCoordinates = (
		newCoordinates: { lat: number; lng: number },
		newZoom: number
	) => {
		updateCoordinates(newCoordinates);
		updateZoom(newZoom);
		socket.emit('event', {
			key: 'map',
			coordinates: newCoordinates,
			zoom: newZoom
		});
	};

	const apiIsLoaded = (map: any, maps: any) => {
		map.addListener('dblclick', (event: any) => {
			addMarker({
				lat: event.latLng.lat(),
				lng: event.latLng.lng()
			});
			/* console.log(markers); */
			// setMarkers(markers => markers.concat(
			// 	lat: event.latLng.lat(),
			// 	lng: event.latLng.lng()
			// ))
			// console.log('adding new marker');
			// markers.push({
			// 	lat: event.latLng.lat(),
			// 	lng: event.latLng.lng()
			// });
			// const newMarkers = [...markers];
			// setMarkers(newMarkers);
			// socket.emit('event', {
			// 	key: 'map',
			// 	markers: newMarkers
			// });
			/* console.log(newMarkers); */
		});
	};

	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				position: 'relative',
				top: '0',
				left: '0'
			}}
		>
			<GoogleMapReact
				bootstrapURLKeys={{ key: 'AIzaSyArAlGMMvreircH6LgluU4xHTBDJR7KBzs' }}
				center={!mapData ? coordinates : mapData.coordinates}
				zoom={!mapData ? zoom : mapData.zoom}
				onChange={({ center, zoom, bounds, marginBounds }) => {
					onChangeCoordinates(center, zoom);
				}}
				yesIWantToUseGoogleMapApiInternals
				onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps)}
				options={{
					disableDoubleClickZoom: true
				}}
			>
				{!mapData
					? markers.map((marker, index) => (
							<Marker
								lat={marker.lat}
								lng={marker.lng}
								key={index}
								text={marker.text}
								index={index}
							/>
					  ))
					: mapData.markers.map((marker, index) => (
							<Marker
								lat={marker.lat}
								lng={marker.lng}
								key={index}
								text={marker.text}
								index={index}
							/>
					  ))}
			</GoogleMapReact>
		</div>
	);
};
