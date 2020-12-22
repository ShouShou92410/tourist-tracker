import app from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import Enumeration from '../utility/Enumeration';

import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_FIREBASE_FUNCTION_URL;

const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
	databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
	appId: process.env.REACT_APP_FIREBASE_APP_ID,
	measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

class Firebase {
	constructor() {
		if (Firebase.singleton) {
			return Firebase.singleton;
		}

		app.initializeApp(firebaseConfig);
		this.auth = app.auth();
		this.db = app.database();
		this.provider = new app.auth.GoogleAuthProvider();
		Firebase.singleton = this;

		return Firebase.singleton;
	}

	onAuthStateChanged() {
		return new Promise((resolve) => {
			this.auth.onAuthStateChanged(resolve);
		});
	}

	signInWithGoogle() {
		return this.auth.signInWithPopup(this.provider);
	}

	signInWithTester(userType) {
		switch (userType) {
			case Enumeration.UserType.TRAVELLER.value:
				return this.auth.signInWithEmailAndPassword(
					process.env.REACT_APP_FIREBASE_TRAVELLER_TESTER_EMAIL,
					process.env.REACT_APP_FIREBASE_TESTER_PASSWORD
				);
			case Enumeration.UserType.SITEOWNER.value:
				return this.auth.signInWithEmailAndPassword(
					process.env.REACT_APP_FIREBASE_SITEOWNER_TESTER_EMAIL,
					process.env.REACT_APP_FIREBASE_TESTER_PASSWORD
				);
			default:
				break;
		}
	}

	signOut() {
		return this.auth.signOut();
	}

	async register(registrationForm) {
		const newUser = {
			name: this.auth.currentUser.displayName,
			type: parseInt(registrationForm.UserType),
		};

		await this.db.ref(`/users/${this.auth.currentUser.uid}`).set(newUser);

		return newUser;
	}

	async updateSite(newSite, id = null) {
		let updates = {};

		if (id === null) {
			id = this.db.ref('sites').push().key;
			updates[`/ownedSites/${this.auth.currentUser.uid}/${id}`] = true;
			updates[`/sites/${id}/numberOfVisits`] = 0;
		}
		updates[`/sites/${id}/name`] = newSite.name;
		updates[`/sites/${id}/address`] = newSite.address;
		updates[`/sites/${id}/amenities`] = newSite.amenities;

		await this.db.ref().update(updates);

		return newSite;
	}

	async updateVisitedSite(id, dateVisited) {
		let updates = {};

		let visitedSite = (
			await this.db.ref(`/visitedSites/${this.auth.currentUser.uid}/${id}`).once('value')
		).val();
		const site = (await this.db.ref(`/sites/${id}`).once('value')).val();

		if (visitedSite === null) {
			updates[`/visitedSites/${this.auth.currentUser.uid}/${id}`] = {
				latestDateVisited: dateVisited,
				numberOfVisits: 1,
			};
		} else {
			if (dateVisited > visitedSite.latestDateVisited) {
				updates[
					`/visitedSites/${this.auth.currentUser.uid}/${id}/latestDateVisited`
				] = dateVisited;
			}
			updates[`/visitedSites/${this.auth.currentUser.uid}/${id}/numberOfVisits`] =
				visitedSite.numberOfVisits + 1;
		}

		updates[`/sites/${id}/numberOfVisits`] = site.numberOfVisits + 1;

		await this.db.ref().update(updates);
	}

	async getSite(id = null) {
		const path = id !== null ? `/sites/${id}` : '/sites';
		const res = await this.db.ref(path).once('value');
		const site = res.val();

		return site;
	}

	// Retrieves user information from the database, returns null if not found
	async getUser(id = null) {
		if (id === null) {
			if (this.auth.currentUser === null) {
				return null;
			}

			id = this.auth.currentUser.uid;
		}

		const res = await this.db.ref(`/users/${id}`).once('value');
		const user = res.val();

		return user;
	}

	// Site owner should provide a site id
	async getRecommendation(siteId = null) {
		const currentUser = this.auth.currentUser;
		const token = await currentUser.getIdToken();

		const res = await axios.get('/recommendation', {
			headers: {
				Authorization: btoa(token),
			},
			params: {
				siteId: siteId,
			},
		});

		return res.data;
	}

