import {
	Carousel,
	SearchContextManager
} from '@giphy/react-components';
import { IGif } from '@giphy/js-types';
import { GiphyFetch } from '@giphy/js-fetch-api'
import React from 'react';

// const API_KEY = 'A7O4CiyZj72oLKEX2WvgZjMRS7g4jqS4';
const API_KEY = 'lK7kcryXkXX2eV2kOUbVZUhaYRLlrWYh';
const giphyfetch = new GiphyFetch(API_KEY)

interface IGiphyPanelProps {
	//Gif data IGif
	sendGif: (gif: IGif) => void;
	search: string;
	isBackground: boolean;
	sendImage: (name: string, type: 'background' | 'gif' | 'image') => void;
}

const GifComponent = ({ sendGif, search, isBackground, sendImage }: IGiphyPanelProps) => {
	if(!search){
		search = "hello";
	}
	const fetchGifs = (offset: number) => giphyfetch.search(search, { offset, limit: 10 })

	return (
		<div className='background-icon-list'>
			<Carousel
				key={search}
				gifHeight={130}
				gutter={6}
				fetchGifs={fetchGifs}
				onGifClick={(gif: IGif) =>{
					if(isBackground)
						sendImage("https://i.giphy.com/media/" + gif.id + "/giphy.webp",  'background' );
					else
					sendGif(gif);
				}}
				noLink={true}
			/>
		</div>
	);
};

export const GiphyPanel = ({ sendGif, search, isBackground, sendImage }: IGiphyPanelProps) => {
	return (
		<SearchContextManager apiKey={API_KEY}>
			<GifComponent 
				sendGif={sendGif} 
				search={search}
				isBackground={isBackground}
				sendImage={sendImage} 
			/>
		</SearchContextManager>
	);
};