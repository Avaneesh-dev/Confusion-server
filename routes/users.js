var express = require('express');
var router = express.Router();
let passport = require("passport");
const bodyParser = require('body-parser');
let User = require('../models/userDetails');

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
    User.register(new User({username: req.body.username}),
        req.body.password, (err, user) => {
            if(err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({err: err});
            }
            else {
                passport.authenticate('local')(req, res, () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, status: 'Registration Successful!'});
                });
            }
        });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, status: 'You are successfully logged in!'});
});

router.get('/logout', (req,res) => {
    if(req.session) {

        res.clearCookie('session-id');
        res.redirect('/');
    } else {
        let err = new Error('You are not logged in!');
        err.status = 403;
        next(err);
    }
});
module.exports = router;
