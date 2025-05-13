import 'dotenv/config';

import express from 'express';

import filmsRouter from './routers/filmsRouter.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Si API ouverte : documentation. Si API fermé : 404
app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.use('/films', filmsRouter);

app.get('/salut', (req, res) => res.send('coucou'));

app.use((req, res) => {
	res.json({ message: 'page 404' });
});

app.listen(process.env.PORT, () => {
	console.log(`serveur lancé sur le port ${process.env.PORT}`);
});
