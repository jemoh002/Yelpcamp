if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate');

const path = require('path')
const flash = require('connect-flash')
const Joi = require('joi')
const methodOverride = require('method-override')



const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {

        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
const session = require('express-session')
app.use(session(sessionConfig))

const ExpressError = require('./utils/ExpressError')
const User = require('./models/user')

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(express.static('public'))
app.use(flash())


const passport = require('passport')
const LocalStrategy = require('passport-local');


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;

    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')

    next()
})



const userRoutes = require('./routes/users')
const campgroundsRoutes = require('./routes/campgrounds.js')
const reviewRoutes = require('./routes/reviews.js')



mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


app.use('/', userRoutes)
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes)


app.get('/', (req, res) => {
    res.render('home')
})


app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: 'jimm@gmail.com', username: 'jimm' })
    const newUser = await User.register(user, 'jimm')
    res.send(newUser)
})



app.get('*', (req, res, next) => {
    next(new ExpressError("Page not found", 404))
})

app.use((err, req, res, next) => {
    console.log(err)
    const { statusCode = 500 } = err
    if (!err.message) err.message = "Oh no! something went wrong"
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log("Hello from YelpCamp")
})