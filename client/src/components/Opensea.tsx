import React, { useState, useEffect, useContext } from 'react';
import "./SettingsPanel.css";
import Button from '@material-ui/core/Button';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { AuthContext } from "../contexts/AuthProvider";


interface IOpenSea {
    onChangeAvatar: (imageUrl: string) => void;
    setShowNftModal: (val: boolean) => void;
    setActiveAvatar: (imageUrl: string) => void;
}

export const Opensea = ({
        onChangeAvatar,
        setShowNftModal,
        setActiveAvatar
    } : IOpenSea) => {
    interface INFT {
        name: string,
        image: string
    }
    const [nfts, setNfts] = useState<INFT[]>([]);
    const [activeNft, setActiveNft] = useState({
        name: "",
        image: ""
    });
    const { accountId } = useContext(AuthContext);

    
    useEffect(() => {
        const getData = async () => {
            const options = {method: 'GET'};
    
            fetch(`https://api.opensea.io/api/v1/assets?owner=${accountId}&order_direction=desc&offset=0&limit=50`, options)
            .then(response => response.json())
            .then(response => {
                const reduced = response.assets.map((nft:any) => {
                    return {
                        name: nft.name,
                        image: nft.image_url
                    }
                })
                setNfts(reduced);
            })
            .catch(err => console.error(err));
        }
        getData();
    }, [accountId])

    let nftsComponent: any[] = [];
    if(nfts){
        nftsComponent = nfts.map((nft, index) => {
            let classes = 'nft-item-container';
            if (activeNft.name === nft.name) {
                classes =
                    'nft-item-container settings-avatar-container-active';
            }
            return (<div key={index} className={classes}>
                <img 
                    src={nft.image} 
                    alt="nft"
                    height={80}
                    onClick={() => setActiveNft(nft)}/>
            </div>)
        })
    }

    return (
        <div className="nft-modal-container">
            <div className="nft-modal-close">
                <IconButton onClick={() => setShowNftModal(false)} color="primary">
                    <CloseIcon />
                </IconButton>
            </div>
            {!nfts.length ? <p>no nft's to show</p> : null}
            <div className="nfts-container">
                {nftsComponent}
            </div>
            <div className="nft-avatar-button">
                <Button
                        onClick={() => {
                            onChangeAvatar(activeNft.image);
                            setActiveAvatar(activeNft.image);
                            setShowNftModal(false);
                        }}
                        variant="contained"
                        color="primary"
                        disabled={!nfts.length ? true : false}
                    >
                    SET!
                </Button>
            </div>
        </div>
    )
}