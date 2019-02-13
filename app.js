const express = require('express');
const path = require('path')
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport')
const mongoose = require('mongoose');

const app = express();

// Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport Config
require('./config/passport')(passport)

// Database Config
const db = require('./config/database')

// Map Global promise - get rid of warning
mongoose.Promise = global.Promise;

// Connect to mongoose
mongoose.connect(db.mongoURI, {
    useMongoClient: true,
})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//static folder
app.use(express.static(path.join(__dirname, 'public')))

// method override middleware
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

// express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//Passport Middleware
//Important!!! load this after session middleware
app.use(passport.initialize());
app.use(passport.session());

// connect-flash middleware
app.use(flash());

//Global variable
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

///////////////////////// end of middleware ///////////////////////////////////
// Index Route
const title = 'Welcome'
app.get('/', (req, res) => {
    res.render('index', {
        title: title
    });
});

// About Route
app.get('/about', (req, res) => {
    res.render('about')
});

// Use Routes
app.use('/ideas', ideas);
app.use('/users', users);


//port
const port = process.env.PORT || 5000;

app.listen(port, ()=> {
    console.log(`server started on port ${port}`);//es 6 method
});