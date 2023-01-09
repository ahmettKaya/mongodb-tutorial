const {logEvents} = require('./logEvents')

exports.errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}`, "errLog.txt")
    res.status(500).send(err.message)
}