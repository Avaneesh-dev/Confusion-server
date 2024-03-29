let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let session = require("express-session");
let FileStore = require('session-file-store')(session);
let passport = require("passport");
let authenticate = require('./authenticate');
let config = require('./config');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let dishRouter = require('./routes/dishRouter');
let leaderRouter = require('./routes/leaderRouter');
let promoRouter = require('./routes/promoRouter');
const commentRouter = require('./routes/commentRouter');
const uploadRouter = require('./routes/uploadRouter');
const favoritesRouter = require('./routes/favoritesRouter');
const mongoose = require('mongoose');
const Dishes = require('./models/dishes');
const Promotions = require("./models/promotions");
const Leaders = require("./models/leaders");
const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });

let app = express();

//secure traffic only

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    name: 'session-id',
    secret: "12345-67890-09876-54321",
    saveUninitialized: false,
    resave: false,
    store: new FileStore()
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/imageUpload', uploadRouter);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
app.use('/favorites', favoritesRouter);
app.use('/comments', commentRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
