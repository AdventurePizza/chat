import React, {} from 'react';
import { CSSTransition } from 'react-transition-group';
import loadingDots from '../assets/loading-dots.gif';
import openAiPng from '../assets/openAiCharacter.png'


//const api_key = "sk-jvRKXqLmNsdePKgF4aDcJYhfR927QYAZFuCdFkx1";  //process.env.OPENAI_TEST_API_KEY;
//const OpenAIAPI = require('openai-api');
//const openai = new OpenAIAPI(api_key);

//process.env.OPENAI_TEST_API_KEY = api_key;
// interface IOpenAIProps {
	
// }
const isTyping = false;
const message = "hi";

export const OpenAI = () => {
	
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
            {(isTyping && <img
                style={{
                    width: 60,
                }}
                src={loadingDots}
                alt="three dots"
            />)}

            {(!
            isTyping && <CSSTransition
                timeout={1000}
                classNames="avatar-message-transition"
                key={message}
            >
            <div style={{fontSize:25}}>{message}</div>
            </CSSTransition>
            )}
            </div>
            

            <img alt={"ai-avatar"} src={openAiPng} width="150px" style={{position:"relative"}}/>
                    
            </div>
        </div>
	);
};