const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const port = 3000
const hostname = '127.0.0.1'
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const {generateDate, limit, truncate, paginate} = require('./helpers/hbs')
const expressSession = require('express-session')
const connectMongo = require('connect-mongo')
const methodOverride = require('method-override')

mongoose.connect('mongodb://127.0.0.1/nodeblog_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.use(expressSession({
    secret: 'testotesto',
    resave: false,
    saveUninitialized: true,
    store: connectMongo.create({ mongoUrl: 'mongodb://127.0.0.1/nodeblog_db' })
}))


app.use(fileUpload())

app.use(express.static('public'))

app.use(methodOverride('_method'))
// const hbs = exphbs.create({
//     helpers: {
//         generateDate: (date, format) => {
//             return moment(date).format(format)
//         }
//     }
// })

// handlebars helpers

const hbs = exphbs.create({
    helpers: {
        generateDate: generateDate,
        limit: limit,
        truncate: truncate,
        paginate: paginate
    }
})

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// DISPLAY LINK Middleware
app.use((req, res, next) => {
    const { userId } = req.session
    if (userId) {
        res.locals = {
            displayLink: true
        }
    } else {
        res.locals = {
            displayLink: false
        }
    }
    next()
})

// Flash - Message Middleware
app.use((req, res, next) => {
    res.locals.sessionFlash = req.session.sessionFlash
    delete req.session.sessionFlash
    next()
})

const main = require('./routes/main')
const posts = require('./routes/posts')
const users = require('./routes/users')
const admin = require('./routes/admin/index')

app.use('/', main)
app.use('/posts', posts)
app.use('/users', users)
app.use('/admin', admin)

app.listen(port, hostname, () => console.log(` Server is running, http://${hostname}:${port}/`))

/* const http = require('http')
const fs = require('fs')

const hostname = '127.0.0.1'
const port = 3000

const indexPage = fs.readFileSync('index.html')

const server = http.createServer( (req, res) => {
    if(req.url === '/'){
        return res.end(indexPage)
    }
})

server.listen(port, hostname, () => {
    console.log(` Server is running, http://${hostname}:${port}/`)
}) */