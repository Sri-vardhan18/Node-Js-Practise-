const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController'); 

// const Employee= require("../Model/Employee")

router.post('/add-emp', employeeController.createEmployee); 

router.get('/all-emp',employeeController.getAllEmployees) 

router.get('/employee/:id',employeeController.singleEmployee) 

router.put('/employeeupdate/:id',employeeController.updateEmployee) 

router.delete('/delete/:id', employeeController.deleteEmployee)

module.exports = router;
