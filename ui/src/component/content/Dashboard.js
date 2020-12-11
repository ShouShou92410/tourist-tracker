import React, { useContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SideBar from './SideBar';
import { UserContext } from '../../utility/Context';
import Enumeration from '../../utility/Enumeration';
import TravellerDataEntry from './traveller/TravellerDataEntry';
import SiteOwnerDataEntry from './siteOwner/SiteOwnerDataEntry';
import TravellerRecommendation from './traveller/TravellerRecommendation';
import SiteOwnerRecommendation from './siteOwner/SiteOwnerRecommendation';

function Dashboard() {
	const currentUser = useContext(UserContext);

	const getRouteElement = () => {
		switch (currentUser.type) {
			case Enumeration.UserType.TRAVELLER:
				return (
					<Switch>
						<Route path="/recommendation">
							<TravellerRecommendation />
						</Route>
						<Route path="/">
							<TravellerDataEntry />
						</Route>
					</Switch>
				);
			case Enumeration.UserType.SITEOWNER:
				return (
					<Switch>
						<Route path="/recommendation">
							<SiteOwnerRecommendation />
						</Route>
						<Route path="/">
							<SiteOwnerDataEntry />
						</Route>
					</Switch>
				);
		}
	};

	return (
		<Container>
			<Row>
				<Col>
					<SideBar />
				</Col>
				<Col>{getRouteElement()}</Col>
			</Row>
		</Container>
	);
}

export default Dashboard;
