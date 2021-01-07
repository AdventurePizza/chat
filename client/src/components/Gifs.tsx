import './Gifs.css';

import {
	Carousel,
	Gif,
	SearchBar,
	SearchContext,
	SearchContextManager,
	SuggestionBar
} from '@giphy/react-components';
import React, { useContext, useState } from 'react';

import { IGif } from '@giphy/js-types';
import { Paper } from '@material-ui/core';
import { PinButton } from './shared/PinButton';
import { makeStyles } from '@material-ui/core/styles';

const API_KEY = 'A7O4CiyZj72oLKEX2WvgZjMRS7g4jqS4';
interface IGifsProps {
	//Gif data IGif
	sendGif: (gif: IGif) => void;
}

const useStyles = makeStyles({
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

interface BoardImageProps {
	isGif?: boolean;
	data?: IGif;
	imgSrc?: string;
	onPin: () => void;
	onUnpin: () => void;
	top: number;
	left: number;
	isPinned?: boolean;
}

export const BoardImage = ({
	top,
	left,
	data,
	onPin,
	onUnpin,
	isPinned,
	isGif,
	imgSrc
}: BoardImageProps) => {
	const [isHovering, setIsHovering] = useState(false);
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
			<Paper
				elevation={5}
				className={classes.paper}
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}
				onTouchStart={() => setIsHovering(true)}
				onTouchEnd={() => setIsHovering(false)}
			>
				{isGif && data && <Gif gif={data} width={180} noLink={true} />}
				{!isGif && imgSrc && (
					<img alt="user-selected-img" src={imgSrc} style={{ width: 180 }} />
				)}
			</Paper>

			{isHovering && (
				<div
					className={classes.buttonList}
					onMouseEnter={() => setIsHovering(true)}
					onMouseLeave={() => setIsHovering(false)}
					onTouchStart={() => setIsHovering(true)}
					onTouchEnd={() => setIsHovering(false)}
				>
					<PinButton isPinned={isPinned} onPin={onPin} onUnpin={onUnpin} />
				</div>
			)}
		</div>
	);
};
