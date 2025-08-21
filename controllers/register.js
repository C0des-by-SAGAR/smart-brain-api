const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
    }

    const hash = bcrypt.hashSync(password);

    db.transaction(trx => {
        return trx('login')
            .insert({
                hash: hash,
                email: email
            })
            .returning('email')
            .then(loginEmail => {
                console.log('DEBUG returning loginEmail:', loginEmail);

                // Handle both formats
                const emailValue =
                    loginEmail[0].email ? loginEmail[0].email : loginEmail[0];

                return trx('users')
                    .insert({
                        email: emailValue,
                        name: name,
                        joined: new Date()
                    })
                    .returning('*');
            })
            .then(user => {
                console.log('DEBUG user inserted:', user);
                res.json(user[0]);
            });
    })
    .catch(err => {
        console.error('Register error:', err);
        res.status(400).json('unable to register');
    });
};

module.exports = {
    handleRegister
};
