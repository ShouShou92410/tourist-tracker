import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from 'react-bootstrap/NavBar';
import SignInButton from './SignInButton';

function MenuBar({ setCurrentUser }) {
	return (
		<NavBar bg="dark" variant="dark">
			<NavBar.Brand as={Link} to="/">
				Home
			</NavBar.Brand>
			<NavBar.Collapse className="justify-content-end">
				<SignInButton setCurrentUser={setCurrentUser} />
			</NavBar.Collapse>
		</NavBar>
	);
}

export default MenuBar;
