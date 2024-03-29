const express = require('express');
const cookieParser = require('cookie-parser');
const mongodb = require('./config/db')
const app = express();
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const passport= require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require('connect-flash')
const methodOverride = require('method-override')


dotenv.config({path:'./config/config.env'})


// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }))
require('./config/passport')(passport)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}
app.use(flash())


app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)


//helpers
const {formatDate,  truncate, stripTags, editIcon, select} = require('./helpers/hbs')


// view engine
app.engine(
    '.hbs',
  exphbs({
    helpers: {
      formatDate,
      truncate,
      stripTags,
      editIcon,
      select
    },
    defaultLayout: 'main',
    extname: '.hbs',
  })
)
app.set('view engine', '.hbs')

// database connection
mongodb()


//session
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI
        }),
  })
)
app.use(passport.initialize())
app.use(passport.session())

app.use((req,res,next) => {
  // res.locals.success_msg = req.flash('success_msg')
 res.locals.error_msg = req.flash('error_msg')
 res.locals.error = req.flash('error')
 res.locals.user = req.user || null
 next()
})

app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))


app.listen(process.env.PORT || 3000)
