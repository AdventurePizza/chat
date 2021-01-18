import React, { useContext, useEffect, useState } from 'react'
import { FirebaseContext } from '../firebaseContext'
import { IChatRoom } from '../types'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button';
import { IconButton } from '@material-ui/core';
import { Cancel } from '@material-ui/icons';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import HomeIcon from '@material-ui/icons/Home';
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles({
    title: {
        fontSize: 50,
        fontWeight: 600,
        marginBottom: 20,
    },
    container: {
		width: 'fit-content',
		maxWidth: window.innerWidth * 0.8,
		borderRadius: 20,
		borderWidth: 5,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 100,
		flexDirection: 'column',
		'& > *': {
			fontFamily: 'Blinker'
		},
		backgroundColor: 'whitesmoke',
		border: '5px solid #87D3F3',
		position: 'relative'
    },
    cancelButton: {
		position: 'absolute',
		right: 10,
		top: 10
    },
})

const buttonStyles = makeStyles((theme) => ({
    button: {
      margin: theme.spacing(1),
    },
  }));


interface IRoomDirectoryProps {
    sendRoomDirectory: (roomDirectory: string, roomName: string) => void;
}

interface IEnterRoomProps {
    roomName: string;
    onClickCancel: () => void;
}

// interface IRoomIconProps {
//     room: string;
// }

const pickNItemsArray = ( arr : Array<Object> | null, n : number) : Array<Object> | null => {
    if (!arr) {
        return null;
    }
    else {
        let items : Array<Object> = [];
        let arrCopy : Array<Object> = arr.slice(0);
        for (let i=0; i < n && arrCopy.length >1 ; i++) {
            let index = Math.floor(arrCopy.length * Math.random())
            if (Object.keys(arrCopy[index]).length === 0 ){
                index = index + 1;
            }
            items.push(arrCopy[index])
            arrCopy.splice(index,1)
        }
        return items;
    }
}

export const RoomDirectoryPanel = ({ sendRoomDirectory } : IRoomDirectoryProps ) => {
    const [displayedRooms,setDisplayedRooms] = useState<IChatRoom[] | null>([]);
    const [allRooms, setAllRooms] = useState<IChatRoom[] | null>([]);
    const firebaseContext = useContext(FirebaseContext);
    const [searchText, setSearchText] = useState<string>(''); 
    const history = useHistory();
    useEffect( () => {
        firebaseContext.getAllRooms().then((rooms) => {
            const pickedItems = pickNItemsArray(rooms as Array<Object>,10);
            setDisplayedRooms(pickedItems as IChatRoom[]);
            setAllRooms(rooms);
        })
    },[firebaseContext])
    
    const onSearchSubmit = async () => {
        if (searchText.length >= 0) {
            let foundRooms : IChatRoom[] = [];
            allRooms?.forEach((room) => {
               if ( room.name !== undefined && searchText.length > 2 && room.name.includes(searchText)) {
                    foundRooms.push(room);
               }
               else if (room.name !== undefined && searchText.length <= 2 && room.name.startsWith(searchText)) {
                    foundRooms.push(room);    
               }
            });
            foundRooms.length > 10 ? setDisplayedRooms(foundRooms.slice(0,10)) : setDisplayedRooms(foundRooms);
        }
    };

    // const RoomIcon = ({ room } : IRoomIconProps ) => {
    //     const [isHovering, setIsHovering] = useState(false);
    //     const normalIcon = () => <p>{room}</p>;
    //     const hoveringIcon = () => (
    //         <div className="display-hover-icon">
    //             <span>{room}</span>
    //         </div>
    //     );

    //     const iconToDisplay = isHovering ? normalIcon : hoveringIcon;

    //     return (
    //         <div className="room-icon"
    //             onMouseEnter={() => setIsHovering(true)}
    //             onMouseLeave={() => setIsHovering(false)}
    //             onTouchStart={() => setIsHovering(true)}
    //         >
    //             <button style={{ background: "none", border: "none" }} onClick={() => sendRoomDirectory('roomDirectory', room)} >
    //                 {iconToDisplay()}
    //             </button>
    //         </div>
    //     );
    // }
    
    const displayRooms = displayedRooms?.map((room, index) => {
        return (
            <div key={index} className="room-icon"
            >
                <button style={{ background: "none", border: "none" }} onClick={() => sendRoomDirectory('roomDirectory', room.name)} >
                    <p>{room.name}</p>
                </button>
            </div>                        
        );
        });
    
    return (
        <div className="room-container">
            <div style={{ justifyContent: "center", display: 'flex' }} >
            <InputBase
                placeholder="Search Rooms"
                onChange={(event) => setSearchText(event.target.value)}
                onKeyPress={(event) => event.key === 'Enter' && onSearchSubmit()}
                value={searchText}
                />
            <IconButton color="primary" onClick={onSearchSubmit}>
                <SearchIcon />
            </IconButton>
            <IconButton color="primary" onClick={ () => history.push("/") } >
                <HomeIcon />
            </IconButton>
            </div>
            <div className="room-icon-list"> {displayRooms} </div>
        </div>
    );
}

export const EnterRoomModal = ({roomName, onClickCancel} : IEnterRoomProps ) => {
    const classes = useStyles();
    const buttonClasses = buttonStyles();
    const history = useHistory();
    return (
        <div className={classes.container}>
            <IconButton onClick={onClickCancel} className={classes.cancelButton}>
                <Cancel />
            </IconButton>
        <div className={classes.title}> {`Enter room: ${roomName}`}</div>
        <Button
        variant="contained"
        color="primary"
        className={buttonClasses.button}
        onClick= {() => history.push(`/room/${roomName}`) }
        >
        Enter
      </Button>
        </div>
    );
}
