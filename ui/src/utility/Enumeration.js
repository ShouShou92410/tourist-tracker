const Enumeration = Object.freeze({
	UserType: Object.freeze({
		TRAVELLER: {
			label: 'Traveller',
			value: 1,
		},
		SITEOWNER: {
			label: 'Site Owner',
			value: 2,
		},
	}),
	Amenity: Object.freeze({
		TOILETS: {
			label: 'Toilets',
			value: 1,
		},
		FREE_TOILETRIES: {
			label: 'Free Toiletries',
			value: 2,
		},
		PETS: {
			label: 'Pets Allowed',
		},
		/*VIEW: {
			label: 'View',
			value: 1,
		},
		TV: {
			label: 'TV',
			value: 2,
		},
		TOILET: {
			label: 'Toilet',
			value: 3,
		},
		PETSALLOWED: {
			label: 'Pets are allowed',
			value: 4,
		},
		PETSNOTALLOWED: {
			label: 'Pets are not allowed',
			value: 5,
		},
		GAMESROOM: {
			label: 'Games room',
			value: 6,
		},
		GYM: {
			label: 'Gym',
			value: 7,
		},
		MOVIETHEATER: {
			label: 'Movie theater',
			value: 8,
		},
		KARAOKE: {
			label: 'Karaoke',
			value: 9,
		},*/
	}),
});

export default Enumeration;
