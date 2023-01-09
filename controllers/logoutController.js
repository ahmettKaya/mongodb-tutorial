const jwt = require('jsonwebtoken')
const fsPromises = require('fs').promises
const path = require('path')
const filePath = path.join(__dirname, "..", "model", "users.json")
const usersDB = {
    users: require(filePath),
    setUsers: function (data) { this.users = data }
}

const handleLogout = async (req, res) => {
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(204)
    const refreshToken = cookies.jwt
    const foundUser = usersDB.users.find(user => user.refreshToken === refreshToken)
    if(!foundUser) {
        res.clearCookie('jwt', {httpOnly: true, maxAge: 24*60*60*1000})
        return res.sendStatus(204)
    }
    
    // Delete refreshToken in the user
    const otherUsers = usersDB.users.filter(user => user.refreshToken !== refreshToken)
    const currenUser = { ...foundUser, refreshToken: '' }
    usersDB.setUsers([...otherUsers, currenUser])
    await fsPromises.writeFile(filePath, JSON.stringify(usersDB.users))
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true})
    res.sendStatus(204)
}

module.exports = {handleLogout}