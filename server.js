require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const app = express();

// ---- DB: use DATABASE_URL in production or local config in dev ----
const db = knex({
	client: 'pg',
	connection: process.env.DATABASE_URL ? {
		connectionString: process.env.DATABASE_URL,
		ssl: { rejectUnauthorized: false }
	} : {
		host: process.env.PGHOST || '127.0.0.1',
		port: process.env.PGPORT || 5432,
		user: process.env.PGUSER || 'postgres',
		password: process.env.PGPASSWORD || 'sagar@tyson007',
		database: process.env.PGDATABASE || 'smartbrain'
	}
});

if (process.env.DATABASE_URL) {
	db.raw('select 1+1 as result')
		.then(() => console.log('Connected to remote Postgres (DATABASE_URL)'))
		.catch(err => console.error('Remote Postgres connection error:', err && err.message ? err.message : err));
} else {
	console.log('Using local Postgres config (no DATABASE_URL detected).');
}

app.use(helmet());
app.use(morgan('dev'));

// FRONTEND_URL should be set to your deployed frontend URL
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:3000', 'https://smart-brain-lovat.vercel.app'], 
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

// ---- Healthcheck ----
app.get('/healthz', (_req, res) => res.status(200).send('ok'));

// ---- Root (small, safe response) ----
app.get('/', (_req, res) => { res.send('Smart Brain API is up') });

// ---- Existing routes (wired to your controllers) ----
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

// ---- Start server using host-provided PORT or fallback 3001 ----
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});