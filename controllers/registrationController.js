const fsPromises = require('fs').promises
const path = require('path')
const bcrypt = require('bcrypt')

const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const handleNewUser = async (req, res) => {
    const { name, password } = req.body
    if(!name || !password) return res.status(400).json({"message": "Username and password required!"})
    const duplicate = usersDB.users.find(user => user.name === name)
    if(duplicate) return res.sendStatus(409)
    try {
        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10)
        // Create new user
        const newUser = {
            "name": name, 
            "roles": {"User": 2001},
            "password": hashedPassword
        }
        // Add the new user to DB
        usersDB.setUsers([...usersDB.users, newUser])
        await fsPromises.writeFile(
            path.join(__dirname, "..", "model", "users.json"), 
            JSON.stringify(usersDB.users)
        )
        res.status(201).json({'success': `User ${name} is created.`})
    } catch (error) {
        return res.status(500).json({'message': error.message})
    }
}

module.exports = {handleNewUser}