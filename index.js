/* eslint-disable no-console */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';
// import csurf from 'csurf';
// import authRouter from './routes/Auth.routes.js';
import audioRouter from './routes/audio.routes.js';

const app = express();
const port = 3000;
dotenv.config();
// const csrfProtection = csurf({
//   cookie: true,
// });

app.use(cors());
app.use(express.json());
// app.use(cookieParser());
// app.use(csrfProtection);

app.get('/', (req, res) => res.send('server is running!'));

// app.get('/api/csrf-token', (req, res) => {
//   res.json({ csrfToken: req.csrfToken() });
// });

// app.use('/api/auth', authRouter);

app.use('/', audioRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// TODO:- databse login without password is a problem so rembember it during deployment
