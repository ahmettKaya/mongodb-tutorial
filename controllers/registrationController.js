const User = require('../model/User')
const bcrypt = require('bcrypt')

const handleNewUser = async (req, res) => {
    const { name, password } = req.body
    if(!name || !password) return res.status(400).json({"message": "Username and password required!"})
    const duplicate = await User.findOne({name: name}).exec()
    if(duplicate) return res.sendStatus(409)
    try {
        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10)
        // Add the new user to DB
        const result = await User.create({
            "name": name, 
            "password": hashedPassword
        })
        res.status(201).json({'success': `User ${name} is created.`})
    } catch (error) {
        return res.status(500).json({'message': error.message})
    }
}

module.exports = {handleNewUser}