import React, { useEffect } from 'react';
import { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import loadingDots from '../assets/loading-dots.gif';
import openAiPng from '../assets/openAiCharacter.png'


const api_key = "API_KEY_HERE";  //process.env.OPENAI_TEST_API_KEY;
const OpenAIAPI = require('openai-api');
const openai = new OpenAIAPI(api_key);

interface IOpenAIProps {
	message?:string
}

const template = "Trybot is a bot who kindly answers questions for this site called trychats.\n"
                + "###\n"
                + "User: What is trychats?\n"
                + "Trybot: trychats is a website for online interactions in forms of gifs, emojis, games, drawings and many more\n"
                + "###\n"
                + "User: What game can we play?\n"
                + "Trybot: we have tower defense game where you can cooperate with other users to defend against waves of enemies\n"
                + "###\n"
                + "User: What can we do?\n"
                + "Trybot: make some drawings, pin background, share with others, make sounds and drawings\n"
                + "###\n"
                + "User: Hello\n"
                + "Trybot: hi welcome to trychats!\n"
                + "###\n"
                + "User: Whats up\n"
                + "Trybot: hi welcome to trychats!\n"
                + "###\n"
                + "User: How do I play games?\n"
                + "Trybot: click on the tower tab on the left to play\n"
                + "###\n"
                + "User: "

export const OpenAI = ({message}:IOpenAIProps) => {
    const [isThinking, setIsThinking] = useState(false);
    const [response, setResponse] = useState("");
    useEffect(() => {
		setIsThinking(true);
        openai.complete({
            prompt: template + message + "\nTrybot: ",
            maxTokens: 100,
            n: 3,
            temperature: 0.8,
            frequencyPenalty: 0,
            stop: ["\n", ".", "?", "lol"],
        }).then((response: any) => {
            console.log(response.data.choices)
            setResponse(response.data.choices[0].text);
            setIsThinking(false);
        });
    }, [message]);
    

	return (
		<div
			style={{
				display: 'flex'
			}}
		>
            <div
				style={{
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column',
                    position: 'absolute',
                    width: "200px",
                    top: window.innerHeight/2, 
                    left: window.innerWidth/2
				}}
			>

            <div style={{marginBottom:"3px"}}>
                {(isThinking && <img
                    style={{
                        width: 60,
                    }}
                    src={loadingDots}
                    alt="three dots"
                />)}

                {(!isThinking && <CSSTransition
                    timeout={1000}
                    classNames="avatar-message-transition"
                    key={message}
                >
                <div style={{fontSize:25}}>{response}</div>
                </CSSTransition>)}
            </div>
            

            <img alt={"ai-avatar"} src={openAiPng} width="150px" style={{position:"relative"}}/>
            
            </div>
        </div>
	);
};