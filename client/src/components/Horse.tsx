import React, { useEffect, useRef } from 'react'
import { IHorse } from '../types';


interface IHorseProps {
	horse: IHorse;
}

export const Horse = ({ horse }: IHorseProps) => {

	return (
			<div>
                <div><img alt={horse.name} src={horse.image} style={{ width: 180 }} /></div>
                {horse.name}
			</div>
	);
};
