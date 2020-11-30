import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import NavBar from 'react-bootstrap/NavBar';
import Button from 'react-bootstrap/Button';
import Spinnger from 'react-bootstrap/Spinner';
import { firebase, signInWithGoogle, signOut } from '../../services/Firebase';
import { UserContext } from '../utility/Context';

function MenuBar({ setCurrentUser }) {
	const currentUser = useContext(UserContext);
	const [authorizing, setAuthorizing] = useState(false);

	const handleSignIn = () => {
		setAuthorizing(true);
		signInWithGoogle();
	};
	const handleSignOut = () => {
		setAuthorizing(true);
		signOut();
	};

	useEffect(() => {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) setCurrentUser({ name: user.displayName });
			else setCurrentUser(null);
			setAuthorizing(false);
		});
	}, [setCurrentUser]);

	return (
		<NavBar bg="dark" variant="dark">
			<NavBar.Brand as={Link} to="/">
				Home
			</NavBar.Brand>
			{currentUser === null ? (
				<Button variant="primary" disabled={authorizing} onClick={handleSignIn}>
					{authorizing && <Spinnger animation="border" size="sm" />}
					Sign In
				</Button>
			) : (
				<Button variant="primary" disabled={authorizing} onClick={handleSignOut}>
					{authorizing && <Spinnger animation="border" size="sm" />}
					Sign Out
				</Button>
			)}
		</NavBar>
	);
}

export default MenuBar;
