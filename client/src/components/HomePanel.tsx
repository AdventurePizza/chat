
import React, { useState } from 'react';

import HomeIcon from '../assets/navbar/homeIcon.png';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    buttonContainer: {
        fontSize: 20
    },
    panelContainer: {
        padding: 10,
        '& > *': {
            marginRight: 5
        },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    }
});

interface IEmailPanelProps {
    sendEmail: (email: string, message: string) => void;
}

export const EmailPanel = ({ sendEmail }: IEmailPanelProps) => {
    const classes = useStyles();

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const onClickSend = () => {
        sendEmail(email, message);
        setEmail('');
        setMessage('');
    };

};

export const EmailButton = () => {
    const classes = useStyles();
    return (
        <div className={classes.buttonContainer}>
            <div>invite</div>
        </div>
    );
};
