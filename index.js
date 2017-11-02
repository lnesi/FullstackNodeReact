const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');

//Models
require('./models/User');

//Services
require('./services/passport');


mongoose.connect(keys.mongoURI);
const app = express();

app.use(
	cookieSession({
		maxAge:30*24*60*60*1000, //30 days
		keys:[keys.cookieKey]
	})
);

app.use(passport.initialize());
app.use(passport.session());

//Routes
require('./routes/authRoutes')(app);


// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log("SERVER STARTED at port " + PORT);