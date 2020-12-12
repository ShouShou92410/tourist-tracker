import React from 'react';
import Button from 'react-bootstrap/Button';
import firebase from '../../../services/Firebase';

function TravellerRecommendation() {
	const handleSubmit = async () => {
		const res = await firebase.getRecommendation();
		console.log(res);
	};
	return (
		<>
			<h1>TravellerRecommendation</h1>
			<Button variant="primary" onClick={handleSubmit}>
				Submit
			</Button>
		</>
	);
}

export default TravellerRecommendation;
