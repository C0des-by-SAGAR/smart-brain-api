const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');

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

app.post('/signin', (req, res) => {
	db.select('email', 'hash').from('login')
		.where('email', '=', req.body.email)
		.then(data => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
			if(isValid) {
				return db.select('*').from('users')
					.where('email', '=', req.body.email)
					.then(user => {
						res.json(user[0])
					})
					.catch(err => res.status(400).json('Unable to get USER'));
			} else {
				res.status(400).json('Wrong Credentials')
			}
		})
		.catch(err => res.status(400).json('Wrong Credentials'));
})

app.post('/register', (req, res) => {
	const {email, name, password} = req.body;
	let hash = bcrypt.hashSync(password);
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
			.returning('*')
			.insert({
				email: loginEmail[0].email,
				name: name,
				joined: new Date()
			})
			.then(user => {
				res.json(user[0])
			})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => res.status(400).json('unable to register'));
})

app.get('/profile/:id', (req, res) => {
	const {id} = req.params;
	db.select('*').from('users')
		.where({id})
		.then(user => {
			if(user.length) {
				res.json(user[0]);
			} else {
				res.status(400).json('Not Found');
			}
		})
		.catch(err=> res.status(400).json('Error Getting User'));
})

app.put('/image', (req, res) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			res.json(entries[0].entries);
		})
		.catch(err => res.status(400).json('Unable to Get Entries'));
})

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
