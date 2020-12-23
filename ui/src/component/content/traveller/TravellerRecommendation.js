import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/esm/Container';
import firebase from '../../../services/Firebase';
import Card from 'react-bootstrap/Card';
import CardColumns from 'react-bootstrap/CardColumns';

function TravellerRecommendation() {
	const [sites, setSites] = useState([]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const res = await firebase.getRecommendation();
		const recommendedSites = await firebase.convertRecommendationOutput2(res);
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
