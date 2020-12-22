import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';

function GuestDashboard() {
	return (
		<Jumbotron className="mb-0" style={{ height: '100%' }}>
			<h1>Welcome to Tourist-Tracker!</h1>
			<p>
				Tourist-Tracker is a website where you can keep track of all tourist locations that
				you have visited and get recommendations for new locations to vist as well! Tourist
				site owners can also make use of this website as they can get recommendations for
				new amenities that they can add to their site based on state-of-the-art data-mining
				techniques!
			</p>
		</Jumbotron>
	);
}

export default GuestDashboard;
