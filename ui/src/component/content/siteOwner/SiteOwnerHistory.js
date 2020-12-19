import React, { useState, useEffect } from 'react';
import firebase from '../../../services/Firebase';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/esm/Container';
import CardColumns from 'react-bootstrap/CardColumns';
import { Link } from 'react-router-dom';

function SiteOwnerHistory() {
	const [sites, setSites] = useState([]);
	useEffect(() => {
		const handleWait = async () => {
			const ownedSites = await firebase.getOwnedSites();
			setSites(ownedSites);
		};
		handleWait();
	}, []);

	return (
		<Container>
			<h3>My Tourist Sites</h3>
			<CardColumns style={{ columnCount: 2 }}>
				{sites.map((site) => (
					<Card key={site.id} as={Link} to={`/dataentry/${site.id}`}>
						<Card.Img
							variant="top"
							src={`${process.env.PUBLIC_URL}/pexels-beach-tropical-scene-free-stock-photo.jpg`}
						/>
						<Card.Body>
							<Card.Title>{site.name}</Card.Title>
							<Card.Text>
								<i>{site.address}</i>
							</Card.Text>
						</Card.Body>
						<Card.Footer>
							<small className="text-muted">
								Your site has been visited <b>{site.numberOfVisits}</b> times.
							</small>
						</Card.Footer>
					</Card>
				))}
			</CardColumns>
		</Container>
	);
}

export default SiteOwnerHistory;
