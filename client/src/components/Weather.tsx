import React, { useState } from 'react';

interface IWeatherProps {
	sendLocation: (location: string) => void;
}

export const Weather = ({ sendLocation }: IWeatherProps) => {
	const [location, setLocation] = useState<string>('');

	const handleLocationInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLocation(e.target.value);
		sendLocation(location);
	};

	return (
		<div>
			<input
				type="text"
				name="location"
				value={location}
				onChange={handleLocationInput}
			/>
			<label htmlFor="location">Enter you location</label>
		</div>
	);
};
