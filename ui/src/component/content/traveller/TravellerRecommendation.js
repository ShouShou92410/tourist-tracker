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
		//console.log(res);
		/*const exampleRecommendation = [
			{
				previouslyVisited: ['-MOite0SsPDh4MKsDJx0', '-MOnEb1BUGWHXo26ziFP'],
				recommendation: ['-MOnK9CXgBaexcACfFgq', '-MOnTauTXrkV1VwP5-9w'],
			},
			{
				previouslyVisited: ['-MOite0SsPDh4MKsDJx0', '-MOnEb1BUGWHXo26ziFP'],
				recommendation: ['-MOnK9CXgBaexcACfFgq', '-MP2fsk9JvGR47zCDEA1'],
			},
		];*/
		const recommendedSites = await firebase.convertRecommendationOutput(res);
		/*const testData = [
			{
				address: 'none',
				name: 'example1',
				id: '1',
				previouslyVisited: [
					{
						id: 'id1',
						name: 'siteName',
					},
					{
						id: 'id2',
						name: 'siteName2',
					},
				],
			},
			{
				address: 'none',
				name: 'example2',
				id: '2',
				previouslyVisited: [
					{
						id: 'id1',
						name: 'siteName',
					},
					{
						id: 'id2',
						name: 'siteName2',
					},
				],
			},
		];
		setSites(testData);*/
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
					<Card key={`Rec${site.recID}:${site.id}`}>
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
							<OverlayTrigger
								key="top"
								placement="top"
								overlay={
									<Popover id={`popover-positioned-top`}>
										<Popover.Title as="h3">
											Recommended because you visited:
										</Popover.Title>
										<Popover.Content>
											<ListGroup variant="flush">
												{site.previouslyVisited.map((visitedSite) => (
													<ListGroup.Item key={visitedSite.id}>
														{visitedSite.name}
													</ListGroup.Item>
												))}
											</ListGroup>
										</Popover.Content>
									</Popover>
								}
							>
								<Button variant="secondary" size="sm" block>
									Recommendation Info
								</Button>
							</OverlayTrigger>
						</Card.Footer>
					</Card>
				))}
			</CardColumns>
		</Container>
	);
}

export default TravellerRecommendation;
