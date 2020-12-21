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
import firebase from '../../../services/Firebase';
import Enumeration from '../../../utility/Enumeration';

function SiteOwnerRecommendation() {
	const [sites, setSites] = useState([]);
	const [siteId, setSiteId] = useState(null);
	const [amenityRecommendation, setAmenityRecommendation] = useState(null);

	useEffect(() => {
		const handleWait = async () => {
			const ownedSites = await firebase.getOwnedSites();
			setSites(ownedSites);
		};
		handleWait();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);
		const recommendationForm = Object.fromEntries(formData.entries());

		const res = '1,3,4,5,6,7,8,9,10,11'; //await firebase.getRecommendation(recommendationForm.siteToImprove);
		const amenityArray = Object.values(Enumeration.Amenity);
		const newAmenityRecommendation = res
			.split(',')
			.map((x) => amenityArray.find((y) => parseInt(x) === y.value));
		setAmenityRecommendation(newAmenityRecommendation);
		setSiteId(recommendationForm.siteToImprove);
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
						<Button variant="primary" type="submit" className="float-right">
							Submit
						</Button>
					</Form>
				</Col>
			</Row>
			{amenityRecommendation && (
				<Row>
					<Col>
						<Accordion className="mb-3" defaultActiveKey="0">
							<Accordion.Toggle as={Card.Header} eventKey="0">
								We recommend you add the following
							</Accordion.Toggle>
							<Accordion.Collapse eventKey="0">
								<ListGroup style={{ overflow: 'auto', maxHeight: '40vh' }}>
									{amenityRecommendation.map(({ label }, index) => (
										<ListGroup.Item id={index} key={index}>
											{label}
										</ListGroup.Item>
									))}
								</ListGroup>
							</Accordion.Collapse>
						</Accordion>
						<Button
							size="sm"
							variant="success"
							className="float-right"
							as={Link}
							to={`/dataentry/${siteId}`}
						>
							Add them now!
						</Button>
					</Col>
				</Row>
			)}
		</Container>
	);
}

export default SiteOwnerRecommendation;
