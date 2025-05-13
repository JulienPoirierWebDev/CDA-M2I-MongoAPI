import {
	getFilms,
	ajoutFilm,
	updateOneFilm,
	deleteOneFilm,
} from '../models/filmsModel.js';

const createOneMovie = async (req, res) => {
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
};

const getOneMoviePage = async (req, res) => {
	const page = req.query.page;
	const tousLesFilms = await getFilms(page);
	res.json(tousLesFilms);
};

const getOneMovieById = async (req, res) => {
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
};

const deleteOneMovieById = async (req, res) => {
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
};

export { createOneMovie, getOneMoviePage, getOneMovieById, deleteOneMovieById };
