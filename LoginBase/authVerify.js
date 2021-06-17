const jwt = require("jsonwebtoken");
const User = require('./models/User');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwtcookie;
    //check if valid
    if (token) {
        jwt.verify(token, 'very very secret', (err, decoded) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
                //console.log(decoded);
                console.log('you are authorized to enter');
                next();
            }
        })
    } else {
        console.log('not authorized');
        res.redirect('/login');
    }
};

//for checking current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwtcookie;
    //check if valid
    if (token) {
        jwt.verify(token, 'very very secret', async (err, decoded) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                //console.log(decoded);
                let user = await User.findById(decoded.id);
                res.locals.user = user;
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }  
};

module.exports = { requireAuth, checkUser };