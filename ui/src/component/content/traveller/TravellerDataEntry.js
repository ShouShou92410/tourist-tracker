import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/esm/Container';

function TravellerDataEntry() {
	const handleSubmit = async () => {};

	return (
		<Container>
			<h3>TravellerDataEntry</h3>

			<Form onSubmit={handleSubmit}>
				<Form.Row>
					<Form.Group as={Col}>
						<Form.Label>Location</Form.Label>
						<Form.Control as="select">
							<option>Location1</option>
							<option>Location2</option>
							<option>Location3</option>
							<option>Location4</option>
							<option>Location5</option>
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

export default TravellerDataEntry;
