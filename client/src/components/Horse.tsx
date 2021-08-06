import React, { useEffect, useRef } from 'react'
import { IHorse } from '../types';


interface IHorseProps {
	horse: IHorse;
}
/**
 * 
 * @param param0 {	bloodline: res.data.bloodline,
					breed_type: res.data.breed_type,
					breeding_counter: res.data.breeding_counter,
					breeding_cycle_reset: res.data.breeding_cycle_reset,
					class: res.data.class,
					genotype: res.data.genotype,
					color: res.data.hash_info.color,
					hex_code: res.data.hash_info.hex_code,
					name: res.data.hash_info.name,	
					horse_type: res.data.horse_type,
					img_url: res.data.img_url,
					is_approved_for_racing: res.data.is_approved_for_racing.toString(),
					is_in_stud: res.data.is_in_stud.toString(),
					is_on_racing_contract: res.data.is_on_racing_contract.toString(),
					mating_price: res.data.mating_price,
					number_of_races: res.data.number_of_races,
					owner: res.data.owner,
					owner_stable: res.data.owner_stable,
					owner_stable_slug: res.data.owner_stable_slug,
					rating: res.data.rating,
					super_coat: res.data.super_coat.toString(),
					tx: res.data.tx,
					tx_date: res.data.tx_date,
					win_rate: res.data.win_rate,
				},
 * @returns 
 */
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
