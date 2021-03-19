import React, { useEffect } from 'react';
import { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import loadingDots from '../assets/loading-dots.gif';
import openAiPng from '../assets/openAiCharacter.png'


const api_key = "key";  //process.env.OPENAI_TEST_API_KEY;
const OpenAIAPI = require('openai-api');
const openai = new OpenAIAPI(api_key);

interface IOpenAIProps {
	message?:string
}

const template = "Trybot is a bot who deliberately chats with others and answers questions for this site called trychats. Trychats is a website for online interactions in forms of gifs, emojis, games, drawings and many more. There is tower defense game where you can cooperate with other users to defend against waves of enemies.\n"
                + "###\n"
                + "User: Hello\n"
                + "Trybot: hi welcome to trychats!\n"
                + "###\n"
                + "User: "
let logs = template;
export const OpenAI = ({message}:IOpenAIProps) => {
    const [isThinking, setIsThinking] = useState(false);
    const [response, setResponse] = useState("");
    
    useEffect(() => {
		setIsThinking(true);
        logs += message + "\nTrybot: ";
        openai.complete({
            prompt: logs,
            maxTokens: 100,
            n: 3,
            temperature: 0.8,
            frequencyPenalty: 0.2,
            presencePenalty: 0.5,
            stop: ["\n", ".", "?", "lol"],
        }).then((response: any) => {
            console.log(response.data.choices)
            const index = Math.floor(Math.random()*3)
            setResponse(response.data.choices[index].text);
            logs += response.data.choices[index].text + "\n###\nUser: ";
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