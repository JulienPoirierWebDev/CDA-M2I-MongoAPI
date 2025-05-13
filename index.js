import 'dotenv/config';

import express from 'express';
import {
	createOneMovie,
	deleteOneMovieById,
	getOneMovieById,
	getOneMoviePage,
} from './controllers/filmsController.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.post('/films', createOneMovie);

// récupère une page de films avec pagination
app.get('/films', getOneMoviePage);

app.put('/films/:id', getOneMovieById);

app.delete('/films/:id', deleteOneMovieById);

app.listen(process.env.PORT, () => {
	console.log(`serveur lancé sur le port ${process.env.PORT}`);
});
