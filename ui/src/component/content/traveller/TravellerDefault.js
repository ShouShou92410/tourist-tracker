import React, { useContext } from 'react';
import Container from 'react-bootstrap/esm/Container';
import { UserContext } from '../../../utility/Context';

function TravellerDefault() {
	const currentUser = useContext(UserContext);

	return (
		<Container>
			<h3>Welcome {currentUser.name}</h3>
			<p>
				As a traveller, you can add and keep track of your tourist site visits, as well as
				getting recommendation for your next tourist site to visit.
			</p>
		</Container>
	);
}

export default TravellerDefault;
