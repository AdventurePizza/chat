import React, { useState, useEffect } from 'react';
import GreenArrow from '../assets/120px-Green-animated-arrow-1.gif'
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
            <img src={image} id="coin-image" width={150} height={150}/>

                <h1 style={{ color: color }} > {name}</h1>

            <br />
            <div id="text">
                <body id="numbers" style={{ color: color }}> ${currentPrice}
                , 24H: {priceChange}%</body>
            </div>
            <div id="arrow-image">
                {priceChange > 0 ? <img src={GreenArrow} width={50} height={50} /> : <img src={RedArrow} width={50} height={50} />}
            </div>
        </div >
    )
}

export default CoinWidget
