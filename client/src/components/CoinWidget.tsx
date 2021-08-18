import React, { useState, useEffect } from 'react';
import GreenArrow from '../assets/green_arrow.png'
import RedArrow from '../assets/Red-animated-arrow-down.gif'
import './CoinWidget.css';

interface ICWidget{
    name: string,
    image: string,
    currentPrice: number,
    priceChange: number
}


const CoinWidget = ({ name, image, currentPrice, priceChange }:ICWidget) => {
    const [color, setColor] = useState("");

    useEffect(() => {
        if (priceChange > 0) {
            setColor("green");
        } else if (priceChange === 0) {
            setColor("black");
        } else {
            setColor("red");
        }

    }, [priceChange])

    return (
        <div className="box" id="parent">
            <img src={image} id="coin-image" width={50} height={50}/>

                <h1 style={{ color: color }} > {name}</h1>

            <br />
            <div id="text">
                <body>Price: ${currentPrice}
                Last 24H: {priceChange}%</body>
            </div>
            <div id="arrow-image">
                {priceChange > 0 ? <img src={GreenArrow} width={50} height={50} /> : <img src={RedArrow} width={50} height={50} />}
            </div>
        </div >
    )
}

export default CoinWidget
