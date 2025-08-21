const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
    }

    const hash = bcrypt.hashSync(password);

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            console.log('DEBUG returning loginEmail:', loginEmail);

            // Handle both cases: [{ email: 'x' }] or ['x']
            // const emailValue = loginEmail[0].email ? loginEmail[0].email : loginEmail[0];

            return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0].email,
                    name: name,
                    joined: new Date()
                })
                .then(user => {
                    console.log('DEBUG user inserted:', user);
                    res.json(user[0]);
                });
        })
        .then(trx.commit)
        .catch(err => {
            console.error('DEBUG transaction error:', err);
            trx.rollback();
        });
    })
    .catch(err => {
        console.error('DEBUG outer catch error:', err);
        res.status(400).json('unable to register');
    });
};

module.exports = {
	handleRegister: handleRegister
};
