import React, { useState, useEffect } from 'react';
import firebase from '../../../services/Firebase';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/esm/Container';
import CardColumns from 'react-bootstrap/CardColumns';

function TravellerHistory() {
	const [sites, setSites] = useState([]);
	useEffect(() => {
		const handleWait = async () => {
			const visitedSites = await firebase.getVisitedSites();
			setSites(visitedSites);
		};
		handleWait();
	}, []);

	return (
		<Container>
			<h3>Travel History</h3>
			<CardColumns style={{ columnCount: 2 }}>
				{sites.map((site) => (
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
								You have visited <b>{site.numberOfVisits}</b> times.
							</Card.Text>
						</Card.Body>
						<Card.Footer>
							<small className="text-muted">
								Last visited on {site.latestDateVisited.toLocaleDateString()}
							</small>
						</Card.Footer>
					</Card>
				))}
			</CardColumns>
		</Container>
	);
}

export default TravellerHistory;
