import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/esm/Container';
import firebase from '../../../services/Firebase';
import Card from 'react-bootstrap/Card';
import CardColumns from 'react-bootstrap/CardColumns';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import ListGroup from 'react-bootstrap/ListGroup';
import Firebase from '../../../services/Firebase';

function TravellerRecommendation() {
	const [sites, setSites] = useState([]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const res = await firebase.getRecommendation();
		/*const exampleRecommendation = {
			highestConfidence: {
				suggestion: [
					'-MOite0SsPDh4MKsDJx0',
					'-MOnCvxrlcK2MZHyrTeu',
					'-MOnEb1BUGWHXo26ziFP',
				],
				value: 1,
			},
			highestSupport: {
				suggestion: [
					'-MOnGyXbvVg--B4r8x3j',
					'-MOnK9CXgBaexcACfFgq',
					'-MOnTauTXrkV1VwP5-9w',
				],
				value: 0.3333333333333333,
			},
			highestSupportConfidence: {
				suggestion: [
					'-MOxPtTFxa8IoLLTUVP7',
					'-MOxoRHmIh0hHru5dAJ2',
					'-MP2M1iJ6jMf6O39FneA',
				],
				value: 0.3333333333333333,
			},
		};*/
		const recommendedSites = await firebase.convertRecommendationOutput2(res);
		//console.log(recommendedSites);
		setSites(recommendedSites);
	};
	return (
		<Container>
			<h3>Tourist Site Recommendation</h3>

			<Form onSubmit={handleSubmit}>
				<Button variant="primary" type="submit" block>
					Get Recommendations
				</Button>
			</Form>
			<br />
			<br />
			<br />
			<CardColumns style={{ columnCount: 2 }}>
				{sites.map((site) => (
					<Card key={site.id}>
						<Card.Header>
							<small className="text-muted">{site.type}</small>
						</Card.Header>
						<Card.Img
							variant="top"
							src={`${process.env.PUBLIC_URL}/pexels-beach-tropical-scene-free-stock-photo.jpg`}
						/>
						<Card.Body>
							<Card.Title>{site.name}</Card.Title>
							<Card.Text>
								<i>{site.address}</i>
								<br />
							</Card.Text>
						</Card.Body>
						<Card.Footer>
							<small className="text-muted">
								This site has been visited <b>{site.numberOfVisits}</b> times.
							</small>
						</Card.Footer>
					</Card>
				))}
			</CardColumns>
		</Container>
	);
}

export default TravellerRecommendation;
