import React from 'react';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import SignInButton from './SignInButton';

function MenuBar({ setCurrentUser }) {
	return (
		<Navbar bg="dark" variant="dark" className="sticky-nav">
			<Navbar.Brand as={Link} to="/">
				<img
					alt=""
					src={`${process.env.PUBLIC_URL}/favicon.ico`}
					width="30"
					height="30"
					className="d-inline-block align-top"
				/>{' '}
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
