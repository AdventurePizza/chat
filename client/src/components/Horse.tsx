import React from 'react'
import { IHorse } from '../types';

interface IHorseProps {
	horse: IHorse;
}

export const Horse = ({ horse }: IHorseProps) => {

	return (
			<div>
                <div><img alt={horse.name} src={horse.img_url} style={{ width: 180 }} /></div>
				<div> name: {horse.name} </div>
				<div> breeding counter: {horse.breeding_counter} </div>
				<div> breeding_cycle_reset: {horse.breeding_cycle_reset} </div>
				<div> class: {horse.class} </div>
				<div> genotype: {horse.genotype} </div>
				<div> color: {horse.color} </div>
				<div> hex_code: {horse.hex_code} </div>
				<div> horse_type: {horse.horse_type} </div>
				<div> is_approved_for_racing: {horse.is_approved_for_racing} </div>
				<div> is_in_stud: {horse.is_in_stud} </div>
				<div> is_on_racing_contract: {horse.is_on_racing_contract} </div>
				<div> mating_price: {horse.mating_price} </div>
				<div> number_of_races: {horse.number_of_races} </div>
				<div> owner: {horse.owner} </div>
				<div> owner_stable: {horse.owner_stable} </div>
				<div> owner_stable_slug: {horse.owner_stable_slug} </div>
				<div> rating: {horse.rating} </div>
				<div> super_coat: {horse.super_coat} </div>
				<div> tx: {horse.tx} </div>
				<div> tx_date: {horse.tx_date} </div>
				<div> win_rate: {horse.win_rate} </div>
			</div>
	);
};
