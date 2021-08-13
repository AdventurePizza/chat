import React, { useRef, useState } from 'react';
import { StyledButton } from './shared/StyledButton';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core';
import { IMusicPlayer } from '../types';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const useStyles = makeStyles({
	container: {
		display: 'flex',
		alignItems: 'center',
		padding: 10,
		background: 'var(--background)',
		width: '100%',
		'& > *': {
			marginRight: 10
		}
	},
	urlpanel: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		paddingLeft: 50,
		background: 'var(--background)',
		'& > *': {
			marginRight: 10
		}
	},
	musicPlayer:{
		overflowY: 'auto',
		height: 100,
		paddingLeft: 25,
	},
	input: {
		borderRadius: 20,
		background: 'white'
	}
});

interface IMusicPlayerPanelProps {
	changePlaylist: (url: string, name?: string) => void;
	musicPlayer: IMusicPlayer;
}

export const MusicPlayerPanel = ({
	changePlaylist,
	musicPlayer
}: IMusicPlayerPanelProps) => {
	const classes = useStyles();

	const [urlValue, setUrlValue] = useState('');
	const [showURLPanel, setShowURLPanel] = useState<boolean>(false);
	const [showNFTPanel, setShowNFTPanel] = useState<boolean>(false);

	const [valueAddress, setValueAddress] = useState('');
	const [valueTokenId, setValueTokenId] = useState('');

	const textfieldRef = useRef<HTMLDivElement>(null);
	const SMALL_SCREEN_WIDTH = 500;
	const beethovenPlaylist = [
		'https://archive.org/download/BeethovenSymphonyNo.8/01.allegroVivaceEConBrio.mp3',
		'https://archive.org/download/BeethovenSymphonyNo.8/02.scherzandoAllegretto.mp3',
		'https://archive.org/download/BeethovenSymphonyNo.8/03.tempoDiMenuetto.mp3',
		'https://archive.org/download/BeethovenPianoConcerto5Emperor/BeethovenEmperor.mp3',
		'https://archive.org/download/cd_ligeti-beethoven_ligeti-beethoven-jeremy-denk-gyrgy-ligeti_0/disc1/01.%20Gy%C3%B6rgy%20Ligeti%20-%20Piano%20%C3%89tudes%20-%20Book%20One%20-%20I.%20D%C3%A9sordre_sample.mp3',
		'https://archive.org/download/cd_ligeti-beethoven_ligeti-beethoven-jeremy-denk-gyrgy-ligeti_0/disc1/12.%20Gy%C3%B6rgy%20Ligeti%20-%20Piano%20%C3%89tudes%20-%20Book%20Two%20-%20X.%20Der%20Zauberlehrling_sample.mp3'];
	const mozartPlaylist = 
		['https://archive.org/download/maurerischetrauermusik/09%20-%20Maurerische%20Trauermusik%2C%20K.%20477.mp3',
		'https://archive.org/download/cd_mozart_wolfgang-amadeus-mozart-richard-goode/disc1/01.%20Wolfgang%20Amadeus%20Mozart%20-%20Sonata%20in%20A%20minor%2C%20K.%20310%20-%20Allegro%20maestoso_sample.mp3',
		'https://archive.org/download/cd_mozart_wolfgang-amadeus-mozart-richard-goode/disc1/02.%20Wolfgang%20Amadeus%20Mozart%20-%20Sonata%20in%20A%20minor%2C%20K.%20310%20-%20Andante%20cantabile_sample.mp3',
		'https://archive.org/download/cd_mozart_wolfgang-amadeus-mozart-richard-goode/disc1/03.%20Wolfgang%20Amadeus%20Mozart%20-%20Sonata%20in%20A%20minor%2C%20K.%20310%20-%20Presto_sample.mp3',
		'https://archive.org/download/cd_mozart_wolfgang-amadeus-mozart-richard-goode/disc1/04.%20Wolfgang%20Amadeus%20Mozart%20-%20March%20in%20C%20major%2C%20K.%20408_sample.mp3',
		'https://archive.org/download/cd_mozart_wolfgang-amadeus-mozart-richard-goode/disc1/10.%20Wolfgang%20Amadeus%20Mozart%20-%20Sonata%20in%20F%20major%2C%20K.%20533-494%20-%20Allegretto_sample.mp3',
		'https://archive.org/download/cd_mozart_wolfgang-amadeus-mozart-richard-goode/disc1/07.%20Wolfgang%20Amadeus%20Mozart%20-%20Rondo%20in%20A%20minor%2C%20K.%20511_sample.mp3'];
	const TRACK_NAME_LENGTH = 31;
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
		if (window.innerWidth < SMALL_SCREEN_WIDTH && textfieldRef.current) {
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
		changePlaylist(beethovenPlaylist[(Math.floor(Math.random() * 6))]);
	};
	
	const Mozart = () => {
		changePlaylist(mozartPlaylist[(Math.floor(Math.random() * 6))]);
	};


	const getNFT = async (address: string, tokenId: string) =>
		await axios.get('https://api.opensea.io/api/v1/assets?token_ids=' + tokenId + '&asset_contract_address=' + address + '&order_direction=desc&offset=0&limit=20');

	const addNFT = (address: string, tokenId: string) => {
		getNFT(address, tokenId).then((res) => {
			console.log("nny: " +  res.data.assets[0].name);
			console.log("add: " +  address);
			console.log("tok: " +  tokenId);
			changePlaylist(res.data.assets[0].animation_url, res.data.assets[0].name);
		});
	};
	
	return (
		<div className={classes.container}>
			<StyledButton onClick={() => { setShowURLPanel(!showURLPanel)}}>URL</StyledButton>
			<StyledButton onClick={() => { setShowNFTPanel(!showNFTPanel)}}>NFT</StyledButton>

			<div  className={classes.musicPlayer}>
				{musicPlayer &&
					musicPlayer.playlist.map((track, index) => (
						<div key={uuidv4()} style={{ width: 300, clear: 'left'}}>
							{
								<Button
									onClick={() => {
										remove(index);
									}}
									variant="contained" color="primary"  style={{width: 300}}
								>
									{track.url.slice(track.url.length-TRACK_NAME_LENGTH, track.url.length-1)}
								</Button>
							}
						</div>
					))
				}
			</div>	

			{showURLPanel && <div className={classes.urlpanel}>
				<StyledButton onClick={Beethoven}>Beethoven</StyledButton>
				<StyledButton onClick={Mozart}>Mozart</StyledButton>

				<TextField
					autoFocus={window.innerWidth > SMALL_SCREEN_WIDTH}
					ref={textfieldRef}
					placeholder="type music url here"
					variant="outlined"
					value={urlValue}
					onChange={onChangeUrl}
					className={classes.input}
					onFocus={onFocus}
				/>
				<StyledButton onClick={addMusic}>Add Music</StyledButton>

			</div>
			}

			{showNFTPanel && <div className={classes.urlpanel}>
				<TextField
					autoFocus={window.innerWidth > SMALL_SCREEN_WIDTH}
					ref={textfieldRef}
					placeholder="enter contract address"
					variant="outlined"
					value={valueAddress}
					onChange={(e) => setValueAddress(e.target.value)}
					onKeyPress={onKeyPressEnter}
					className={classes.input}
					onFocus={onFocus}
				/>

				<TextField
					autoFocus={window.innerWidth > SMALL_SCREEN_WIDTH}
					ref={textfieldRef}
					placeholder="enter token id"
					variant="outlined"
					value={valueTokenId}
					onChange={(e) => setValueTokenId(e.target.value)}
					className={classes.input}
					onFocus={onFocus}
				/>

				<StyledButton onClick={() => { addNFT(valueAddress, valueTokenId) }}>Add</StyledButton>

			</div>
			}


		</div>
	);
};
