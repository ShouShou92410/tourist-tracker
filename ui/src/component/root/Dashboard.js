import React, { useContext } from 'react';
import { UserContext } from '../utility/Context';

function Dashboard() {
	const currentUser = useContext(UserContext);

	return <h1>Welcome {currentUser?.name}</h1>;
}

export default Dashboard;
