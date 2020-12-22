import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';

function GuestDashboard() {
	return (
		<Jumbotron className="mb-0" style={{ height: '100%' }}>
			<h1>Hello, world!</h1>
			<p>
				This is a simple hero unit, a simple jumbotron-style component for calling extra
				attention to featured content or information.
			</p>
		</Jumbotron>
	);
}

export default GuestDashboard;
