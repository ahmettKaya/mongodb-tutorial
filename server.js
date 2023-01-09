require('dotenv').config()
const express = require('express')
const path = require('path')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const cookieParser = require('cookie-parser')
const {logger} = require('./middleware/logEvents')
const { errorHandler } = require('./middleware/errorHandler')
const verifyJWT = require('./middleware/verifyJWT')
const credentials = require('./middleware/credentials')
const PORT = process.env.PORT || 3500
const app = express()

app.use(logger)
app.use(credentials)

// Cross Origin Resource Sharing
app.use(cors(corsOptions))

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cookieParser())

// Serve static files
app.use('/', express.static(path.join(__dirname, 'public')))

// Routers
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))

app.use(verifyJWT)
app.use('/employees', require('./routes/api/employees'))

app.all('*', (req, res) => {
    res.status(404)
    
    if (req.accepts('html')) {
        res.sendFile("404.html", {
            root: path.join(__dirname, "views")
        })
    } 
    else if(req.accepts('json')){
        res.send(router.json('404 Not Found'))
    }
    else {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})