import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthProvider';
import "./Login.css";
import check from "../assets/check.png";
import maticInput from '../assets/matic-input.png';
import networks from '../assets/networks.png';
import { MetamaskButton } from './MetamaskButton';

import IconButton from '@material-ui/core/IconButton';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import CloseIcon from '@material-ui/icons/Close';


const Checkmark = () => {
    return(
        <div className="checkmark-icon">
            <img src={check} alt="checkmark icon" />
        </div>
    )
}

interface ILoginProps {
    beginTour: (val: boolean) => void;
    showModal: (val: boolean) => void;
    isFirstVisit: boolean;
    setUserEmail: (email: string) => void;
}

export const Login = ({ beginTour, showModal, isFirstVisit, setUserEmail } : ILoginProps) => {
    const [email, setEmail] = useState("");
    const [showEmail, setShowEmail] = useState(false);
    const [showMetamask, setShowMetamask] = useState(false);
    const { isLoggedIn } = useContext(AuthContext);

    const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const onModalClose = () => {
        showModal(false);
        beginTour(true);
    }

    return (
        <div className="login-modal-container">
            <div className="login-modal-close-modal">
                <IconButton onClick={onModalClose}>
                    <CloseIcon />
                </IconButton>
            </div>
            <div>
                <h1 className="login-header-primary">Actually,</h1>
                <h2 className="login-header-secondary">join in.</h2>
            </div>
            {!showEmail ? (
                <div className="login-button-container">
                    <div className="login-button">
                        {email ?  <Checkmark /> : <button className="login-button-email" onClick={() => setShowEmail(true)}>Email</button>}
                        <p>Lets get you tricked out</p>
                    </div>
                    <div className="login-button">
                        {isLoggedIn ? <Checkmark /> : (
                            <MetamaskButton>
                                <div>Connect Metamask</div>
                            </MetamaskButton>
                        )}
                        <p>New to the game?</p>
                        <p className="login-metamask-info" onClick={() => setShowMetamask(true)}>How to create a Metamask wallet.</p>
                    </div>
                </div>
            ) : null}
            {showEmail ? (
                <div className="login-email-input-container">
                    <input type="email" placeholder="Email" onChange={e => onEmailChange(e)} value={email} className="login-email-input"/>
                    <button className="login-button-email" onClick={() => setShowEmail(false)}>Trick me out!</button>
                </div>
            ) : null}
            { isLoggedIn && !showEmail ? (
                <button className="login-button-email" 
                    onClick={() => {
                        setUserEmail(email);
                        showModal(false);
                        if(isFirstVisit){
                            beginTour(true);
                        }
                    }}
                >Enter</button>
            ) : null}
            {showMetamask ? <MetamaskTutorial setShowMetamask={setShowMetamask}/> : null}
        </div>
    )
}

interface IMetamaskTutorialProps {
    setShowMetamask: (val: boolean) => void;
}

const MetamaskTutorial = ({setShowMetamask}: IMetamaskTutorialProps) => {
    const [page, setPage] = useState(1);
    
    return (
        <div className="login-modal-container">
            <div className="metamask-back-arrow">
                <IconButton aria-label="delete" onClick={() => setShowMetamask(false)}>
                    <KeyboardBackspaceIcon />
                </IconButton>
            </div>
            <h1 className="metamask-header-primary">How to create a</h1>
            <h2 className="login-header-secondary">MetaMask Wallet</h2>
            <div className="metamask-steps-container">
                {page === 1 ? (
                    <>
                        <p>Step 1.  Go to the Metamask website.</p>
                        <p>Step 2.  Click "Get Chrome Extension" to install Metamask.</p>
                        <p>Step 3.  Click "Add to Chrome" in the upper right.</p>
                        <p>Step 4.  Click "Add Extension" to complete the installation.</p>
                        <p>You will know Metamask has been installed when you see the fox logo on the upper right hand corner of your browser.</p>
                    </>
                ) : (
                    <>
                        <div className="metamask-back-arrow metamask-steps-button">
                            <IconButton aria-label="delete" onClick={() => setPage(1)}>
                                <KeyboardBackspaceIcon />
                            </IconButton>
                        </div>
                        <p className="metamask-step-5">Step 5.  Open metamask.io on chrome.</p>
                        <p>Step 6.  Set up password, store key phrase somewhere secure.</p>
                        <p className="metamask-step-7">Step 7.  Switch to matic mainnet or add matic.</p>
                        <p className="metamask-step-details">Network name:  polygon, customer rpc: https://rpc-mainnet.matic.network, chain id: 137, symbol: MATIC, block explorer url: polygonscan.com</p>
                        <img src={maticInput} alt="matic inputs" id="detailshover" width={200}/>
                        <img src={networks} alt="matic netowrks" id="step7hover" width={200}/>
                    </>
                )}
            </div>
            {page === 1 ? 
                <button className="login-button-email" onClick={() => setPage(2)}>Next</button> :
                <button className="login-button-email" onClick={() => {setPage(1); setShowMetamask(false)}}>Done</button>}
        </div>
    )
}