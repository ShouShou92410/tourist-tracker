import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import firebase from '../../services/Firebase';

function RegistrationModal({ show, handleClose, handleSetCurrentUser }) {
	const handleSubmit = async (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);
		const registrationForm = Object.fromEntries(formData.entries());
		console.log(registrationForm);

		const user = await firebase.register(registrationForm);
		handleSetCurrentUser(user);

		handleClose();
	};

	return (
		<Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
			<Modal.Header closeButton>
				<Modal.Title>Registration</Modal.Title>
			</Modal.Header>
			<Form onSubmit={handleSubmit}>
				<Modal.Body>
					<Form.Group>
						<Form.Label>Account Type</Form.Label>
						<Form.Check
							type="radio"
							id="traveller"
							name="UserType"
							label="Traveller"
							value="traveller"
							defaultChecked
						/>
						<Form.Check
							type="radio"
							id="owner"
							name="UserType"
							label="Site Owner"
							value="owner"
						/>
					</Form.Group>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" type="submit">
						Submit
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
}

export default RegistrationModal;
