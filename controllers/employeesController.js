const Employee = require('../model/Employee')

getAllEmployees = async (req, res) => {
    const result = await Employee.find({}).exec()
    res.json(result)
}

createNewEmployee = async (req, res) => {
    await Employee.create({
        "firstname": req.body.firstname,
        "lastname": req.body.lastname
    })
    res.sendStatus(201)
}

updateEmployee = async (req, res) => {
    const employee = await Employee.findById(req.body.id).exec()
    if (!employee) { return res.status(400).json({"message": `The employee with ID: ${req.body.id} is not found!`}) }
    await Employee.updateOne(
        {_id: req.body.id},
        {
            "firstname": req.body.firstname ? req.body.firstname : employee.firstname,
            "lastname": req.body.lastname ? req.body.lastname : employee.lastname
        }
    ).clone()
    res.sendStatus(200)
}

deleteEmployee = async (req, res) => {
    const employee = await Employee.findById(req.body.id).exec()
    if (!employee) {
        return res.status(400).json({"message": `The employee with ID: ${req.body.id} is not found!`})
    }
    await Employee.findByIdAndDelete(req.body.id).clone()
    res.sendStatus(200)
}

getEmployee = async (req, res) => {
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