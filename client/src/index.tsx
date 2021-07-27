import './index.css';

import App from './App';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './contexts/AuthProvider';
import { FirebaseProvider } from './contexts/FirebaseContext';
import { AppStateProvider } from './contexts/AppStateContext';
import io from 'socket.io-client';
import { MapsProvider } from './contexts/MapsContext';

const socketURL =
	window.location.hostname === 'localhost'
		? 'ws://localhost:8000'
		: 'wss://trychats.herokuapp.com';

const socket = io(socketURL, { transports: ['websocket'] });

ReactDOM.render(
	<DndProvider backend={HTML5Backend}>
		<AuthProvider socket={socket}>
			<FirebaseProvider>
				<AppStateProvider socket={socket}>
					<MapsProvider>
						<App />
					</MapsProvider>
				</AppStateProvider>
			</FirebaseProvider>
		</AuthProvider>
	</DndProvider>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
