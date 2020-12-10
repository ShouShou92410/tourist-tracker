import app from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

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
			type: registrationForm.UserType,
		};

		await this.db.ref(`/Users/${this.auth.currentUser.uid}`).set(newUser);

		return newUser;
	}

	// Retrieves user information from the database, returns null if not found
	async getUser(id = null) {
		if (id === null) {
			if (this.auth.currentUser === null) {
				return null;
			}

			id = this.auth.currentUser.uid;
		}

		const res = await this.db.ref(`/Users/${id}`).once('value');
		const user = res.val();

		return user;
	}
}

export default new Firebase();
