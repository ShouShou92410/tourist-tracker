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
		this.provider = new app.auth.GoogleAuthProvider();
		Firebase.singleton = this;

		return Firebase.singleton;
	}

	isInitialized() {
		return !!Firebase.singleton;
	}

	signInWithGoogle() {
		return this.auth.signInWithPopup(this.provider);
	}

	signOut() {
		return this.auth.signOut();
	}

	get(id) {
		return null;
		return { ...this.auth.currentUser, type: 'traveller' };
	}

	register(type) {
		return { ...this.auth.currentUser, type };
	}
}

export default new Firebase();
