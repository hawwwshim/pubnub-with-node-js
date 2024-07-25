var createError = require("http-errors");
var express = require("express");
const { publishMessage, subscribeToChannel } = require('./middleware/pubnubService');
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const bodyParser = require("body-parser");
var indexRouter = require("./routes/index");
var matchRouter = require("./routes/match");
var messageRouter = require("./routes/messageRouter");
const checkContentType = require("./middleware/checkContentType");
const logRequestUrl = require("./middleware/logRequestUrl");
const auth = require("./middleware/auth");
// const errorHandler = require("./middleware/errorMiddleware");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
// Use body-parser to parse JSON bodiessss
app.use(bodyParser.json());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// Apply the middleware to log requested url for all routes
app.use(logRequestUrl);
// Apply the middleware to checkContentType for all routes
app.use(checkContentType);
app.use("/", indexRouter);
app.use("/match", auth, matchRouter);
app.use("/message", auth, messageRouter);

app.post('/publish', (req, res) => {
  const { channel, message } = req.body;
  publishMessage(channel, message);
  res.send('Message published');
});
// catch 404 and forward to error handlerrr
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});



module.exports = app;
