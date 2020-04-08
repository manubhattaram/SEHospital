var createError = require('http-errors');
var express = require('express');
var path = require('path');
//var cookieParser = require('cookie-parser');
var logger = require('morgan');
constflash = require('connect-flash');
const session = require('express-session');
//var expressLayouts=require('express-ejs-layouts');

//MongoDB link
var mongo = require('mongodb');
/*var monk = require('monk');
var db = monk('mongodb+srv://User12:pwd123@hestia-iz6gz.mongodb.net/test?retryWrites=true&w=majority');
db.then(()=>{
	console.log("connection success");
}).catch((e)=>{
	console.error("Error !",e);
});*/

var mongoose=require('mongoose');
var db = require('./config/keys').MongoURI;

//connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log("connection success"))
  .catch((err)=>console.log(err));


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const PORT=process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`))

//app.use(expressLayouts);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function(req,res){
	res.render('index',{title: 'Hestia Medical'})
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //Bodyparser
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));

//making db available to router
app.use(function(req, res, next){
	req.db = db;
	next();
});


app.use('/', indexRouter);
app.use('/users', usersRouter);

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
