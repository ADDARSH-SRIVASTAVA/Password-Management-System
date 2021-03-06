var express = require('express');
var router = express.Router();
var userModule=require('../modules/user');
var passCatModel = require('../modules/password_category');
var passModel = require('../modules/add_password');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

var getPassCat = passCatModel.find({});
var getAllPass = passModel.find({});
/* GET home page. */

function checkLoginUser(req,res,next){
  var userToken=localStorage.getItem('userToken');
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch(err) {
    res.redirect('/');
  }
  next();
}
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

function checkUsername(req,res,next){
  var uname=req.body.uname;
  var checkexistemail=userModule.findOne({username:uname});
  checkexistemail.exec((err,data)=>{
    if(err) throw err;
    if(data){
      return  res.render('signup', { title: 'Password Management System', msg:'Username already Exist'});
    }
    next();
  });
}
function checkEmail(req,res,next){
  var email=req.body.email;
  var checkexistemail=userModule.findOne({email:email});
  checkexistemail.exec((err,data)=>{
    if(err) throw err;
    if(data){
      return  res.render('signup', { title: 'Password Management System', msg:'Email already Exist'});
    }
    next();
  });
} 
/** 
router.get('/', checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    res.render('dashboard', { title: 'Password Management System', loginUser: loginUser , msg:''});
  });
**/

router.get('/', checkLoginUser,function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  passModel.countDocuments({}).exec((err,count)=>{
    passCatModel.countDocuments({}).exec((err,countasscat)=>{    
  res.render('dashboard', { title: 'Password Management System', loginUser:loginUser,msg:'',totalPassword:count, totalPassCat:countasscat });
  });
});
});
  module.exports = router;
  