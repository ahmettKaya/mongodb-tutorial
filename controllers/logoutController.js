const User = require('../model/User')
const jwt = require('jsonwebtoken')

const handleLogout = async (req, res) => {
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(204)
    const refreshToken = cookies.jwt
    const foundUser = await User.findOne({refreshToken: refreshToken}).exec()
    if(!foundUser) {
        res.clearCookie('jwt', {httpOnly: true, maxAge: 24*60*60*1000})
        return res.sendStatus(204)
    }
    
    // Delete refreshToken in the user
    const result =  await User.updateOne({name: foundUser.name}, {refreshToken: ""}, (error, result) => {
        if (error) {
            console.error(error)
        } else {
            console.log(result)
        }
    }).clone()
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None'/*, secure: true*/})
    res.sendStatus(204)
}

module.exports = {handleLogout}