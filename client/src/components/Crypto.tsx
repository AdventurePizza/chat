import { Button, TextField, makeStyles, IconButton } from '@material-ui/core';
import React, { useMemo, useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../contexts/FirebaseContext';
import broswseNFTIcon from '../assets/buttons/browseNFTIcon.png'
import horseIcon from '../assets/buttons/horse.svg'
import watchIcon from '../assets/buttons/watch.png'
import closeIcon from '../assets/buttons/close.png'


const useStyles = makeStyles({
	container: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'left',
		padding: 10,
		background: 'var(--background)',
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

interface ICryptoPanel {
	sendRace: (id: string) => void;
	showOpensea: boolean;
	setShowOpensea: (value: boolean) => void;
	setHideAllPins: (value: boolean) => void;
	sendHorse: (id: string, type: 'horse') => void;
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

export const CryptoPanel = ({ sendRace, showOpensea, setShowOpensea, setHideAllPins, sendHorse }: ICryptoPanel) => {
	const classes = useStyles();
	const [inputRace, setinputRace] = useState('');
	const firebaseContext = useContext(FirebaseContext);
	const [races, setRaces] = useState<IRace[]>([]);
	const [showRacePanel, setShowRacePanel] = useState<boolean>(false);
	const [showHorsePanel, setShowHorsePanel] = useState<boolean>(false);
	const [inputHorse, setInputHorse] = useState('');

	const roomId = useMemo(() => {
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
						setShowOpensea(!showOpensea);
						setHideAllPins(!showOpensea);
						setShowHorsePanel(false);
						setShowRacePanel(false);
					}}>
					<img src={broswseNFTIcon} alt="opensea" width= "50" height= "50"/>
			</IconButton>

			<IconButton 
					onClick={() => { 
						setShowRacePanel(!showRacePanel);
						setShowHorsePanel(false);
						setShowOpensea(false);
					}}>
					<img src={watchIcon} alt="zedrun" width= "50" height= "50"/>
			</IconButton>

			<IconButton 
					onClick={() => { 
						setShowHorsePanel(!showHorsePanel);
						setShowRacePanel(false);
						setShowOpensea(false);
					}}>
					<img src={horseIcon} alt="Horse-panel" width= "50" height= "50"/>
			</IconButton>

			{showRacePanel && <div className={classes.container}>
				<TextField
					value={inputRace}
					onChange={(e) => setinputRace(e.target.value)}
					variant="outlined"
					placeholder="enter race id or url"
					className={classes.input}
				/>

				<IconButton 
					onClick={() => { 
						setHideAllPins(true);
						sendRace(roomId!);
					}}>
					<img src={watchIcon} alt="watch" width= "30" height= "30"/>
				</IconButton>

				<IconButton 
					onClick={() => { 
						sendRace('');
						setHideAllPins(false);
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
										sendRace(race.id);
										setHideAllPins(true);
									}}
								>
									{race.name}
								</Button>
							}
						</div>
					))}
			</div>
			}
			{showHorsePanel && <div className={classes.container}>
				<TextField
					value={inputHorse}
					onChange={(e) => setInputHorse(e.target.value)}
					variant="outlined"
					placeholder="enter horse id"
					className={classes.input}
				/>
				<Button
					variant="contained" color="primary"
					onClick={() => {
						sendHorse (inputHorse, 'horse');
					}}
				>
					Add
				</Button>
			</div>
			}

		</div>
	);
};