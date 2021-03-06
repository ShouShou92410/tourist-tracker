import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Spinnger from 'react-bootstrap/Spinner';
import firebase from '../../../services/Firebase';
import Enumeration from '../../../utility/Enumeration';

function SiteOwnerRecommendation() {
	const [sites, setSites] = useState([]);
	const [siteId, setSiteId] = useState(null);
	const [recommendations, setRecommendations] = useState(null);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		const handleWait = async () => {
			const ownedSites = await firebase.getOwnedSites();
			setSites(ownedSites);
		};
		handleWait();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);

		const formData = new FormData(e.target);
		const recommendationForm = Object.fromEntries(formData.entries());

		const res = await firebase.getRecommendation(recommendationForm.siteToImprove);

		const amenityArray = Object.values(Enumeration.Amenity);
		const newRecommendations = res.map((r) => ({
			...r,
			amenitiesDisplay: r.amenitiesToAdd
				.split(',')
				.map((x) => amenityArray.find((y) => parseInt(x) === y.value).label),
		}));
		setRecommendations(newRecommendations);
		setSiteId(recommendationForm.siteToImprove);
		setSubmitting(false);
	};
	return (
		<Container>
			<h3>Tourist Site Amenity Recommendation</h3>

			<Row className="mb-5">
				<Col>
					<Form onSubmit={handleSubmit}>
						<Form.Group>
							<Form.Label>My Sites</Form.Label>
							<Form.Control as="select" name="siteToImprove">
								{sites.map((x) => (
									<option key={x.id} value={x.id}>
										{x.name} ({x.address})
									</option>
								))}
							</Form.Control>
						</Form.Group>
						<Button
							variant="primary"
							type="submit"
							className="float-right"
							disabled={submitting}
						>
							{submitting && <Spinnger animation="border" size="sm" />}
							Submit
						</Button>
					</Form>
				</Col>
			</Row>
			{siteId &&
				recommendations.map((r) => (
					<Row className="mb-3 mt-3">
						<Col xs={10}>
							<Accordion>
								<Accordion.Toggle as={Card.Header} eventKey="0">
									We recommend adding the following{' '}
									<b>{r.amenitiesDisplay.length}</b> amenities.
								</Accordion.Toggle>
								<Accordion.Collapse eventKey="0">
									<ListGroup style={{ overflow: 'auto', maxHeight: '40vh' }}>
										{r.amenitiesDisplay.map((label, index) => (
											<ListGroup.Item id={index} key={index}>
												{label}
											</ListGroup.Item>
										))}
									</ListGroup>
								</Accordion.Collapse>
							</Accordion>
						</Col>
						<Col xs={2}>
							<Button
								variant="success"
								className="float-right"
								as={Link}
								to={`/dataentry/${siteId}?recommendations=${r.amenitiesToAdd}`}
							>
								Add them!
							</Button>
						</Col>
					</Row>
				))}
		</Container>
	);
}

export default SiteOwnerRecommendation;
