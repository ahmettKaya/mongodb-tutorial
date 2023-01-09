const {format} = require('date-fns')
const {v4:uuid} = require('uuid')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

exports.logEvents = async (message, logFilePath) => {
    const logDir = path.join(__dirname, "..", "logs")
    const dateTime = `${format(new Date(), "yyyymmdd\tHH:mm:ss")}`
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`
    try {
        if (!fs.existsSync(logDir)) {
            await fsPromises.mkdir(logDir)
        }
        await fsPromises.appendFile(path.join(__dirname, "..", "logs", logFilePath), logItem)
    } catch (error) {
        console.error(error)
    }
}

exports.logger = (req, res, next) => {
    this.logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt")
    next()
}