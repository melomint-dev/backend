/* eslint-disable no-console */
import express from 'express';
import cors from 'cors';
import audioRouter from './routes/audio.routes.js';
import flowRouter from './routes/flow.routes.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => res.send('server is running!'));

app.use('/', audioRouter);
app.use('/flow', flowRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// coverpage on ipfs
// similarity on flow chain