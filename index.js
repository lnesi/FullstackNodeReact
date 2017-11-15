const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const keys = require('./config/keys');

//Models
require('./models/User');

//Services
require('./services/passport');


mongoose.connect(keys.mongoURI);
const app = express();

app.use(bodyParser.json());

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
require('./routes/billingRoutes')(app);

// Client Serve in production
if(process.env.NODE_ENV==="production"){
	//Express will serve production assets
	app.use(express.static('client/build'));
	
	//Express will serve index.html of client if does not recognize the route
	const path=require('path');
	app.get('*',(req,res)=>{
		res.sendFile(path.resolve(__dirname,'client','build','index.html'));
	});
}

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log("SERVER STARTED at port " + PORT);