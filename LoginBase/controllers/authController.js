const User = require('../models/User');
const jwt = require('jsonwebtoken');


const createToken = (id) => {
    return jwt.sign({ id }, 'very very secret', {
        expiresIn: 1 * 60 * 60 //1hr
    });
};

module.exports.signup_get = (req, res) => {
    res.render('signup');
};

module.exports.login_get = (req, res) => {
    res.render('login');
};

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.create({ email, password });
        const token = createToken(user._id);
        res.cookie('jwtcookie', token, { httpOnly: true, maxAge: 1 * 60 * 60 * 1000 });
        res.status(201).json({ user: user._id });
        console.log('new user signed up');
    } catch (err) {
        console.log(err.message);
        res.status(400).json("user not created");
    }
};

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwtcookie', token, { httpOnly: true, maxAge: 1 * 60 * 60 * 1000 });
        res.status(200).json({ user: user._id });
        console.log('logged in');
    } catch (err) {
        console.log(err.message);
        res.status(400).json("login failure");
    }
};

module.exports.logout_get = (req, res) => {
    try {
        res.cookie('jwtcookie', ' ', { httpOnly: true, maxAge: 1 });//expire in 1 ms
    } catch (err) {
        console.log(err.message);
    }
    res.redirect('/');
    console.log('logged out');
};
