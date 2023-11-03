const express = require('express');
const User = require('../models/User');
const router = express.Router()
// const { query } = require('express-validator');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');


const JWT_SECRET ='mistyis$andu';



//route1 create a User using : post "/api/auth/createuser" doesn't required authenticaton
router.post('/createuser', [
  body('name', 'enter valid name').isLength({ min: 3 }),
  body('email', 'enter valide email').isEmail(),
  body('password', 'password must be strong').isLength({ min: 5 }),
], async (req, res) => {
  let success = false;

  // error validation and message
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }
  // check weather user already exists
  try {


    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ success , error: "sorry a user with this email already exist" })
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    // create new user
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    });

    //   .then(user => res.json(user))
    //   .catch(err=>{console.log(err)
    // res.json({error:'please enter unique value',message:err.message})})

    const data  ={
      user:{
        id: user.id

      }
    }
    const authtoken = jwt.sign(data,JWT_SECRET);
    


    // res.json(user)
    success = true;
    res.json({success, authtoken})
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some error occur");
  }


})

//Route2 check correct credential : post "/api/auth/login" no login required
router.post('/login', [
  body('email', 'enter valide email').isEmail(),
  body('password', 'password cannot be blank').exists(),
], async (req, res) => {
  let success = false;
  // error validation and message
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {email,password} = req.body;
  try {
    
    let user = await User.findOne({email});
    if (!user) {
      return res.status(400).json({ error: "sorry try correct credentails" });
    
  } 
  const passwordCompare = await bcrypt.compare(password,user.password);
  if(!passwordCompare){
    success = false
    return res.status(400).json({success, error: "sorry try correct credentails" });

 }
  const data = {
    user:{
      id: user.id

    }
  }
  
 
 const authtoken = jwt.sign(data,JWT_SECRET);
 success=true;
    
 res.json({success, authtoken})
}
  catch (error) {
    console.error(error.message);
    res.status(500).send("some internal error occur");
    
  }
})


//Route3: get logged user detail : post "/api/auth/getuser"  login required

router.post('/getuser', fetchuser, async (req, res) =>{

try {
  userId = req.user.id;
  const user = await User.findById(userId).select("-password")
  res.send(user)
  
} catch (error) {
  console.error(error.message);
  res.status(500).send("some internal error occur");
  
}
})

module.exports = router
