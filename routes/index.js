var express=require("express");
var router=express.Router();
var User=require("../models/user");
var bcrypt=require("bcryptjs");
router.get("/", function(req,res){
    res.render("landing");
});
router.get("/signup", function(req,res){
    res.render("signup");
});
router.get("/login", function(req,res){
    res.render("login");
});
/*===================================================================
        THIS ROUTE IS FOR SAVING THE USERS(Handling Registerations) 
=====================================================================*/
router.post("/signup", function(req,res){
    //Hashing The Password
    let hash= bcrypt.hashSync(req.body.password, 14);
    req.body.password= hash;
    //Saving User in the databse
    let registered_user=new User(req.body);
    console.log(registered_user);
    registered_user.save(function(err, doc){
        if (err) {
            if (err.code === 11000) {
                console.log('User was already registered');
            }
        }
    });
    res.redirect("/");
});
/*=================================================
    This Method is for logging in users
===================================================*/
router.post("/login", function(req,res){
    User.findOne({Username: req.body.Username}, function(err, user){
        if(err|| !user ||!(bcrypt.compareSync(req.body.password, user.password))){
            console.log("Incorrect Email Password");
            req.session.isLoggedIn = false;
            res.redirect("/");
        }else{
            console.log("Login is successfull");
            //Setting Up the session
            req.session.isLoggedIn = true;
            req.session.user=user;
            //console.log(req.session.userId);
            res.redirect("/chat");
        }
    });
});
/*====================================
    Method to Handle Logout
======================================*/
router.get("/logout", function(req,res){
    if (req.session) {
        req.session.destroy(function(err) {
          if(err) {
            return next(err);
          } else {
            return res.redirect('/');
          }
        });
    }   
});
module.exports=router;