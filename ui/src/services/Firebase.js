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
}

export default new Firebase();
