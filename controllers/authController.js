const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const handleLogin = async (req, res) => {
    const { name, password } = req.body
    if(!name || !password) return res.status(400).json({"message": "Username and password required!"})
    const foundUser = await User.findOne({name: name}).exec()
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
        await User.updateOne({name: name}, {refreshToken: refreshToken})
        res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', /*secure: true,*/ maxAge: 24*60*60*1000})
        res.json({accesToken})
    } else {
        res.sendStatus(401)
    }
}

module.exports = {handleLogin}