var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var compression = require('compression')
var expressStaticGzip = require("express-static-gzip");


var index = require('./routes/index');
var api = require('./routes/api');
var api = require('./routes/results');
var app = express();




 



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// compress all responses
//app.use(compression())

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', index);
app.use('/api', api);
//app.use('/sim', express.static('public'));

app.get ("/results/*",function(req,res,next){
  req.url=req.url+'.gz';
  res.set('Content-Encoding',"gzip");
  res.set("Content-Type","application/json")
  console.log(res)
  next()
})
 
app.use("/results",express.static(path.join(__dirname, 'results')))//,{
//   extensions:['gz','json.gz'],
//   setHeaders: function(res,path){
//       res.set({'Content-Encoding':'gzip'})
//     }
// }))
//app.use('/results',results)
//serve gzipped simulation results

app.use("/", expressStaticGzip(path.join(__dirname,'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err)
  res.render('error',{error: err});
});

module.exports = app;