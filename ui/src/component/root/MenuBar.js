import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import SignInButton from './SignInButton';
import { UserContext } from '../../utility/Context';

function MenuBar({ setCurrentUser }) {
	const currentUser = useContext(UserContext);

	return (
		<Navbar className="sticky-nav" bg="dark" variant="dark">
			<Navbar.Brand as={Link} to="/">
				Home
			</Navbar.Brand>
			<Navbar.Collapse className="justify-content-end">
				<Navbar.Text>{currentUser?.name}</Navbar.Text>
				<SignInButton setCurrentUser={setCurrentUser} />
			</Navbar.Collapse>
		</Navbar>
	);
}

export default MenuBar;
