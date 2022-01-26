'use-strict';
const auth = require('basic-auth');
const { User } = require('../models');
const bcrypt = require('bcrypt');

//Middleware function for authenticating a user
exports.authenticateUser = async (req, res, next) => {
    let message;
    const credentials = auth(req);

    if (credentials) {
        const user = await User.findOne({ where: {emailAddress: credentials.name} });
        if (user) {
            const authenticated = bcrypt.compareSync(credentials.pass, user.password);
            if (authenticated) {
                console.log(`Username ${user.emailAddress} successfully authenticated.`);
                req.currentUser = user;
            } else {
                message = `Authentication failure for username: ${user.emailAddress}`;
            } 
        } else {
            message = `User not found for username: ${credentials.name}`;
        }
    } else {
        message = 'Auth header not found';
    }

    next();
};