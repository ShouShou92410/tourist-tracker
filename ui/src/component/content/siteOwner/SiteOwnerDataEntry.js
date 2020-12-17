import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/esm/Container';
import Enumeration from '../../../utility/Enumeration';
import firebase from '../../../services/Firebase';

function SiteOwnerDataEntry() {
	const history = useHistory();
	const [amenityForm, setAmenityForm] = useState({
		...Array(Object.values(Enumeration.Amenity).length).fill(null),
	});

	const handleAmenityClick = (e) => {
		const index = e.target.id;
		const value = e.target.value;
		const newAmenityForm = { ...amenityForm };

		newAmenityForm[index] = newAmenityForm[index] === null ? value : null;

		setAmenityForm(newAmenityForm);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const amenities = Object.values(amenityForm)
			.filter((x) => x !== null)
			.join();

		const formData = new FormData(e.target);
		const newSite = {
			...Object.fromEntries(formData.entries()),
			amenities,
			numberOfVisits: 0,
		};

		const site = await firebase.updateSite(newSite);
		console.log(site);

		history.push('/history');
	};
	return (
		<Container>
			<h3>Add New Tourist Site</h3>

			<Form onSubmit={handleSubmit}>
				<Form.Group>
					<Form.Label>Site Name</Form.Label>
					<Form.Control placeholder="Site Name" name="Name" />
				</Form.Group>
				<Form.Group>
					<Form.Label>Address</Form.Label>
					<Form.Control placeholder="Address" name="Address" />
				</Form.Group>
				<Form.Group>
					<Form.Label>Amenity</Form.Label>
					<ListGroup style={{ overflow: 'auto', maxHeight: '40vh' }}>
						{Object.values(Enumeration.Amenity).map(({ label, value }, index) => (
							<ListGroup.Item
								action
								type="button"
								id={index}
								key={index}
								onClick={handleAmenityClick}
								value={value}
							>
								{label}
								{amenityForm[index] && (
									<Badge variant="success" className="float-right">
										Added
									</Badge>
								)}
							</ListGroup.Item>
						))}
					</ListGroup>
				</Form.Group>
				<Button variant="primary" type="submit" className="float-right">
					Submit
				</Button>
			</Form>
		</Container>
	);
}

export default SiteOwnerDataEntry;
