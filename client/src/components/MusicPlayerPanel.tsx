import React, { useRef, useState } from 'react';
import { StyledButton } from './shared/StyledButton';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';

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
}

export const MusicPlayerPanel = ({
	changePlaylist
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
	const addSong2 = () => {
		changePlaylist('http://res.cloudinary.com/alick/video/upload/v1502375674/Bedtime_Stories.mp3');
	};
	const addSong = () => {
		changePlaylist('https://hanzluo.s3-us-west-1.amazonaws.com/music/suipian.mp3');
	};
	const removeFirst = () => {
		changePlaylist('-1');
	};
	const clear = () => {
		changePlaylist('clear');
	};
	const addMusic = () => {
		changePlaylist(urlValue);
	};

	return (
		<div className={classes.container}>
			<StyledButton onClick={addSong}>suipian</StyledButton>
			<StyledButton onClick={addSong2}>b t s </StyledButton>
			<StyledButton onClick={removeFirst}>remove 0</StyledButton>
			<StyledButton onClick={clear}>clear</StyledButton>

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
		</div>
	);
};
