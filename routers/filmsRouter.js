import express from 'express';
import {
	createOneMovie,
	getOneMovieById,
	getOneMoviePage,
	deleteOneMovieById,
} from '../controllers/filmsController.js';

const router = express.Router();

router.post('/', createOneMovie);

// récupère une page de films avec pagination
router.get('/', getOneMoviePage);

router.put('/:id', getOneMovieById);

router.delete('/:id', deleteOneMovieById);

export default router;
