/* eslint-disable no-console */
import express from 'express';
import cors from 'cors';
import audioRouter from './routes/audio.routes.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => res.send('server is running!'));

app.use('/', audioRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

