import React, { useState } from 'react';
import { InputButton } from './InputButton';
import { IconButton } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import "./EditField.css";

interface IEditFieldProps {
    prefix: string;
    placeholder: string;
	onClick: (value: string) => void;
	setStep?: (step: number) => void;
    containsRemove: boolean;
    clearField?: () => void;
}

export const EditField = ({
    prefix,
    placeholder,
    onClick,
    setStep,
    containsRemove,
    clearField
}: IEditFieldProps) => {
    const [showInput, setShowInput] = useState(false);

    return (
        <div className={setStep ? "edit-field-container second-step" : "edit-field-container"}>
            <h4 className="edit-field-prefix">{prefix}: </h4>
            { !showInput ?
                <PublishedView 
                    setShowInput={setShowInput}
                    placeholder={placeholder}
                />
                :
                <div className="edit-field-content-container">
                    <InputButton
                        buttonText="update"
                        placeholder={placeholder}
                        onClick={onClick}
                        onSubmit={setShowInput}
                        inputWidth="95%"
                        setStep={setStep}
                    />
                    {containsRemove && clearField ? (
                        <Fab onClick={() => {
                            clearField();
                            setShowInput(false);
                        }} aria-label="Delete" color="secondary" size="small">
                            <DeleteIcon />
                        </Fab>
                        
                    ) : null}
                </div>
            }
        </div>
    )
}

interface IPublishedViewProps {
    setShowInput: (val: boolean) => void;
    placeholder: string;
}

const PublishedView = ({ setShowInput, placeholder } : IPublishedViewProps) => {
    return (
        <div className="edit-field-content-container">
            <h5 className="edit-field-placeholder">{placeholder}</h5>
            <IconButton onClick={() => setShowInput(true)}>
                <EditIcon />
            </IconButton>
        </div>
    )
}