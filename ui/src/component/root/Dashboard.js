import React, { useContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SideBar from '../content/SideBar';
import { UserContext } from '../../utility/Context';
import Enumeration from '../../utility/Enumeration';
import TravellerDataEntry from '../content/traveller/TravellerDataEntry';
import SiteOwnerDataEntry from '../content/siteOwner/SiteOwnerDataEntry';
import TravellerRecommendation from '../content/traveller/TravellerRecommendation';
import SiteOwnerRecommendation from '../content/siteOwner/SiteOwnerRecommendation';

function Dashboard() {
	const currentUser = useContext(UserContext);

	const routeElement = () => {
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
			default:
				break;
		}
	};

	return (
		<Container>
			<Row>
				<Col>
					<SideBar />
				</Col>
				<Col>{routeElement()}</Col>
			</Row>
		</Container>
	);
}

export default Dashboard;
