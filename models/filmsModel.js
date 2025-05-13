import { ObjectId } from 'mongodb';
import connectToMongoDB from '../db/mongo.js';

async function getFilms(page = 1) {
	let mongoClient;
	let tousLesFilms;
	const numbToSkip = page - 1;
	const numbToLimit = 20;
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

async function updateOneFilm(id, data) {
	let mongoClient;
	try {
		mongoClient = await connectToMongoDB(process.env.DB_URI);
		const m2iDb = mongoClient.db('m2i');
		const films = m2iDb.collection('films');

		const updateStatus = await films.updateOne(
			{ _id: ObjectId.createFromHexString(id) },
			{ $set: data }
		);
		console.log(updateStatus);
	} catch (error) {
		console.log(error);

		return { error: true };
	} finally {
		mongoClient.close();
	}
}

async function deleteOneFilm(id) {
	let mongoClient;
	try {
		mongoClient = await connectToMongoDB(process.env.DB_URI);
		const m2iDb = mongoClient.db('m2i');
		const films = m2iDb.collection('films');

		const status = await films.deleteOne({
			_id: ObjectId.createFromHexString(id),
		});
		return status;
	} catch (error) {
		console.log(error);

		return { error: true };
	} finally {
		mongoClient.close();
	}
}

export { getFilms, ajoutFilm, updateOneFilm, deleteOneFilm };
