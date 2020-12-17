import React, { useContext } from 'react';
import Container from 'react-bootstrap/esm/Container';
import { UserContext } from '../../../utility/Context';

function SiteOwnerDefault() {
	const currentUser = useContext(UserContext);

	return (
		<Container>
			<h3>Welcome {currentUser.name}</h3>
			<p>
				As a tourist site owner, you can add and keep track of your tourist site, as well as
				getting amenity recommendation for your tourist site.
			</p>
		</Container>
	);
}

export default SiteOwnerDefault;
