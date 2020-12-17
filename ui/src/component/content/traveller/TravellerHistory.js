import React, { useState, useEffect } from 'react';
import firebase from '../../../services/Firebase';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/esm/Container';
import CardColumns from 'react-bootstrap/CardColumns';

function TravellerHistory() {
	const [sites, setSites] = useState([]);
	useEffect(() => {
		const handleWait = async () => {
			const test = await firebase.getVisitedSites();
			console.log(test);
			setSites(test);
			//console.log(sites);
			//sites.forEach((site) => {console.log('hi')});
		};
		handleWait();
	}, []);
	//console.log(sites);

	return (
		<Container>
			<h3>TravellerHistory</h3>
			<CardColumns>
				{sites.map((site, i) => (
					<Card>
						<Card.Img
							variant="top"
							src={`${process.env.PUBLIC_URL}/pexels-beach-tropical-scene-free-stock-photo.jpg`}
						/>
						<Card.Body>
							<Card.Title>{site.name}</Card.Title>
							<Card.Text>Address: {site.address}</Card.Text>
						</Card.Body>
					</Card>
				))}
			</CardColumns>
		</Container>
	);
}

export default TravellerHistory;
