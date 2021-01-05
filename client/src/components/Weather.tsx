import React, { useState } from 'react';
import './Weather.css';

interface IWeatherProps {
	sendLocation: (location: string) => void;
}

export const Weather = ({ sendLocation }: IWeatherProps) => {
	const [location, setLocation] = useState<string>('');

	const handleLocationInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLocation(e.target.value);
	};

	const handleClick = () => {
		sendLocation(location);
	};

	return (
		<div className="location-input-container">
			<input
				type="text"
				name="location"
				value={location}
				onChange={handleLocationInput}
				placeholder="Enter your location"
			/>
			<button onClick={handleClick}>See weather result</button>
		</div>
	);
};
