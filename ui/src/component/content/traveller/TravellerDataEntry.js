import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/esm/Container';
import firebase from '../../../services/Firebase';

function TravellerDataEntry() {
	const history = useHistory();
	const [siteOptions, setSiteOptions] = useState([]);
	const [dateVisited, setDateVisited] = useState(new Date());

	useEffect(() => {
		const fetchData = async () => {
			const sites = await firebase.getSite();
			setSiteOptions(
				Object.entries(sites).map(([key, value]) => ({
					id: key,
					name: value.name,
					address: value.address,
				}))
			);
		};

		fetchData();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);
		const visitedSiteForm = Object.fromEntries(formData.entries());

		await firebase.updateVisitedSite(visitedSiteForm.visitedSite, dateVisited.getTime());
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
							<option key={x.id} value={x.id}>
								{x.name} ({x.address})
							</option>
						))}
					</Form.Control>
				</Form.Group>
				<Form.Group>
					<Form.Label>Date Visited</Form.Label>
					<div>
						<Form.Control
							as={DatePicker}
							selected={dateVisited}
							onChange={(date) => setDateVisited(date)}
						/>
					</div>
				</Form.Group>
				<Button variant="primary" type="submit" className="float-right">
					Submit
				</Button>
			</Form>
		</Container>
	);
}

export default TravellerDataEntry;
