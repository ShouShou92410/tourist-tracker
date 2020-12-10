import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './root/Dashboard';
import MenuBar from './root/MenuBar';
import { UserContext } from './utility/Context';
import firebase from '../services/Firebase';

function App() {
	const [currentUser, setCurrentUser] = useState(null);

	const [firebaseCreated, setFirebaseCreated] = useState(false);

	useEffect(() => {
		setFirebaseCreated(firebase.isInitialized());
	});

	return (
		firebaseCreated && (
			<UserContext.Provider value={currentUser}>
				<BrowserRouter>
					<MenuBar setCurrentUser={setCurrentUser} />
					<Dashboard />
				</BrowserRouter>
			</UserContext.Provider>
		)
	);
}

export default App;
