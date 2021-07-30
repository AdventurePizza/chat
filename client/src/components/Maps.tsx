import GoogleMapReact from 'google-map-react';
import React from 'react';
import { useContext, useState } from 'react';
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
	const [keepOpen, setKeepOpen] = useState(false);

	const onUpdateName = () => {
		updateMarkerText(index, inputVal);
		setInputVal('');
		socket.emit('event', {
			key: 'map',
			func: 'update',
			index,
			text: inputVal
		})
	};

	const onMarkerDelete = () => {
		deleteMarker(index);
		socket.emit('event', {
			key: 'map',
			func: 'delete',
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
			socket.emit('event', {
				key: 'map',
				func: 'add',
				marker: {
					lat: event.latLng.lat(),
					lng: event.latLng.lng()
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
