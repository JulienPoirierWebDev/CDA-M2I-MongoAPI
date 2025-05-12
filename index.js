import 'dotenv/config';

import express from 'express';
import { MongoClient } from 'mongodb';
import {
	getFilms,
	ajoutFilm,
	updateOneFilm,
	deleteOneFilm,
} from './models/films.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.get('/', (req, res) => {
	res.send('Hello World!');
});


function removeBlankAttributes(obj) {
	const result = {};
	for (const key in obj) {
		if (obj[key] !== null && obj[key] !== undefined) {
			result[key] = obj[key];
		}
	}
	return result;
}

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

app.put('/films/:id', async (req, res) => {
	const id = req.params.id;

	const { nom, realisateur, types, date, duree, resume } = req.body;
	const update = removeBlankAttributes({
		nom,
		realisateur,
		types,
		date,
		duree,
		resume,
	});

	const status = await updateOneFilm(id, update);

	if (status?.error) {
		return res
			.status(500)
			.json({ error: true, message: "Le film n'a pas été modifié" });
	} else {
		res.json({
			message: 'Le film a été modifié',
		});
	}
});

app.delete('/films/:id', async (req, res) => {
	const id = req.params.id;

	const status = await deleteOneFilm(id);

	if (status?.error) {
		return res
			.status(500)
			.json({ error: true, message: "Le film n'a pas été supprimé" });
	} else {
		if (status.deletedCount > 0) {
			res.json({
				message: 'Le film a été supprimé',
			});
		} else {
			res.status(404).json({
				message: "Le film n'a pas été supprimé, merci de vérifier l'id",
			});
		}
	}
});

app.listen(process.env.PORT, () => {
	console.log(`serveur lancé sur le port ${process.env.PORT}`);
});
