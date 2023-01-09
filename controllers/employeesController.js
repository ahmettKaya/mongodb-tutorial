const fsPromises = require('fs').promises
const path = require('path')
const filePath = path.join(__dirname, "..", "model", "employees.json")

const data = {
    employees: require(filePath),
    setEmployees: function (data) {this.employees = data}
}

getAllEmployees = (req, res) => {
    res.json(data.employees)
}

createNewEmployee = async (req, res) => {
    const newEmployee = {
        id: data.employees[data.employees.length - 1].id + 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }
    data.setEmployees([...data.employees, newEmployee])
    await fsPromises.writeFile(filePath, JSON.stringify(data.employees))
    res.status(201).json(data.employees)
}

updateEmployee = async (req, res) => {
    const employee = data.employees.find(employee => employee.id === parseInt(req.body.id))
    if (!employee) { return res.status(400).json({"message": `The employee with ID: ${req.body.id} is not found!`}) }
    if (req.body.firstname) { employee.firstname = req.body.firstname }
    if (req.body.lastname) { employee.lastname = req.body.lastname }
    const filteredArray = data.employees.filter(employee => employee.id !== parseInt(req.body.id))
    const unsortedArray = [...filteredArray, employee]
    data.setEmployees(unsortedArray.sort((a, b) => a.id - b.id))
    await fsPromises.writeFile(filePath, JSON.stringify(data.employees))
    res.status(200).json(data.employees)
}

deleteEmployee = async (req, res) => {
    const employee = data.employees.find(employee => employee.id === parseInt(req.body.id))
    if (!employee) {
        return res.status(400).json({"message": `The employee with ID: ${req.body.id} is not found!`})
    }
    const filteredArray = data.employees.filter(employee => employee.id !== parseInt(req.body.id))
    data.setEmployees([...filteredArray])
    await fsPromises.writeFile(filePath, JSON.stringify(data.employees))
    res.status(200).json(data.employees)
}

getEmployee = (req, res) => {
    const employee = data.employees.find(employee => employee.id === parseInt(req.params.id))
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