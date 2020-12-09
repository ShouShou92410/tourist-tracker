import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function RegistrationModal({ setCurrentUser }) {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleSubmit = (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);
		const result = Object.fromEntries(formData.entries());
		console.log(result);

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
