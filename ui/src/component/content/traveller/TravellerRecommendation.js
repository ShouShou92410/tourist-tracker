import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/esm/Container';
import firebase from '../../../services/Firebase';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Spinnger from 'react-bootstrap/Spinner';

function TravellerRecommendation() {
	const [sites, setSites] = useState([]);
	const [submitting, setSubmitting] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		const res = await firebase.getRecommendation();
		const recommendedSites = await firebase.convertRecommendationOutput2(res);
		setSites(recommendedSites);
		setSubmitting(false);
	};
	return (
		<Container>
			<h3>Tourist Site Recommendation</h3>

			<Form onSubmit={handleSubmit}>
				<Button variant="primary" type="submit" block disabled={submitting}>
					{submitting && <Spinnger animation="border" size="sm" />}
					Get Recommendations
				</Button>
			</Form>
			<br />
			<br />
			<br />
			{sites.map((group, i) => (
				<div key={`siteType~${i}`}>
					<h4>{group[0].type}</h4>
					<CardGroup key={i} className="pb-4">
						{group.map((site) => (
							<Card key={site.id}>
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
										This site has been visited <b>{site.numberOfVisits}</b>{' '}
										times.
									</small>
								</Card.Footer>
							</Card>
						))}
					</CardGroup>
				</div>
			))}
		</Container>
	);
}

export default TravellerRecommendation;
