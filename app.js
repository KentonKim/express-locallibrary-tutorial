var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var usersCoolRouter = require('./routes/users/cool')

// compression
const catalogRouter = require('./routes/catalog') // import routes for 'catalog' area of site
const compression = require('compression')
// protect from web vulnerabilities
const helmet = require('helmet')
// prevent repeated api calls
const RateLimit = require('express-rate-limit')
const limiter = RateLimit({
  windowMs: 1*60*1000,
  max: 30
})

var app = express();

// add helmet to middleware chain
// set csp headers to allow our bootstrap and jquery to be served
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  })
)
app.use(compression())

// apply rate limiter to all requires
app.use(limiter)

// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const dev_db_url = "mongodb+srv://myAtlasDBUser:Bardadmin0!@myatlasclusteredu.xcuyivu.mongodb.net/local_library?retryWrites=true&w=majority"

const mongoDB = process.env.MONGODB_URI || dev_db_url

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/users/cool', usersCoolRouter);
app.use("/catalog", catalogRouter); // Add catalog routes to middleware chain.

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

