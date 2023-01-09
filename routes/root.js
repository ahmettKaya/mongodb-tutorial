const express = require('express')
const path = require('path')

const router = express.Router()

const root = path.join(__dirname, "..", "views")

router.get('/', (req, res) => {
    res.sendFile("index.html", {
        root: root
    })
})

router.get('/index(.html)?', (req, res) => {
    res.sendFile("index.html", {
        root: root
    })
})

router.get('/new-page(.html)?', (req, res) => {
    res.sendFile("new-page.html", {
        root: root
    })
})

router.get('/old-page(.html)?', (req, res) => {
    res.status(301).sendFile("new-page.html", {
        root: root
    })
})

router.get('/hello(.html)?', (req, res, next) => {
    console.log('Attempted to send hello.html')
    next()
}, (req, res) => {
    res.send('Hello world!')
})

const firstChainFun = (req, res, next) => {
    console.log('First chain function.')
    next()
}

const secondChainFun = (req, res, next) => {
    console.log('Second chain function.')
    next()
}

const lastChainFun = (req, res) => {
    console.log('Last chain function.')
    res.send('Last chain!')
}

router.get('/chain', [firstChainFun, secondChainFun, lastChainFun])

module.exports = router