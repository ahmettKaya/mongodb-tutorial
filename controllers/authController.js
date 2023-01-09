const fsPromises = require('fs').promises
const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const handleLogin = async (req, res) => {
    const { name, password } = req.body
    if(!name || !password) return res.status(400).json({"message": "Username and password required!"})
    const foundUser = usersDB.users.find(user => user.name === name)
    if(!foundUser) return res.sendStatus(401)
    const match = await bcrypt.compare(password, foundUser.password)
    if (match) {
        const roles = Object.values(foundUser.roles)
        // create JWTs
        const accesToken = jwt.sign(
            {
                "userInfo": {
                    "name": foundUser.name,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '1m'}
        )
        const refreshToken = jwt.sign(
            {"name": foundUser.name},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'}
        )
        const otherUsers = usersDB.users.filter(user => user.name !== name)
        const currenUser = {...foundUser, refreshToken}
        usersDB.setUsers([...otherUsers, currenUser])
        await fsPromises.writeFile(
            path.join(__dirname, "..", "model", "users.json"), 
            JSON.stringify(usersDB.users)
        )
        res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24*60*60*1000})
        res.json({accesToken})
    } else {
        res.sendStatus(401)
    }
}

module.exports = {handleLogin}