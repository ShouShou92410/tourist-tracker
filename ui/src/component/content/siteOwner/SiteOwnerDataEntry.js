import React, { useState, useEffect } from 'react';
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
	const [siteId, setSiteId] = useState(null);
	const [recommendations, setRecommendations] = useState({
		...Array(Object.values(Enumeration.Amenity).length).fill(null),
	});
	const [form, setForm] = useState({
		name: '',
		address: '',
	});
	const [amenityForm, setAmenityForm] = useState({
		...Array(Object.values(Enumeration.Amenity).length).fill(null),
	});

	useEffect(() => {
		const fetchData = async (id) => {
			const site = await firebase.getSite(id);

			setForm({
				name: site.name,
				address: site.address,
			});

			const newAmenityForm = { ...amenityForm };
			const newRecommendations = { ...recommendations };
			site.amenities.split(',').forEach((x) => (newAmenityForm[x - 1] = x));
			setAmenityForm(newAmenityForm);

			const rec = new URLSearchParams(window.location.search);
			const recString = rec.get('recommendations');
			if (recString !== null) {
				recString.split(',').forEach((x) => (newRecommendations[x - 1] = true));
				setRecommendations(newRecommendations);
			}
		};

		const id = window.location.pathname.split('/').pop();
		if (id !== 'dataentry' && siteId === null) {
			fetchData(id);
			setSiteId(id);
		}
	}, [amenityForm, recommendations, siteId]);

	const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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

		const newSite = {
			...form,
			amenities,
			numberOfVisits: 0,
		};

		await firebase.updateSite(newSite, siteId);
		history.push('/history');
	};
	return (
		<Container>
			<h3>{siteId !== null ? 'Edit' : 'Add New'} Tourist Site</h3>

			<Form onSubmit={handleSubmit}>
				<Form.Group>
					<Form.Label>Site Name</Form.Label>
					<Form.Control
						placeholder="Site Name"
						name="name"
						value={form.name}
						onChange={handleFormChange}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Label>Address</Form.Label>
					<Form.Control
						placeholder="Address"
						name="address"
						value={form.address}
						onChange={handleFormChange}
					/>
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
									<Badge variant="success" className="ml-1 mr-1 float-right">
										Added
									</Badge>
								)}
								{recommendations[index] && (
									<Badge variant="warning" className="ml-1 mr-1 float-right">
										Recommend
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
