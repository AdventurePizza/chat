import './Gifs.css';

import {
	Carousel,
	Gif,
	SearchBar,
	SearchContext,
	SearchContextManager,
	SuggestionBar
} from '@giphy/react-components';
import { IconButton, Paper, Tooltip } from '@material-ui/core';
import React, { useContext } from 'react';

import { Cancel } from '@material-ui/icons';
import { IGif } from '@giphy/js-types';
import { IGifs } from '../types';
import { makeStyles } from '@material-ui/core/styles';
import pushPinIcon from '../assets/push-pin.svg';
import { useParams } from 'react-router';

const API_KEY = 'A7O4CiyZj72oLKEX2WvgZjMRS7g4jqS4';
interface IGifsProps {
	//Gif data IGif
	sendGif: (gif: IGif) => void;
}

const useStyles = makeStyles({
	pushPin: {
		width: 25,
		height: 25
	},
	paper: {
		padding: 5
	},
	buttonList: {
		display: 'flex',
		flexDirection: 'column'
	}
});

const GifComponent = ({ sendGif }: IGifsProps) => {
	const { fetchGifs, searchKey } = useContext(SearchContext);
	return (
		<div className="gif-container">
			<SearchBar />
			<SuggestionBar />
			<Carousel
				key={searchKey}
				gifHeight={130}
				gutter={6}
				fetchGifs={fetchGifs}
				onGifClick={sendGif}
				noLink={true}
			/>
		</div>
	);
};

export const Gifs = ({ sendGif }: IGifsProps) => {
	return (
		<SearchContextManager initialTerm="hello" apiKey={API_KEY}>
			<GifComponent sendGif={sendGif} />
		</SearchContextManager>
	);
};

type BoardGifProps = IGifs & { onPin: () => void; onUnpin: () => void };

export const BoardGif = ({
	top,
	left,
	data,
	onPin,
	onUnpin,
	isPinned
}: BoardGifProps) => {
	const { roomId } = useParams<{ roomId?: string }>();
	const classes = useStyles();

	return (
		<div
			style={{
				top,
				left,
				position: 'absolute',
				zIndex: 9999998,
				userSelect: 'none',
				display: 'flex'
			}}
		>
			<Paper elevation={5} className={classes.paper}>
				<Gif gif={data} width={180} noLink={true} />
			</Paper>

			{roomId && (
				<div className={classes.buttonList}>
					{isPinned ? (
						<Tooltip title="unpin item" placement="top">
							<IconButton onClick={onUnpin}>
								<Cancel />
							</IconButton>
						</Tooltip>
					) : (
						<Tooltip title="pin item">
							<IconButton onClick={onPin}>
								<img
									alt="push-pin"
									className={classes.pushPin}
									src={pushPinIcon}
								/>
							</IconButton>
						</Tooltip>
					)}
				</div>
			)}
		</div>
	);
};
