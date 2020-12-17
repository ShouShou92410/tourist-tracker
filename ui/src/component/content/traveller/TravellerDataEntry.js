import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/esm/Container';
import firebase from '../../../services/Firebase';

function TravellerDataEntry() {
	const history = useHistory();
	const [siteOptions, setSiteOptions] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			const sites = await firebase.getSite();
			setSiteOptions(
				Object.entries(sites).map(([key, value]) => ({ id: key, name: value.name }))
			);
		};

		fetchData();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);
		const form = Object.fromEntries(formData.entries());
		console.log(form);
		history.push('/history');
	};

	return (
		<Container>
			<h3>Add a visited tourist site</h3>

			<Form onSubmit={handleSubmit}>
				<Form.Group>
					<Form.Label>Tourist Site</Form.Label>
					<Form.Control as="select" name="visitedSite">
						{siteOptions.map((x) => (
							<option value={x.id}>{x.name}</option>
						))}
					</Form.Control>
				</Form.Group>
				<Button variant="primary" type="submit" className="float-right">
					Submit
				</Button>
			</Form>
		</Container>
	);
}

export default TravellerDataEntry;
