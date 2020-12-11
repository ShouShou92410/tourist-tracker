import React from 'react';
import { Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';

function SideBar() {
	return (
		<ListGroup variant="flush">
			<ListGroup.Item as={Link} to="/dataentry">
				Create a location record
			</ListGroup.Item>
			<ListGroup.Item as={Link} to="/recommendation">
				Get recommendation
			</ListGroup.Item>
			<ListGroup.Item as={Link} to="/history">
				View my records
			</ListGroup.Item>
		</ListGroup>
	);
}

export default SideBar;