	async getVisitedSites() {
		const currentUser = this.auth.currentUser;
		let visitedSites = (
			await this.db.ref(`/visitedSites/${currentUser.uid}`).once('value')
		).val();
		if (visitedSites !== null) {
			visitedSites = Object.entries(visitedSites).map(([key, value]) => ({
				id: key,
				numberOfVisits: value.numberOfVisits,
				latestDateVisited: new Date(value.latestDateVisited),
			}));

			visitedSites = await Promise.all(
				visitedSites.map(async (x) => {
					const site = (await this.db.ref(`/sites/${x.id}`).once('value')).val();
					return {
						...x,
						name: site.name,
						address: site.address,
					};
				})
			);
		} else {
			visitedSites = [];
		}
		return visitedSites;
	}

	async getOwnedSites() {
		const currentUser = this.auth.currentUser;
		let ownedSites = (await this.db.ref(`/ownedSites/${currentUser.uid}`).once('value')).val();
		if (ownedSites !== null) {
			ownedSites = Object.entries(ownedSites).map(([key, value]) => ({
				id: key,
			}));

			ownedSites = await Promise.all(
				ownedSites.map(async (x) => {
					const site = (await this.db.ref(`/sites/${x.id}`).once('value')).val();
					return {
						...x,
						name: site.name,
						address: site.address,
						numberOfVisits: site.numberOfVisits,
					};
				})
			);
		} else {
			ownedSites = [];
		}

		return ownedSites;
	}
	async convertRecommendationOutput(rawRecs) {
		const currentUser = this.auth.currentUser;
		let recommendations = [];

		if (rawRecs !== null) {
			recommendations = await Promise.all(
				rawRecs.map(async (rawRec, i) => {
					let previouslyVisitedObject = await Promise.all(
						rawRec.previouslyVisited.map(async (prevSiteId) => {
							//console.log(prevSiteId);
							const site = (
								await this.db.ref(`/sites/${prevSiteId}`).once('value')
							).val();
							return {
								id: prevSiteId,
								name: site.name,
							};
						})
					);
					//console.log(previouslyVisitedObject);
					let recommendedSitesObjects = await Promise.all(
						rawRec.recommendation.map(async (recSiteId) => {
							const site = (
								await this.db.ref(`/sites/${recSiteId}`).once('value')
							).val();
							return {
								recID: i,
								id: recSiteId,
								name: site.name,
								address: site.address,
								previouslyVisited: previouslyVisitedObject,
							};
						})
					);
					//console.log(recommendedSitesObjects);
					return recommendedSitesObjects;
				})
			);
		}
		//console.log(recommendations);
		const flattened = [].concat.apply([], recommendations);
		//console.log(flattened);
		return flattened;
	}
	async produceSiteObjectFromRec(suggestion, typeString) {
		let obj = await Promise.all(
			suggestion.map(async (siteId) => {
				const site = (await this.db.ref(`/sites/${siteId}`).once('value')).val();
				return {
					id: siteId,
					name: site.name,
					address: site.address,
					numberOfVisits: site.numberOfVisits,
					type: typeString,
				};
			})
		);
		return obj;
	}
	async convertRecommendationOutput2(rawRecs) {
		const currentUser = this.auth.currentUser;
		let recommendations = [];
		if (rawRecs !== null) {
			if (rawRecs.highestConfidence !== null) {
				let highestConfidenceObject = await Promise.all(
					await this.produceSiteObjectFromRec(
						rawRecs.highestConfidence.suggestion,
						'A Highest Confidence Site'
					)
				);

				recommendations.push(highestConfidenceObject);
			}
			if (rawRecs.highestSupport !== null) {
				let highestSupportObject = await Promise.all(
					await this.produceSiteObjectFromRec(
						rawRecs.highestSupport.suggestion,
						'A Highest Support Site'
					)
				);
				recommendations.push(highestSupportObject);
			}
			if (rawRecs.highestSupportConfidence !== null) {
				let highestSupportConfidenceObject = await Promise.all(
					await this.produceSiteObjectFromRec(
						rawRecs.highestSupportConfidence.suggestion,
						'A Highest Support-Confidence Site'
					)
				);
				recommendations.push(highestSupportConfidenceObject);
			}
			recommendations = [].concat.apply([], recommendations);
		}
		return recommendations;
	}
}

export default new Firebase();
