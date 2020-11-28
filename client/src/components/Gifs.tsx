import React, { SyntheticEvent, useContext, useRef, useState } from "react";
import "./Gifs.css";
import { 
         Carousel, 
         Gif,
         SearchBar, 
         SearchContext, 
         SearchContextManager, 
         SuggestionBar
        } from '@giphy/react-components'
import { GiphyFetch} from '@giphy/js-fetch-api'
// use @giphy/js-fetch-api to fetch gifs, instantiate with your api key
const API_KEY = 'A7O4CiyZj72oLKEX2WvgZjMRS7g4jqS4'
// const gf = new GiphyFetch(API_KEY)
// configure your fetch: fetch 10 gifs at a time as the user scrolls (offset is handled by the grid)
// const fetchGifs = (offset: number) => gf.trending({ offset, limit: 10 })
// Render the React Component and pass it your fetchGifs as a prop
//ReactDOM.render(, target)

interface IGifsProps {
  //Gif data IGif
  sendGif: (gif: any) => void;
}

const GifComponent = () => {
  const { fetchGifs, searchKey } = useContext(SearchContext)
  const onGifClick = (gif: any, e: SyntheticEvent<HTMLElement, Event>) => {

  }
  return (
    <div className="gif-container">
        <SearchBar />
        <SuggestionBar/>
        <Carousel key={searchKey} gifHeight={130} gutter={6} fetchGifs={fetchGifs} onGifClick={onGifClick} />
    </div>
  )
}

export const Gifs = ({ }: IGifsProps) => {

  return (
    <SearchContextManager initialTerm="music" apiKey={API_KEY}>
      <GifComponent/>
    </SearchContextManager>
  );
};
