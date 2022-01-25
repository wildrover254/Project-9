'use-strict';
const auth = require('basic-auth');
const { User } = require('../models');

//Middleware function for authenticating a user
exports.authenticateUser = async (req, res, next) => {
    const credentials = auth(req);

    if (credentials) {
        const user = await User.findOne({ where: {emailAddress: credentials.username} });
        if (user) {
            const authenticated = bcrypt.compareSync(credentials.pass, user.password);
            if (authenticated) {
                req.currentUser = user;
            }
        }
    } else {
        message = 'Auth header not found';
    }

    next();
};