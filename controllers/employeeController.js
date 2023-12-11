const Employee = require('../models/Employee'); // Assuming your file is named Employee.j
const createEmployee = async(req, res) => {
    try {
        const { name, email, phone } = req.body;
        const employee = new Employee({
            name, 
            email,
            phone
        });
        await employee.save();
        res.status(201).json(employee);
        // res.redirect('/all-emp')
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}; 

// const getEmployee=async(req,res)=>{
//     try{
//         const employee=new Employee.find()
//         res.status(201).json(employee)  
//     }
//     catch(err){
//         res.status(500).json({message:'server'})
//     }
// } 

const getAllEmployees = async (req, res, next) => {
    try {
        const employees = await Employee.find();
        console.log(res)
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const singleEmployee = async (req,res) => {
    try{
        const employee = await Employee.findById(req.params.id)
        
        if (!employee){
            return res.status(500).json({message:"employee not found"})
        }
        res.status(200).json(employee)
    }
    catch(err){
        res.status(500).json({message: 'server error'})
    }
} 

const updateEmployee =async (req,res)=>{
    try{
        const {name , email, phone}=req.body 
    const employee = await Employee.findByIdAndUpdate(
        req.params.id,
        {name,email, phone}
    ) 
    if(!employee){
        res.statu(500).json({message:'employe not found'})
    }
    res.status(200).json(employee)
    } 
    catch(err){
        res.status(500).json({message:"error"})
    }
    
} 

const deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(
            req.params.id
        );

        if (!employee) {
            // Return a 404 status code for "Employee not found" case
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Return the deleted employee
        res.status(200).json(employee);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};



module.exports = { createEmployee, getAllEmployees, singleEmployee, updateEmployee, deleteEmployee };
