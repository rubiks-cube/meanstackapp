var User=require('../models/user');
var express=require('express');
var jwt = require('jsonwebtoken');
var secret='rubikscube';
var router =  express.Router();
module.exports=router;

//user Registration
router.post('/users',function(req,res){
//console.log(req.body.username);
	var user=  new User;
   user.username=req.body.username;
    user.email=req.body.email; 
    user.password=req.body.password;
    user.name=req.body.name;
  if(req.body.username==null||req.body.useranme==''||req.body.password==null||req.body.password==''||req.body.email==null||req.body.email==''||req.body.name==null||req.body.name==''){
    res.json({success:false, message:'Missing Fields'});

    //console.log('missing');
  }

else{
     user.save(function(err)
     {//console.log('save');
         if(err){

           if(err.errors!=null){

  
               if(err.errors.name){
                 res.json({success:false, message:err.errors.name.message});}

                 else if(err.errors.email){
                res.json({success:false, message:err.errors.email.message});}

                 else if(err.errors.username){
                  res.json({success:false, message:err.errors.username.message});}

                  else if(err.errors.password){
                  res.json({success:false, message:err.errors.password.message});}
                   else{
                   res.json({success:false,message:err});}
               }


              else if(err){
                   if(err.code==11000){
                    if(err.errmsg[60]=='u'){
                     res.json({success:false,message:'User already exists'});}
                     if(err.errmsg[60]=='e')
                     {
                       res.json({success:false,message:'Email already exists'});
                     }
                    }

                     
                  }
                   else{
                     res.json({success:false,message:err});
                    }
                   
              }
            
          

        else{
          res.json({success:true, message:'Added'});
          }
  });

    }

});


//User Authentication





router.post('/authenticate', function(req,res){ 
User.findOne({ username: req.body.username }).select('email username password').exec(function(err, user) { 
if(req.body.username==null ||req.body.password==null||req.body.username==undefined){res.json({success:false,message:'missing fields'});}
if (err) throw err; 
if (!user ) { res.json({success: false, message: 'Could not authenticate user'});

 return;//to stop second callback 
}
 
    if(req.body.password && req.body.password !== undefined)
  { var validPassword = user.comparePassword(req.body.password);

   if(!validPassword ) {
    res.json({success: false, message: 'could not authenticate password'}); }
    else
      {
       var token= jwt.sign({username: user.username, email: user.email}, secret, { expiresIn: '5h' });


       res.json({success: true, message: 'User Authenticated', token: token}); }

       }

    else{ res.json({success: false, message: 'no password provided'}); }﻿
});
});

//middlewre to access token

router.use(function(req,res,next){

var token=req.body.token||req.body.query||req.headers['x-access-token'];

if(token){
  //verify token
       jwt.verify(token,secret,function(err,decoded){
     
     if(err){
      res.json({success:false,message:'token invalid'});
      }
  
     else{
       req.decoded=decoded;
//goto next function
        next();

      }

});
 }      
else{
  res.json({success:false, message:'No token provided'});}

});






router.post('/me',function(req,res){
res.send(req.decoded);
});