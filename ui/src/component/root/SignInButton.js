import React, { useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Spinnger from 'react-bootstrap/Spinner';
import firebase from '../../services/Firebase';
import { UserContext } from '../utility/Context';
import RegistrationModal from './RegistrationModal';

function SignInButton({ setCurrentUser }) {
	const currentUser = useContext(UserContext);
	const [authorizing, setAuthorizing] = useState(false);
	const [showRegistrationModal, setShowRegistrationModal] = useState(false);

	const handleClose = () => {
		setShowRegistrationModal(false);
		setAuthorizing(false);
	};

	const handleSetCurrentUser = (user) => {
		if (user === null) {
			setCurrentUser(null);
		} else {
			setCurrentUser({ name: user.displayName, type: user.type });
			console.log({ name: user.displayName, type: user.type });
		}
		setAuthorizing(false);
	};

	const handleSignIn = () => {
		setAuthorizing(true);
		firebase
			.signInWithGoogle()
			.then((res) => {
				const user = firebase.get(123); // do await here
				if (user) {
					handleSetCurrentUser(user);
				} else {
					setShowRegistrationModal(true);
				}
			})
			.catch((err) => {
				setAuthorizing(false);
				console.error(err);
			});
	};
	const handleSignOut = () => {
		setAuthorizing(true);
		firebase
			.signOut()
			.then((res) => {
				handleSetCurrentUser(null);
			})
			.catch((err) => {
				setAuthorizing(false);
				console.error(err);
			});
	};

	return (
		<>
			<RegistrationModal
				show={showRegistrationModal}
				handleClose={handleClose}
				handleSetCurrentUser={handleSetCurrentUser}
			/>
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
		</>
	);
}

export default SignInButton;
