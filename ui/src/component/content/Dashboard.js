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
import TravellerHistory from './traveller/TravellerHistory';
import SiteOwnerHistory from './siteOwner/SiteOwnerHistory';
import TravellerDefault from './traveller/TravellerDefault';
import SiteOwnerDefault from './siteOwner/SiteOwnerDefault';

function Dashboard() {
	const currentUser = useContext(UserContext);

	const getRouteElement = () => {
		switch (currentUser.type) {
			case Enumeration.UserType.TRAVELLER.value:
				return (
					<Switch>
						<Route exact path="/recommendation">
							<TravellerRecommendation />
						</Route>
						<Route exact path="/dataentry">
							<TravellerDataEntry />
						</Route>
						<Route exact path="/history">
							<TravellerHistory />
						</Route>
						<Route path="/">
							<TravellerDefault />
						</Route>
					</Switch>
				);
			case Enumeration.UserType.SITEOWNER.value:
				return (
					<Switch>
						<Route exact path="/recommendation">
							<SiteOwnerRecommendation />
						</Route>
						<Route exact path="/dataentry">
							<SiteOwnerDataEntry />
						</Route>
						<Route exact path="/dataentry/:ID">
							<SiteOwnerDataEntry />
						</Route>
						<Route exact path="/history">
							<SiteOwnerHistory />
						</Route>
						<Route path="/">
							<SiteOwnerDefault />
						</Route>
					</Switch>
				);
			default:
				return;
		}
	};

	return (
		<Container className="pt-2 pb-2">
			<Row>
				<Col xs={3}>
					<SideBar />
				</Col>
				<Col xs={9}>{getRouteElement()}</Col>
			</Row>
		</Container>
	);
}

export default Dashboard;
