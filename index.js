import 'dotenv/config';

import express from 'express';
import { MongoClient } from 'mongodb';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

export async function connectToMongoDB(uri) {
	let mongoClient;

	try {
		mongoClient = new MongoClient(uri);
		console.log('Connecting to MongoDB...');
		await mongoClient.connect();
		console.log('Successfully connected to MongoDB!');

		return mongoClient;
	} catch (error) {
		console.error('Connection to MongoDB failed!', error);
		process.exit();
	}
}

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.get('/mongodb', (req, res) => {
	res.send("J'aime trop mongodb <3 !");
});

async function getFilms(page = 1) {
	let mongoClient;
	let tousLesFilms;
	const numbToSkip = page - 1;
	const numbToLimit = 10;
	try {
		mongoClient = await connectToMongoDB(process.env.DB_URI);
		const m2iDb = mongoClient.db('m2i');
		const films = m2iDb.collection('films');
		tousLesFilms = await films
			.find()
			.skip(numbToLimit * numbToSkip)
			.limit(numbToLimit)
			.toArray();
	} finally {
		mongoClient.close();
	}

	return tousLesFilms;
}

async function ajoutFilm(film) {
	let mongoClient;
	try {
		mongoClient = await connectToMongoDB(process.env.DB_URI);
		const m2iDb = mongoClient.db('m2i');
		const films = m2iDb.collection('films');
		await films.insertOne({ ...film, date: new Date(film.date) });
	} catch (error) {
		return { error: true };
	} finally {
		mongoClient.close();
	}
}

// CRUD

// Create
app.post('/films', async (req, res) => {
	const film = req.body;

	// vérification des champs de tous les champs
	if (!film.date || !film.nom) {
		return res
			.status(404)
			.json({ error: true, message: 'il manque des champs' });
	}

	const status = await ajoutFilm(film);

	if (status?.error) {
		return res
			.status(500)
			.json({ error: true, message: "Le film n'a pas été ajouté" });
	} else {
		res.json({
			message: 'Le film a été ajouté',
			film,
		});
	}
});

// Read
app.get('/films', async (req, res) => {
	const page = req.query.page;
	console.log(page);

	const tousLesFilms = await getFilms(page);
	res.json(tousLesFilms);
});

app.listen(process.env.PORT, () => {
	console.log(`serveur lancé sur le port ${process.env.PORT}`);
});
