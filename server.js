const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
	client: 'pg',
	connection: {
	  host: '127.0.0.1',
	  port: 5432,
	  user: 'postgres',
	  password: 'sagar@tyson007',
	  database: 'smartbrain'
	},
});

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send(database.users);
})

app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)})

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})

app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})

app.put('/image', (req, res) => {image.handleImage(req, res, db)})

app.post('/imageurl', (req, res) => {
  const CLARIFAI_URL = "https://api.clarifai.com/v2/models/face-detection/outputs";
  const raw = JSON.stringify(req.body);

  fetch(CLARIFAI_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Key 0c110e74cc6540099dce33e4177a9717'
    },
    body: raw
  })
    .then(apiRes => apiRes.json())
    .then(data => res.json(data))
    .catch(err => res.status(400).json('Unable to work with API'));
});

app.listen(3000, () => {
	console.log('app is running on port 3000');
})
