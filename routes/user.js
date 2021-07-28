const Joi=require('@hapi/joi');
const { validate } = require('@hapi/joi/lib/types/symbol');

const express=require('express');
const app=express();
const router=express.Router()
app.use(express.json());
app.use(express.urlencoded({extended: true}));



// === AUTH ENDPOINTS ===
// var UserController = require('../controller/UserController');

// router
//   .get('/login', UserController.loginPage)
//   .post('/login', UserController.login)
//   .get('/signup', UserController.signupPage)
//   .post('/signup', UserController.signup)
//   .get('/logout', UserController.logout)



//   let users = require('./users')
// router
//   .get('/users/profile', auth.loginRequired, users.show)
//   .get('/users', auth.loginRequired, auth.adminRequired, users.index)

module.exports = router