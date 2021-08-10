import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Coin} from './Coin';

interface ICoins {
    id: string,
	name: string,
    image:string,
    symbol: string,
    price: number,
    volume: number,
    market_cap: number,
    current_price: number,
    price_change_percentage_24h: number,
    total_volume: number
};
export function CryptoPanel (){
	const [coins, setCoins] = useState([]);
	const [search, setSearch] = useState("");

	useEffect(()=>{
		axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1')
		.then((res)=>{
			setCoins(res.data)
			console.timeLog(res.data);
		}).catch(error => alert(error))
	},[]);

	const handleChange = (e: { target: { value: any; }; }) =>{ //potential source of error (e- type)
		setSearch(e.target.value)
	}
	const filteredCoins = coins.filter( (coin:ICoins) =>
		coin.name.toLowerCase().includes(search.toLowerCase())
		);

	return (
		<div className="coin-app">
			<div className="coin-search">
				<h1 className="coin-text"> Search a Currency</h1>
				<form>
					<input type="text" placeholder="search" className="coin-input" onChange={handleChange}/>
				</form>
			</div>
            {filteredCoins.map((coin:ICoins) => {
				return(
                    <Coin
						key={coin.id}
						name={coin.name}
						image={coin.image}
						symbol={coin.symbol}
						volume={coin.market_cap}
						price={coin.current_price}
                        priceChange={coin.price_change_percentage_24h}
                        marketCap={coin.total_volume}
				/>);
			})}
		</div>
	);
};

export default CryptoPanel;





