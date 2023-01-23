const Employee = require('../model/Employee')

getAllEmployees = async (req, res) => {
    const result = await Employee.find({}).exec()
    if(!result) return res.status(204).json({'message': 'No employees found!'})
    res.json(result)
}

createNewEmployee = async (req, res) => {
    if(!req?.body?.firstname || !req?.body?.lastname) return res.status(400).json({'message': 'Firstname and lastname are must.'})
    try {
        await Employee.create({
            "firstname": req.body.firstname,
            "lastname": req.body.lastname
        })
        res.sendStatus(201)
    } catch (error) {
        console.error(error)
    }
}

updateEmployee = async (req, res) => {
    if(!req?.body?.id) return res.status(400).json({'message': 'ID is must.'})
    const employee = await Employee.findById(req.body.id).exec()
    if (!employee) { return res.status(400).json({"message": `The employee with ID: ${req.body.id} is not found!`}) }
    employee.firstname = req.body.firstname ? req.body.firstname : employee.firstname
    employee.lastname = req.body.lastname ? req.body.lastname : employee.lastname
    await employee.save()
    res.sendStatus(200)
}

deleteEmployee = async (req, res) => {
    if(!req?.body?.id) return res.status(400).json({'message': 'ID is must.'})
    const employee = await Employee.findById(req.body.id).exec()
    if (!employee) {
        return res.status(400).json({"message": `The employee with ID: ${req.body.id} is not found!`})
    }
    await Employee.findByIdAndDelete(req.body.id).clone()
    res.sendStatus(200)
}

getEmployee = async (req, res) => {
    if(!req?.params?.id) return res.status(400).json({'message': 'ID is must.'})
    const employee = await Employee.findById(req.params.id).exec()
    if (!employee) {
        return res.status(400).json({"message": `The employee with ID: ${req.params.id} is not found!`})
    }
    res.json(employee)
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}