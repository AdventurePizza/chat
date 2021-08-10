import React from 'react'
import './Coin.css';
import { PinButton } from './shared/PinButton';
interface ICoin{
    name: string,
    image:string,
    symbol: string,
    price: number,
    volume: number,
    priceChange: number,
    marketCap: number
}

export const Coin = ({name, image, symbol, price, volume, priceChange, marketCap}: ICoin) => {
    return (
        <div className="coin-container">
            <div className="coin-row">
                <div className="coin">
                <img src={image} alt="crypto" />
                <h1>{name}</h1>
                <p className='coin-symbol'>{symbol}</p>
                </div>
                <div className='coin-data'>
                    <p className='coin-price'>${price}</p>
                    <p className='coin-volume'>${volume.toLocaleString()}</p>
                    {priceChange < 0 ? ( 
                         <p className='coin-percent red'>{priceChange.toFixed(2)}%</p>
                    ):<p className='coin-percent green'>{priceChange.toFixed(2)}%</p>}
                    <p className='coin-market-cap'>Mkt Cap: {marketCap.toLocaleString()}</p>
                </div>
            </div>  
        </div>
    )
}

export default Coin;
