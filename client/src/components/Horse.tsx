import React from 'react'
import { IHorse } from '../types';
import bloodline from '../assets/horse-view/bloodline.png'
import genotype from '../assets/horse-view/genotype.png'
import gender from '../assets/horse-view/gender.png'
import color from '../assets/horse-view/color.png'
import race from '../assets/horse-view/race.png'
import trophy from '../assets/horse-view/trophy.png'
import hClass from '../assets/horse-view/class.png'
import offspring from '../assets/horse-view/offspring.png'
import rating from '../assets/horse-view/rating.png'
import supercoat from '../assets/horse-view/super-coat.png'

interface IHorseProps {
	horse: IHorse;
}

export const Horse = ({ horse }: IHorseProps) => {

	let horseSpecs: { title: string, value: string, image: string }[] = [
		{ "title": "BLOODLINE", "value": horse.bloodline,  "image": bloodline},
		{ "title": "GENOTYPE", "value": horse.genotype,  "image": genotype},
		{ "title": "GENDER", "value": horse.horse_type,  "image": gender},
		{ "title": "COAT COLOR", "value": horse.color,  "image": color},
		{ "title": "RACE", "value": horse.number_of_races,  "image": race},
		{ "title": "WIN RATE", "value": horse.win_rate,  "image": trophy},
		{ "title": "CLASS", "value": horse.class,  "image": hClass},
		{ "title": "OFFSPRING", "value": horse.breeding_counter,  "image": offspring},
		{ "title": "RATING", "value": horse.rating,  "image": rating},
		{ "title": "SUPER COAT", "value": horse.super_coat,  "image": supercoat},
	];

	return (
			<div className='horse-view' >
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#' + horse.hex_code }}> {horse.name} </div>
                <div><img alt={horse.name} src={horse.img_url} style={{ width: 180 }} /> </div>

				{horseSpecs.map((h, index) =>
					<div key={index.toString()} className='horse-spec' >
						<img alt={horse.name} src={h.image} style={{ width: 23}}/>
						<div className= 'horse-spec-text'>
							<div style={{ fontSize:12, fontWeight: 'bold', color: '#' + horse.hex_code}}> {h.title} </div>
							<div style={{ fontSize:15 }}>{h.value}</div>
						</div>
					</div>	
				)}

				<div className='horse-spec'  >
					<a style= {{ fontWeight: 'bold', color: '#' + horse.hex_code}} href={"https://polygonscan.com/address/" + horse.owner} >Owner</a>
				</div>

				<div className='horse-spec' >
					<a style= {{ fontWeight: 'bold', color: '#' + horse.hex_code}} href={"https://zed.run/stable/" + horse.owner_stable_slug} >Owner Stable</a>
				</div>
				
			</div>
	);
};
