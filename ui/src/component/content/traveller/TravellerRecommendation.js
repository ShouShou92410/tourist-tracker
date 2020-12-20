import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/esm/Container';
import firebase from '../../../services/Firebase';

function TravellerRecommendation() {
	const handleSubmit = async (e) => {
		e.preventDefault();
		const res = await firebase.getRecommendation();
		console.log(res);
	};
	return (
		<Container>
			<h3>TravellerRecommendation</h3>

			<Form onSubmit={handleSubmit}>
				<Form.Row>
					<Form.Group as={Col}>
						<Form.Label>City</Form.Label>
						<Form.Control as="select">
							<option>London</option>
							<option>Paris</option>
							<option>New York</option>
							<option>Calgary</option>
							<option>Toronto</option>
						</Form.Control>
					</Form.Group>
					<Form.Group as={Col}>
						<Form.Label>Rating</Form.Label>
						<Form.Control as="select">
							<option>1</option>
							<option>2</option>
							<option>3</option>
							<option>4</option>
							<option>5</option>
						</Form.Control>
					</Form.Group>
				</Form.Row>
				<Button variant="primary" type="submit" className="float-right">
					Submit
				</Button>
			</Form>
		</Container>
	);
}

export default TravellerRecommendation;
