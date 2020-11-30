import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './root/Dashboard';
import MenuBar from './root/MenuBar';
import { UserContext } from './utility/Context';

function App() {
	const [currentUser, setCurrentUser] = useState(null);

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
