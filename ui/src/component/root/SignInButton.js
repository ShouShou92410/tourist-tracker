import React, { useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Spinnger from 'react-bootstrap/Spinner';
import firebase from '../../services/Firebase';
import { UserContext } from '../utility/Context';
import RegistrationModal from './RegistrationModal';

function SignInButton({ setCurrentUser }) {
	const currentUser = useContext(UserContext);
	const [authorizing, setAuthorizing] = useState(false);

	const handleSignIn = () => {
		setAuthorizing(true);
		firebase
			.signInWithGoogle()
			.then((res) => {
				setCurrentUser({ name: res.user.displayName });
				setAuthorizing(false);
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
				setCurrentUser(null);
				setAuthorizing(false);
			})
			.catch((err) => {
				setAuthorizing(false);
				console.error(err);
			});
	};

	return (
		<>
			<RegistrationModal setCurrentUser={setCurrentUser} />
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
