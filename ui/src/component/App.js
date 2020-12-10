import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './root/Dashboard';
import MenuBar from './root/MenuBar';
import { UserContext } from './utility/Context';
import firebase from '../services/Firebase';

function App() {
	const [currentUser, setCurrentUser] = useState(null);

	useEffect(() => {
		firebase.onAuthStateChanged().then(async (val) => {
			setCurrentUser(await firebase.getUser());
		});
	}, []);

	return (
		<UserContext.Provider value={currentUser}>
			<BrowserRouter>
				<MenuBar setCurrentUser={setCurrentUser} />
				<Dashboard />
			</BrowserRouter>
		</UserContext.Provider>
	);
}

export default App;
