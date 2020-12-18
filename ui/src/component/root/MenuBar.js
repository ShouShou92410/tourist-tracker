import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import SignInButton from './SignInButton';

function MenuBar({ setCurrentUser }) {
	return (
		<Navbar bg="dark" variant="dark" className="sticky-nav">
			<Navbar.Brand as={Link} to="/">
				Home
			</Navbar.Brand>
			<Navbar.Collapse className="justify-content-end">
				<Nav>
					<SignInButton setCurrentUser={setCurrentUser} />
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	);
}

export default MenuBar;
