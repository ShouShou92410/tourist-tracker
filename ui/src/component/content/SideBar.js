import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import { UserContext } from '../../utility/Context';
import Enumeration from '../../utility/Enumeration';

function SideBar() {
	const currentUser = useContext(UserContext);

	const getLinkItemElement = () => {
		switch (currentUser.type) {
			case Enumeration.UserType.TRAVELLER.value:
				return (
					<>
						<ListGroup.Item as={Link} to="/dataentry">
							Create a visited record
						</ListGroup.Item>
						<ListGroup.Item as={Link} to="/recommendation">
							Get recommendation
						</ListGroup.Item>
						<ListGroup.Item as={Link} to="/history">
							View my travel history
						</ListGroup.Item>
					</>
				);
			case Enumeration.UserType.SITEOWNER.value:
				return (
					<>
						<ListGroup.Item as={Link} to="/dataentry">
							Create a new tourist site
						</ListGroup.Item>
						<ListGroup.Item as={Link} to="/recommendation">
							Get recommendation
						</ListGroup.Item>
						<ListGroup.Item as={Link} to="/history">
							View my tourist sites
						</ListGroup.Item>
					</>
				);
			default:
				return;
		}
	};

	return <ListGroup variant="flush">{getLinkItemElement()}</ListGroup>;
}

export default SideBar;
