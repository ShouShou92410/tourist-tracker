import app from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

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
		}
		updates[`/sites/${id}`] = newSite;

		await this.db.ref().update(updates);

		return newSite;
	}

	async updateVisitedSite(id, dateVisited) {
		let updates = {};
		console.log(id, dateVisited);

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

	async getRecommendation() {
		const currentUser = this.auth.currentUser;
		const token = await currentUser.getIdToken();

		const res = await axios.get('/recommendation', {
			headers: {
				Authorization: btoa(token),
			},
		});

		return res.data;
	}

	async getVisitedSites() {
		const currentUser = this.auth.currentUser;
		const siteIdsRef = await this.db.ref(`/visitedSites/${currentUser?.uid}`).once('value');
		const visitedSites = siteIdsRef.val() || [];
		//console.log(siteIdsRef.val());
		const sites = await Promise.all(
			visitedSites.map(async (siteId) => {
				//console.log(siteIdRef.val())
				let siteRef = await this.db.ref(`/sites/${siteId}`).once('value');
				console.log(siteRef.val());
				return siteRef.val();
				//console.log(sites);
			})
		);
		console.log(sites);
		return sites;
	}
}

export default new Firebase();
