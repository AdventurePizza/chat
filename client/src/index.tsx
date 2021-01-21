import './index.css';

import App from './App';
import { DndProvider } from 'react-dnd';
import { FirebaseProvider } from './firebaseContext';
import { HTML5Backend } from 'react-dnd-html5-backend';
import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
	<FirebaseProvider>
		<DndProvider backend={HTML5Backend}>
			<App />
		</DndProvider>
	</FirebaseProvider>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
