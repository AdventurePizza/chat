import { Button, TextField, makeStyles } from '@material-ui/core';
import React, { useMemo, useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../contexts/FirebaseContext';

const useStyles = makeStyles((theme) => ({
	horsePanelRoot: {
		padding: 20,
		display: 'flex',
		alignItems: 'center',
		'& > *': {
			marginRight: 10
		}
	}
}));

const baseURLRace = 'https://3d-racing.zed.run/';

interface IZedrunPanel {
	setRaceId: (raceId: string) => void;
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

export const ZedrunPanel = ({ setRaceId }: IZedrunPanel) => {
	const classes = useStyles();
	const [inputValue, setInputValue] = useState('');
	const firebaseContext = useContext(FirebaseContext);
	const [races, setRaces] = useState<IRace[]>([]);

	const roomId = useMemo(() => {
		if (inputValue.includes(baseURLRace)) {
			let textIndex = inputValue.indexOf('replay');

			if (textIndex !== -1) {
				return inputValue.slice(textIndex + 'replay/'.length);
			} else {
				textIndex = inputValue.indexOf('live');
				if (textIndex !== -1) {
					return inputValue.slice(textIndex + 'live/'.length);
				}
			}
		} else return inputValue;
	}, [inputValue]);

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
		<div className={classes.horsePanelRoot}>
			<TextField
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				variant="outlined"
				label="enter race id or url"
			/>
			<Button
				variant="contained"
				onClick={() => {
					setRaceId(roomId!);
				}}
			>
				{' '}
				Watch{' '}
			</Button>
			<Button
				variant="contained"
				onClick={() => {
					setRaceId('');
				}}
			>
				{' '}
				Close{' '}
			</Button>

			{races &&
				races.map((race, index) => (
					<div key={index.toString()}>
						{
							<Button
								onClick={() => {
									setRaceId(race.id);
								}}
							>
								{race.name}
							</Button>
						}
					</div>
				))}
		</div>
	);
};
