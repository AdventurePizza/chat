import React, { useRef, useState } from 'react';
import { StyledButton } from './shared/StyledButton';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core';
import { IMusicPlayer } from '../types';

const useStyles = makeStyles({
	container: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
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

interface IMusicPlayerPanelProps {
	changePlaylist: (message: string) => void;
	musicPlayer: IMusicPlayer;
}

export const MusicPlayerPanel = ({
	changePlaylist,
	musicPlayer
}: IMusicPlayerPanelProps) => {
	const classes = useStyles();

	const [urlValue, setUrlValue] = useState('');
	const textfieldRef = useRef<HTMLDivElement>(null);

	const onChangeUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUrlValue(event.target.value);
	};

	const onKeyPressEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			addMusic();
			setUrlValue("");
		}
	};

	const onFocus = () => {
		if (window.innerWidth < 500 && textfieldRef.current) {
			const offsetTop = textfieldRef.current.offsetTop;
			document.body.scrollTop = offsetTop;
		}
	};

	const addMusic = () => {
		changePlaylist(urlValue);
	};
	const remove = (index: number) => {
		changePlaylist(index.toString());
	};

	const Beethoven = () => {
	
		switch(Math.floor(Math.random() * 6)) {
			case 0:
				changePlaylist('http://www.download2mp3.com/beethoven_htm_files/Beethoven%20Military%20March.mp3');
			  break;
			case 1:
				changePlaylist('http://www.download2mp3.com/beethoven_htm_files/Beethoven%20Turkish%20March.mp3');
			  break;
			case 2:
				changePlaylist('http://www.download2mp3.com/beethoven_htm_files/Bagatelle%201.mp3');
			break;
			case 3:
				changePlaylist('http://www.download2mp3.com/beethoven_htm_files/BeethovenRondo51_1.mp3');
			break;
			case 4:
				changePlaylist('http://www.download2mp3.com/beethoven_htm_files/BeethovenMoonlight1.mp3');
			break;
			default:
				changePlaylist('http://www.download2mp3.com/beethoven_htm_files/LVB_EmperorConcerto.mp3');
		  }
	};
	
	const Mozart = () => {
	
		switch(Math.floor(Math.random() * 6)) {
			case 0:
				changePlaylist('http://www.download2mp3.com/mozart_htm_files/Mozart%20Symphony%20No25-1.mp3');
			  break;
			case 1:
				changePlaylist('http://www.download2mp3.com/mozart_htm_files/Mozart%20Eine%20Kleine%20Nacht%20Musik.mp3');
			  break;
			case 2:
				changePlaylist('http://www.download2mp3.com/mozart_htm_files/Mozart%20Marriage%20of%20Figaro.mp3');
			break;
			case 3:
				changePlaylist('http://www.download2mp3.com/mozart_htm_files/Mozart%20Mechanical%20Organ%20Piece.mp3');
			break;
			case 4:
				changePlaylist('http://www.download2mp3.com/mozart_htm_files/Mozart%20K478%20Mvt%201.mp3');
			break;
			default:
				changePlaylist('http://www.download2mp3.com/mozart_htm_files/Mozart%20Bassoon%20Concerto.mp3');
		  }
	};

	return (
		<div className={classes.container}>
			<StyledButton onClick={Beethoven}>Beethoven</StyledButton>
			<StyledButton onClick={Mozart}>Mozart</StyledButton>

			<TextField
				autoFocus={window.innerWidth > 500}
				ref={textfieldRef}
				placeholder="type music url here"
				variant="outlined"
				value={urlValue}
				onChange={onChangeUrl}
				onKeyPress={onKeyPressEnter}
				className={classes.input}
				onFocus={onFocus}
			/>
			<StyledButton onClick={addMusic}>Add Music</StyledButton>

			<div style={{overflowY: 'auto', height: 100}} > 
				{musicPlayer &&
					musicPlayer.playlist.map((track, index) => (
						<div key={index.toString() } style={{ width: 300, clear: 'left'}}>
							{
								<Button
									onClick={() => {
										remove(index);
									}}
									variant="contained" color="primary"  style={{width: 300}}
								>
									{track.url.slice(track.url.length-31, track.url.length-1)}
								</Button>
							}
						</div>
					))
				}
			</div>	
		</div>
	);
};
