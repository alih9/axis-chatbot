
const express=require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require("../models/index");
const User = db.tenant;
const Op = db.Sequelize.Op;
const Joi=require('@hapi/joi');
const { validate } = require('@hapi/joi/lib/types/symbol');
var jwt = require('jsonwebtoken');





const login = async (req, res) => {
    const result = validateUser(req.body);
    if(result.error)
    {
        res.status(400).send({message:result.error.details[0].message,success:false });
        return;
    }
  const user = await User.findOne({ where: {email: req.body.email}})
  const secret = process.env.SECRET_KEY;
  if(!user) {
      return res.status(400).send({message:'The user not found',success:false });
  }

  if(user && bcrypt.compareSync(req.body.password, user.password)) {
      const token = jwt.sign(
          {
              userId: user.id,
          },
          secret,
          {expiresIn : '1d'}
      )
      res.cookie('token', token, { httpOnly: true });
      res.status(200).send({user: user.email , token: token,success:true }) 
  } else {
     res.status(400).send({message:'password is wrong!',success:false });
  }

  
}

const register = async (req, res) => {
    console.log('Registration Credientials',req.body)
    const result = validateUser(req.body);
    if(result.error)
    {
        res.status(400).send({ message: result.error.details[0],success:false });
        return;
    }
    const name = req.body.name;
    const email = req.body.email;
    let user = new User({
        name: name,
        email: email,
        password: bcrypt.hashSync(req.body.password, 10),
    
    })
    
    user = await user.save().then(user => {
        res.status(200).send({ user: { name, email },success:true })
    }).catch(err => res.send({ message:(err.errors[0].message ),success:false }));
}

const check_token = (req,res) => {
        console.log('-------------------Checking authentication token')
    res.status(200).send({success:true })

}
function validateUser(user)
{
const schema ={   name:Joi.string(),email:Joi.string().required(),password:Joi.string().min(6).required()};
return Joi.validate(user,schema);
}


  

module.exports = { login, register,check_token };
