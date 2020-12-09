import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SideBar from '../content/SideBar';
import { UserContext } from '../utility/Context';

function Dashboard() {
	const currentUser = useContext(UserContext);

	return (
		<Container>
			<Row>
				<Col>
					<SideBar />
				</Col>
				<Col>
					<h1>Welcome {currentUser?.name}</h1>
				</Col>
			</Row>
		</Container>
	);
}

export default Dashboard;
