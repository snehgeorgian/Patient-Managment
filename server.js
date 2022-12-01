require('./models/DBconfig');
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
global.__basedir = __dirname;

// route controller
const logoutController = require('./controllers/logoutController');
const userController = require('./controllers/userController');
const loginController = require('./controllers/loginController');
const patientController = require('./controllers/patientController');
const homeController = require('./controllers/homeController');
const registerController = require('./controllers/registerController');
const googleController = require('./controllers/googleController');

var app = express();
app.use(bodyparser.urlencoded({
    extended: true
}));

// google login
require('./config/passport')(passport);

if(process.env.NODE_ENV !== 'production')
{
  dotenv.config();
}
//app.use(expressValidator())

// cookies use
app.use(cookieParser());

// use session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}))

  app.use(passport.initialize());
  app.use(passport.session());
// file static path
app.use('/static', express.static(path.join(__dirname, 'assets/')));

app.use(bodyparser.json());
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/templates/',partialsDir: __dirname + '/views/partials/' }));

app.set('view engine', 'hbs');

app.listen(3000, () => {
    console.log('SERVER is listening on PORT 3000');
});


// app route
app.use('/', homeController);
app.use('/user', userController);
app.use('/register', registerController);
app.use('/login', loginController);
app.use('/auth', googleController);
app.use('/patient', patientController);
app.use('/logout', logoutController);