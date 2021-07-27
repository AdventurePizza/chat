import { Timeline, Tweet, Follow, Share } from 'react-twitter-widgets';
import React, { useState } from 'react';

interface ITwitterProps{
    pinTweet: (id: string)=> void;
    updateIsTyping: (isTyping: boolean)=> void;
}

export const TweetPanel = ({
    pinTweet,
    updateIsTyping
}:ITwitterProps) => {
    const [ready, setReady] = useState(false);
    const [splitURL, setsplitURL] = useState("");
    var userin = document.getElementById("tweetURL") as HTMLInputElement
    let tweetURLval: string;
    
    const onPinTweet =() => {
        pinTweet(splitURL)
    }


    function clickHandler(){
        tweetURLval = userin.value
        setsplitURL(tweetURLval.split("/")[5])
        setReady(true)
        onPinTweet()



    }
   
    return (
        <div>
        <input placeholder="Insert Tweet URL" id="tweetURL"></input>
         <button placeholder="Find Tweet" onClick = {()=>clickHandler()}>Find Tweet</button>
         {
                ready ?
                console.log("ready")
                : null
            }
        </div>

    )

}
export default TweetPanel;



