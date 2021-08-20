import { Button, TextField, makeStyles, IconButton } from '@material-ui/core';
import React, { useMemo, useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../contexts/FirebaseContext';
import watchIcon from '../assets/buttons/watch.png'
import closeIcon from '../assets/buttons/close.png'
import hide from '../assets/buttons/hide.png'

const useStyles = makeStyles({
	container: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'left',
		padding: 10,
		width: '100%',
		'& > *': {
			marginRight: 10
		}
		
	},
	input: {
		borderRadius: 20,
		background: 'white'
	}
});

const baseURLRace = 'https://3d-racing.zed.run/';

interface IRacePanel {
	sendRace: (id: string) => void;
	addRace: (id: string) => void;
	isBackground: boolean;
	hideAllPins: boolean;
	setHideAllPins: (value: boolean) => void;
}

interface IRace {
	id: string;
	name: string;
}

interface INode {
	node: {
		race_id: string;
		name: string;
	};
}

export const RacePanel = ({ sendRace, addRace, isBackground, hideAllPins, setHideAllPins }: IRacePanel) => {
	const classes = useStyles();
	const [inputRace, setinputRace] = useState('');
	const firebaseContext = useContext(FirebaseContext);
	const [races, setRaces] = useState<IRace[]>([]);

	const raceId = useMemo(() => {
		if (inputRace.includes(baseURLRace)) {
			let textIndex = inputRace.indexOf('replay');

			if (textIndex !== -1) {
				return inputRace.slice(textIndex + 'replay/'.length);
			} else {
				textIndex = inputRace.indexOf('live');
				if (textIndex !== -1) {
					return inputRace.slice(textIndex + 'live/'.length);
				}
			}
		} else return inputRace;
	}, [inputRace]);

	useEffect(() => {
		const getRaces = async () => {
			const res = await firebaseContext.getRaces();
			const resMessage = JSON.parse(JSON.stringify(res.message as string));
			const responseRaces = resMessage.data.get_race_results.edges.map(
				({ node }: INode) => {
					const { race_id, name } = node;
					return {
						id: race_id,
						name: name
					};
				}
			);
			setRaces(responseRaces);
		};
		getRaces();
	}, [firebaseContext]);

	return (
		<div className={classes.container}>
			
			<IconButton 
					onClick={() => { 
						setHideAllPins(!hideAllPins);
					}}>
					<img src={hide} alt="Hide" width= "30" height= "30"/>
			</IconButton>

			<div className={classes.container}>
				<TextField
					value={inputRace}
					onChange={(e) => setinputRace(e.target.value)}
					variant="outlined"
					placeholder="enter race id or url"
					className={classes.input}
				/>

				<IconButton 
					onClick={() => { 
						if(isBackground){
							sendRace(raceId!);
						}else{
							addRace(raceId!);
						}
					}}>
					<img src={watchIcon} alt="watch" width= "30" height= "30"/>
				</IconButton>

				<IconButton 
					onClick={() => { 
						sendRace('');
					}}>
					<img src={closeIcon} alt="close" width= "30" height= "30"/>
				</IconButton>

				{races &&
					races.map((race, index) => (
						<div key={index.toString()}>
							{
								<Button
									variant="contained" color="primary"
									onClick={() => {
										if(isBackground){
											sendRace(race.id);
										}else{
											addRace(race.id);
										}
									}}
								>
									{race.name}
								</Button>
							}
						</div>
					))}
			</div>
			

		</div>
	);
};