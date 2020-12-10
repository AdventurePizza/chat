import './Gifs.css';

import {
	Carousel,
	SearchBar,
	SearchContext,
	SearchContextManager,
	SuggestionBar
} from '@giphy/react-components';
import React, { useContext } from 'react';

import { IGif } from '@giphy/js-types';
const API_KEY = 'A7O4CiyZj72oLKEX2WvgZjMRS7g4jqS4';
interface IGifsProps {
	//Gif data IGif
	sendGif: (gif: IGif) => void;
}

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
