// import React, { useState } from 'react';
// import { Timeline, Tweet} from 'react-twitter-widgets';
// //import { Timeline, Tweet, Follow, Share } from 'react-twitter-widgets';
// interface ITwitterProps{
//     pinTweet: (id: string)=> void;
//     updateIsTyping: (isTyping: boolean)=> void;
// }
// export var state=1;

// export const TweetPanel = ({
//     pinTweet,
//     updateIsTyping
// }:ITwitterProps) => {
//     //const [ready, setReady] = useState(false);
//     const [splitURL, setsplitURL] = useState("");
  
//     var userin = document.getElementById("tweetURL") as HTMLInputElement
//     var checkbox = document.getElementById('toggle') as HTMLInputElement
//     let tweetURLval: string;
//     const onPinTweet =() => {
//         pinTweet(splitURL)
//     }
//     const checkUrl=()=>{

//     }

//     function clickHandler(){
//         tweetURLval = userin.value
//         if (checkbox.checked){
//             console.log("checked")
//             state = 1
//         }
//         else{
//             setsplitURL(tweetURLval.split("/")[5])
//             checkUrl()
//             console.log("unchecked")
//             state = 0
//         }
//         //setReady(true)
//         onPinTweet()

//     }
   
//     return (
//         <div>
//     <Timeline dataSource={{ sourceType: "profile", screenName: "reactjs" }} />
     
//         <input placeholder="Insert Tweet URL" id="tweetURL"></input>
//          <button placeholder="Find Tweet" onClick = {()=>clickHandler()}>Find Tweet</button>
//          <Tweet tweetId="1323914087340781569" />
        
//          <input type="checkbox" id="toggle" placeholder="Insert Timeline"/>
//         </div>

//     )

// }
// export default TweetPanel;
import React, { useRef, useState } from 'react';
import TweetEmbed from 'react-tweet-embed';
import { PinButton } from './shared/PinButton';
import { TextField } from '@material-ui/core';

interface ITwitterProps {
	pinTweet: (id: string) => void; //need to change type
	updateIsTyping: (isTyping: boolean) => void;
}

export const Twitter = ({
	updateIsTyping,
	pinTweet
}: ITwitterProps) => {

	//   const classes = useStyles();

	const [chatValue, setChatValue] = useState('');
	const textfieldRef = useRef<HTMLDivElement>(null);

	const onChangeChat = (event: React.ChangeEvent<HTMLInputElement>) => {
		setChatValue(event.target.value);

		if (!!event.target.value !== !!chatValue) {
			updateIsTyping(!!event.target.value);
		}
	};


	const onPinTweet = () => {
		pinTweet(chatValue.split("/")[5]);
		clearMessage();
	};

	const clearMessage = () => {
		setChatValue('');
		updateIsTyping(false);
	};

	const onFocus = () => {
		if (window.innerWidth < 500 && textfieldRef.current) {
			const offsetTop = textfieldRef.current.offsetTop;
			document.body.scrollTop = offsetTop;
		}
	};

	return (
		<div
		// className={classes.container}
		>
			<TextField
				autoFocus={window.innerWidth > 500}
				ref={textfieldRef}
				placeholder="paste your tweet link here"
				variant="outlined"
				value={chatValue}
				onChange={onChangeChat}
				//className={classes.input}
				onFocus={onFocus}
			/>
			<PinButton onPin={onPinTweet} isPinned={false} onUnpin={() => { }} />
		</div>
	);
};

export default Twitter;


