import React, { useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Spinnger from 'react-bootstrap/Spinner';
import firebase from '../../services/Firebase';
import { UserContext } from '../../utility/Context';
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
			setCurrentUser(user);
		}
		setAuthorizing(false);
	};

	const handleSignIn = () => {
		setAuthorizing(true);
		firebase
			.signInWithGoogle()
			.then(async (res) => {
				const user = await firebase.getUser(); // do await here
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
				<Button size="sm" variant="primary" disabled={authorizing} onClick={handleSignIn}>
					{authorizing && <Spinnger animation="border" size="sm" />}
					Sign In
				</Button>
			) : (
				<NavDropdown title={currentUser.name}>
					<NavDropdown.Item
						as={Button}
						size="sm"
						variant="primary"
						disabled={authorizing}
						onClick={handleSignOut}
					>
						{authorizing && <Spinnger animation="border" size="sm" />}
						Sign Out
					</NavDropdown.Item>
				</NavDropdown>
			)}
		</>
	);
}

export default SignInButton;
