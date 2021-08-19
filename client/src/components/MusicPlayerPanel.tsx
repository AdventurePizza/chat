import React, { useRef, useState } from 'react';
import { StyledButton } from './shared/StyledButton';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, IconButton } from '@material-ui/core';
import { IMusicPlayer } from '../types';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import url from '../assets/buttons/url.png'

const useStyles = makeStyles({
	container: {
		display: 'flex',
		alignItems: 'center',
		padding: 10,
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
		'& > *': {
			marginRight: 10
		}
	},
	playlist: {
		overflowY: 'auto',
		height: 100,
		paddingLeft: 25
	},
	input: {
		borderRadius: 20,
		background: 'white'
	}
});

interface IMusicPlayerPanelProps {
	changePlaylist: (url: string, name: string) => void;
	musicPlayer: IMusicPlayer;
}

export const MusicPlayerPanel = ({
	changePlaylist,
	musicPlayer
}: IMusicPlayerPanelProps) => {
	const classes = useStyles();
	const [showURLPanel, setShowURLPanel] = useState<boolean>(false);
	const [showNFTPanel, setShowNFTPanel] = useState<boolean>(false);

	const [urlValue, setUrlValue] = useState('');
	const [nameValue, setNameValue] = useState('');

	const [valueAddress, setValueAddress] = useState('');
	const [valueTokenId, setValueTokenId] = useState('');

	const textfieldRef = useRef<HTMLDivElement>(null);
	const SMALL_SCREEN_WIDTH = 500;

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
		changePlaylist(urlValue, nameValue);
	};
	const remove = (index: number) => {
		changePlaylist(index.toString(), "remove");
	};

	const getNFT = async (address: string, tokenId: string) =>
		await axios.get('https://api.opensea.io/api/v1/assets?token_ids=' + tokenId + '&asset_contract_address=' + address + '&order_direction=desc&offset=0&limit=20');

	const addNFT = (address: string, tokenId: string) => {
		getNFT(address, tokenId).then((res) => {
			changePlaylist(res.data.assets[0].animation_url, res.data.assets[0].name);
		});
	};
	
	return (
		<div className={classes.container}>
			
			<IconButton 
				onClick={() => { 
					setShowNFTPanel(!showNFTPanel);
					setShowURLPanel(false);
					}}>
					<div style={{color: '#000000'}}>NFT</div>
			</IconButton>

			<IconButton 
				onClick={() => { 
					setShowNFTPanel(false);
					setShowURLPanel(!showURLPanel);
					}}>
					<img src={url} alt="url" width= "40" height= "40"/>
			</IconButton>


			{showURLPanel && <div className={classes.urlpanel}>

				<TextField
					autoFocus={window.innerWidth > SMALL_SCREEN_WIDTH}
					ref={textfieldRef}
					placeholder="type music url here"
					variant="outlined"
					value={urlValue}
					onChange={(e) => setUrlValue(e.target.value)}
					className={classes.input}
					onFocus={onFocus}
				/>

				<TextField
					autoFocus={window.innerWidth > SMALL_SCREEN_WIDTH}
					ref={textfieldRef}
					placeholder="type music name here"
					variant="outlined"
					value={nameValue}
					onChange={(e) => setNameValue(e.target.value)}
					className={classes.input}
					onFocus={onFocus}
				/>
				<StyledButton onClick={addMusic}>Add</StyledButton>

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

			<div className={classes.playlist}>
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
									{track.name}
								</Button>
							}
						</div>
					))
				}
			</div>	

		</div>
	);
};
