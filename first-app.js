const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');
const ejs = require("ejs") 
const session= require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session); 
const bcrypt = require('bcrypt');
const User=require('./models/User')

const employesRoutes = require('./routes/employeeRoutes'); // Adjust the path as needed

const app = express(); 
app.use(cors()); 
app.use(express.json()); 
app.set('view engine', 'ejs'); 
app.set('views', __dirname + '/view'); 
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))

const PORT = 5000;

dotenv.config();
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });

const store= new MongoDBStore ({
  uri:process.env.MONGODB_URI,
  collection: 'mysession'

})



//session registration 
app.use(session({
  secret: "This is a secret",
  resave: false,
  saveUninitialized: false,
  store: store
}))



const checkAuth = (req, res, next) => {
  if (req.session.isAuthenticated) {
      next()
  } else {
      res.redirect('/signup')
  }
}

app.use('/employee', employesRoutes); // Updated to use '/employee' as the base path 

app.get('/signup', (req, res) => {
  res.render('register')
})

app.get('/login',(req,res)=>{ 
  res.render('login')
}) 

app.get('/dashboard', checkAuth, (req, res) => {
  res.render('welcome')
})

app.post('/register',async(req,res)=>{ 
  const {username, email, password}=req.body
  let user=await User.findOne({email})
  if(user){
    res.redirect('./signup')
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  user = new User({
    username,
    email,
    password: hashedPassword
  })

  req.session.person = user.username
  await user.save()
  res.redirect('./login')
  
  
}) 

app.post('/user-login', async(req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (!user) {
      return res.redirect('/signup')
  }

  const checkPassword = await bcrypt.compare(password, user.password)

  if (!checkPassword) {
      return res.redirect('/signup')
  }
  req.session.isAuthenticated = true
  res.redirect('/dashboard')

})

app.post('/logout',(req,res)=>{
  req.session.destroy((err)=>{
    if (err) throw err;
    res.redirect('/signup')
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});  



