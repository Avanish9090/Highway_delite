// server.js
const express = require('express');
const sendOtpMiddleware = require('./otpMiddleware');
const mongoose = require('mongoose');
const cors = require('cors');
const { SignUpModel } = require('./models/Signup.model');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.DB_URI)
  .then(() => console.log('Connected!'));

// Route protected by OTP middleware
app.post('/secure-login', sendOtpMiddleware, (req, res) => {
  res.status(200).json({ message: 'OTP verified. You are logged in!' });
});

app.post('/signup',(req,res)=>{
  const {name,dob,email} = req.body;
  
  let signData = new SignUpModel({
    name:name,
    dob:dob,
    email:email
  })
   
  signData.save()
  .then(()=>{
    res.send({
      status:200,
      msg:"data saved"
    })
  }).catch((err)=>{
    console.log(err)
  })
})

app.post('/check-mail',async(req,res)=>{
  const {email} = req.body;
  const exists = await SignUpModel.findOne({email});
  if(exists){
    res.send({
      status:301,
      msg:"email already exists",
      exists
    })
  }
  else{
    res.send({
      status:300,
      msg:"email not exists"
    })
  }
})

// app.get('/detail',async (req,res)=>{
//   const emId = req.body;
  
//   let user = await SignUpModel.findOne({email:emId});
//   res.send({
//     status:1,
//     msg:"data found",
//     user
//   }) 
// })

app.listen(process.env.PORT || 8000, () =>{
   console.log("Server running on port "+process.env.port)
  });
