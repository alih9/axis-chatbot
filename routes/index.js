const Joi=require('@hapi/joi');
const { validate } = require('@hapi/joi/lib/types/symbol');

const express=require('express');
const app=express();
const router=express.Router()
app.use(express.json());
app.use(express.urlencoded({extended: true}));
var AuthController = require('../controller/AuthController');

var UserController = require('../controller/UserController');


router
  .post('/login', AuthController.login)
  .post('/register', AuthController.register)
  .get('/check_token', AuthController.check_token)
  .post('/userdata', UserController.customer_chatting_registration)
  .post('/customerchatting', UserController.customer_chatting)
  .post('/show_all_user_chat', UserController.show_all_chat_users)
  .post('/getmessage', UserController.get_messages)
  .post('/tenantchatting', UserController.tenant_chatting)
  .post('/checkuseractivation', UserController.check_user_activation)
  .post('/existuser', UserController.existence_user)  
  .post('/getuserdetails', UserController.get_user_details)
  .post('/deactivateuserroom', UserController.deactivate_user_room)
  .post('/deleteconversation', UserController.delete_conversation)

  
  
  .get('/test',(req,res)=>{res.send({message:'testing'})})


module.exports = router