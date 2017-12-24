var User=require('../models/user');
var express=require('express');
var jwt = require('jsonwebtoken');
var secret='rubikscube';
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var router =  express.Router();
module.exports=router;



var options = {
  auth: {
    api_user: 'abhi3',
    api_key: 'Abhi@0303'
  }
}

var client = nodemailer.createTransport(sgTransport(options));


//user Registration
router.post('/users',function(req,res){
//console.log(req.body.username);
	var user=  new User;
   user.username=req.body.username;
    user.email=req.body.email; 
    user.password=req.body.password;
    user.name=req.body.name;
    user.temporarytoken=jwt.sign({username: user.username, email: user.email}, secret, { expiresIn: '5h' });
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


       var email = {
        from: 'Localhost staff,staff@localhost.com',
          to: user.email,
          subject: 'Localhost Activation Link',
           text: 'Hello'+user.name+',Thank you for registering at localhost.com.Please activate your account by clicking following link: http://localhost:3000/activate'+user.temporarytoken,
         html: 'Hello<strong>'+user.name+'</strong>,<br><br>Thank you for registering at localhost.com.Please activate your account by clicking following link:<br><br><a href="http://localhost:3000/activate/'+user.temporarytoken+'">http:localhost:3000/activate</a>'
          };

          client.sendMail(email, function(err, info){
             if (err ){
             console.log(err);
              }
              else {
         console.log('Message sent: ' + info.response);
           }
           });


          res.json({success:true, message:'Account registered!Please check your email to activate'});
          }
         });

    }

});










//for checking existing username/email when textbox is filled

router.post('/checkusername', function(req,res){ 
User.findOne({ username: req.body.username }).select('username').exec(function(err, user) { 
  if(err) throw err;
  if(user){
    res.json({success:false,message:'Username already taken'});
  } 
  else{
    res.json({success:true,message:'Valid Username'});
  }

});
});


router.post('/checkemail', function(req,res){ 
//console.log('kj');
User.findOne({ email: req.body.email }).select('email').exec(function(err, user) { 
  if(err) throw err;
  if(user){
    console.log('kj');
    res.json({success:false,message:'Email already taken'});
  } 
  else{
    res.json({success:true,message:'Valid Email'});
  }

});
});




//User Authentication





router.post('/authenticate', function(req,res){ 
User.findOne({ username: req.body.username }).select('email username password active').exec(function(err, user) { 
if(req.body.username==null ||req.body.password==null){res.json({success:false,message:'missing fields'}); return;}
if (err) throw err; 
if (!user ) { res.json({success: false, message: 'Could not authenticate user'});
return;
 //to stop second callback 
}
 
    if(req.body.password && req.body.password !== undefined)
  { var validPassword = user.comparePassword(req.body.password);

   if(!validPassword ) {
    res.json({success: false, message: 'could not authenticate password'});}

    else if(!user.active){
      res.json({success: false, message: 'Account not  activated..check your email!',expired:true}); 
        
    }
    else
      {
       var token= jwt.sign({username: user.username, email: user.email}, secret, { expiresIn: '30s' });

  ///also in serialse in passport sameintial token expire time
       res.json({success: true, message: 'User Authenticated', token: token}); }

       }

    else{ res.json({success: false, message: 'no password provided'});  }﻿
});
});


router.put('/activate/:token',function(req,res){
//console.log('kk');
User.findOne({temporarytoken:req.params.token},function(err,user){
if(err) throw err;
var token=req.params.token;

 jwt.verify(token,secret,function(err,decoded){
     
     if(err){
      res.json({success:false,message:'Activation link has expired'});
      }
  
     else if(!user){
       res.json({success:false,message:'Activation link has expired'});

      }else{
           user.temporarytoken=false;
           user.active=true;
           user.save(function(err){
             if(err){console.log(err);}

             else{

               var email = {
        from: 'Localhost staff,staff@localhost.com',
       to: user.email,
          subject: 'Localhost Account Activated',
           text: 'Hello'+user.name+'Your account has been successfully activated!',
         html: 'Hello<strong>'+user.name+'</strong>,<br>Your account has been successfully activated!'
          };

          client.sendMail(email, function(err, info){
             if (err ){
             console.log(error);
              }
              else {
         console.log('Message sent: ' + info.response);
           }
           });


         
              res.json({success:true,message:'Account activated'});

             }
           });
         
      }

});

});

});




router.post('/resend', function(req,res){ 
User.findOne({ username: req.body.username }).select(' username password active').exec(function(err, user) { 
if(req.body.username==null ||req.body.password==null||req.body.username==undefined){res.json({success:false,message:'Missing fields'});}
if (err) throw err; 
if (!user ) { res.json({success: false, message: 'Could not authenticate user'});

 return;//to stop second callback 
}
 
    if(req.body.password && req.body.password !== undefined)
  { var validPassword = user.comparePassword(req.body.password);

   if(!validPassword ) {
    res.json({success: false, message: 'could not authenticate password'}); }

    else if(user.active){
      res.json({success: false, message: 'Account is already activated'}); 

    }
    else
      {
       


       res.json({success:true,user:user}); }

       }

    else{ res.json({success: false, message: 'no password provided'}); }﻿
});
});

router.put('/resend',function(req,res){

User.findOne({username:req.body.username}).select('username name email temporarytoken').exec(function(err,user){

if(err) throw err;
user.temporarytoken=jwt.sign({username: user.username, email: user.email}, secret, { expiresIn: '5h' });
user.save(function(err){
  if(err){
console.log(err)

  }else{
    var email = {
        from: 'Localhost staff,staff@localhost.com',
          to: user.email,
          subject: 'Localhost Activation Link',
           text: 'Hello'+user.name+',You requested an activation link.Please activate your account by clicking following link: http://localhost:3000/activate'+user.temporarytoken,
         html: 'Hello<strong>'+user.name+'</strong>,<br><br>You requested an activation link.Please activate your account by clicking following link:<br><br><a href="http://localhost:3000/activate/'+user.temporarytoken+'">http:localhost:3000/activate</a>'
          };

          client.sendMail(email, function(err, info){
             if (err ){
             console.log(err);
              }
              else {
         console.log('Message sent: ' + info.response);
           }
           });
res.json({success:true,message:'link sent to:  '+user.email})

  }
});

});



});

router.get('/resetusername/:email',function(req,res){

User.findOne({email:req.params.email}).select('email name username').exec(function(err,user){

if(err){
 // console.log('kkk');
res.json({success:false,message:err});
} 
else {
  if(!req.params.email){
res.json({success:false,   message:'Email not provided'});

}

else{

 if(!user){
res.json({success:false,message:'Email not found'});

}else{

   var email = {
        from: 'Localhost staff,staff@localhost.com',
          to: user.email,
          subject: 'Localhost Username Request',
           text: 'Hello'+user.name+',You recently requested your username. Please save it in your files:'+ user.username,
         html: 'Hello<strong>'+user.name+'</strong>,<br><br>You recently requested your username. Please save it in your files:'+ user.username
       };

          client.sendMail(email, function(err, info){
             if (err ){
             console.log(err);
              }
              else {
         console.log('Message sent: ' + info.response);
           }
           });
  res.json({success:true, message:'Username has been sent to email'});

      }
}
}
});


});

router.put('/resetpassword',function(req,res){
User.findOne({username:req.body.username}).select('username email active resettoken name').exec(function(err,user){
   if(err){throw err;}


     if(!user)
   {
  res.json({success:false, message: 'Username not found'});
    }
    else if(!user.active){
   res.json({success:false, message:'Account not activated'});

     }else{

      user.resettoken=jwt.sign({username: user.username, email: user.email}, secret, { expiresIn: '5h' });
       user.save(function(err){
         if(err){
          res.json({success:false, message:err});
         }else{


             var email = {
        from: 'Localhost staff,staff@localhost.com',
          to: user.email,
          subject: 'Localhost Password Request',
           text: 'Hello'+user.name+',You recently requested your password reset. Please click the link below to reset it: http://localhost:3000/reset/'+ user.resettoken,
         html: 'Hello<strong>'+user.name+'</strong>,<br><br>You recently requested your password reset. Please click the link below to reset it:<a href="http://localhost:3000/reset/'+ user.resettoken+'">http://localhost:3000/reset</a>'
       };

          client.sendMail(email, function(err, info){
             if (err ){
             console.log(err);
              }
              else {
         console.log('Message sent: ' + info.response);
           }
           });
          res.json({success:true, message:'Check your email for resetting password'});
         }

       });

     }
});

});


router.get('/resetpassword/:token',function(req,res){
User.findOne({resettoken:req.params.token}).select().exec(function(err,user){

if(err) throw err;
var token=req.params.token;

jwt.verify(token,secret,function(err,decoded){
     
     if(err){
      //console.log('lll');
      res.json({success:false, message: 'password reset  link expired.'});
      }
  
     else{

      if(!user){
        res.json({success:false, message:'Link has expired'});
      }
      else{
       res.json({success:true, user:user});
      }
      }

});

});




});


router.put('/savepassword',function(req,res){

User.findOne({username:req.body.username}).select('username resettoken name email password').exec(function(err,user){
if(err)throw err;
if(req.body.password==null || req.body.password==''){
res.json({success:false,message:'Password has not been provided.'});


}
else{
user.password=req.body.password;

user.resettoken=false;
user.save(function(err){
if(err){

  res.json({success:false,message:err});

}else{
 var email = {
        from: 'Localhost staff,staff@localhost.com',
          to: user.email,
          subject: 'Localhost Password Reset',
           text: 'Hello'+user.name+',This email has been sent to notify that your account password has been reset',
         html: 'Hello<strong>'+user.name+'</strong>,<br><br>This email has been sent to notify that your account password has been reset'
       };

          client.sendMail(email, function(err, info){
             if (err ){
             console.log(err);
              }
              else {
         console.log('Message sent: ' + info.response);
           }
           });
  res.json({success:true,message:'Password has been reset!'});
}




});
  
}

});




});
//middlewre to access token  when user is logged in.// all routes that need token mustbe placed after this middleware

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



router.get('/renewtoken/:username', function(req,res){
User.findOne({username:req.params.username}).select().exec(function(err,user){
if(err) throw err;
console.log(req.params.username);
if(!user){res.json({success:false,message:'no user found'});}
else{
  var newtoken= jwt.sign({username: user.username, email: user.email}, secret, { expiresIn: '24h' });
  // console.log(user);

       res.json({success: true, token: newtoken}); 
}

});

});



router.get('/permission',function(req,res){
//console.log('vvv');
User.findOne({username:req.decoded.username},function(err,user){
if(err)throw err;
if(!user){
 res.json({success:false,message:'user not found'});
}else{

res.json({success:true,permission:user.permission});
}

});

});


router.get('/management',function(req,res){

User.find({},function(err,users){
  if(err)throw err;

  User.findOne({username:req.decoded.username},function(err,mainuser){
     if(err)throw err;
    if(!mainuser){
      res.json({success:false,message:'No user found'});
    }else{
        if(mainuser.permission=='admin'||mainuser.permission=='moderator'){

          if(!users){
            res.json({success:false,message:'no users'});}
            else{
              res.json({success:true,users: users, permission:mainuser.permission});
            }
          }

        else{

          res.json({success:false,message:'not permitted'});
        }


    }


  });

});

});


router.delete('/management/:username',function(req,res){
  
var deleteUser=req.params.username;
User.findOne({username:req.decoded.username},function(err,mainuser){

 if(err)throw err;
    if(!mainuser){
      res.json({success:false,message:'No user found'});
       }else{

         if(mainuser.permission!='admin'){
        res.json({success:false,message:'Not permitted'});
        }else{
             User.findOneAndRemove({username:deleteUser},function(err,user){
                 if (err) throw err;
                 res.json({success:true});
             });
        }
      }
    
});
});
//whenever querying mongodb ask for _id   but$routeparamshas  atrribute'id'

router.get('/edit/:id',function(req,res){
var editUser=req.params.id;

User.findOne({username:req.decoded.username},function(err,mainuser){
if (err)throw err;
if(!mainuser){
  res.json({success:false,message:'not found mainuser'});
}else{
  if(mainuser.permission=='admin'||mainuser.permission=='moderator' ){
      User.findOne({_id:editUser},function(err,user){
          if(err)throw err;
          if(!user){
            res.json({success:false,message:'usernot found'});
          }else{
             res.json({success:true,user:user});
        }
      });
  }else{
    res.json({success:false,message:'not permitted'});
  }
}

});


});





router.put('/edit',function(req,res){
var editUser=req.body._id;
if(req.body.name)var newName=req.body.name;
if(req.body.username)var newUsername=req.body.username;
if(req.body.email)var newEmail=req.body.email;
if(req.body.permission)var newPermission=req.body.permission;
User.findOne({username:req.decoded.username},function(err,mainuser){
    if(err)throw err;
   if(!mainuser){
    res.json({success:false,message:'not found mainuser'});

      }
    else{//@
     if(newName){
         if(mainuser.permission=='admin'||mainuser.permission=='moderator'){
           User.findOne({_id:editUser},function(err,user){
             if(err)throw err;
             if(!user){
              res.json({success:false,message:'no user'});
             }else{
              user.name=newName;
              user.save(function(err){
               if(err) {console.log(err);}
               else{res.json({success:true,message:'successful name update'});}
              });
             }


          });
          }else{
         res.json({success:false,message:'no permit'});
          }
       }

     if(newUsername){
           if(mainuser.permission=='admin'||mainuser.permission=='moderator'){
            var x=false;
            User.findOne({username:req.body.username},function(err,user){
                
                if(user){
                  res.json({success:false,message:'Username already taken'});
                  x=true;
                }
              });
                User.findOne({_id:editUser},function(err,user){
                if(err)throw err;
             if(!user){
              res.json({success:false,message:'no user'});
             }else{
              
              user.username=newUsername;
              if(x==false){
              user.save(function(err){
               if(err) {throw err;}
               else{res.json({success:true,message:'successful username update'});}
              });}
             }


             });

           }else{
            res.json({success:false,message:'no permit'});

           }
     }


     if(newEmail){
      
           if(mainuser.permission=='admin'||mainuser.permission=='moderator'){
            var y=false;
            User.findOne({email:req.body.email},function(err,user){
                
                if(user){
                  res.json({success:false,message:'Email already taken'});
                  y=true;
                }
              });
                User.findOne({_id:editUser},function(err,user){
             if(err)throw err;
             if(!user){
              res.json({success:false,message:'no user'});
             }else{
              
              user.email=newEmail;
              if(y==false){
                console.log(y);
              user.save(function(err){
               if(err) {console.log(err);}
               else{res.json({success:true,message:'successful email update'});}
              });}
             }


             });

           }else{
              res.json({success:false,message:'no permit'});

           }
         }
             

    if(newPermission){


         if(mainuser.permission=='admin'||mainuser.permission=='moderator'){

                 User.findOne({_id:editUser},function(err,user){
                  if(err)throw err;
                    if(!user){
                   res.json({success:false,message:'no user'});
                     }else{//pp

                       //new changeto usser  permiss
                       if(newPermission=='user'){
                         if(user.permission=='admin'){

                            if(mainuser.permission!='admin'){
                           res.json({success:false,message:'you cannot downgrade admin'});
                           }
                    
                           else{
                          user.permission=newPermission;
                          user.save(function(err){
                           if(err){console.log(err);}

                          else{
                            res.json({success:true,message:'updated'});
                            }
                            });
                          }

                       }else{
                       user.permission=newPermission;
                          user.save(function(err){
                             if(err){
                           console.log(err);
                               }else{
                              res.json({success:true,message:'updated'});
                             }
                          });
                       }

      
                         }

                   // new change to user(end)




















                     
                 if(newPermission=='moderator'){

                     if(user.permission=='admin'){
                          if(mainuser.permission!='admin'){
                           res.json({success:false,message:'you cannot downgrade admin'});
                           }
                    
                             else{
                             user.permission=newPermission;
                              user.save(function(err){
                             if(err){
                              console.log(err);
                              }else{
                             res.json({success:true,message:'updated'});
                                 }
                            });
                           }

                        } else{

                          user.permission=newPermission;
                          user.save(function(err){
                           if(err){
                             console.log(err);
                             }else{
                            res.json({success:true,message:'updated'});
                             }
                          });

                         }
                       }





              if(newPermission=='admin'){

                     if(mainuser.permission=='admin'){
                      console.log('hh');
                         user.permission=newPermission;
                         user.save(function(err){
                          if(err){
                          console.log(err);
                       }else{
                        res.json({success:true,message:'updated'});
                      }
                       });


                     }else{
                      res.json({success:false,message:'you cannot downgrade admin'});
                     }


               }



               













                    }//pp


                   });
              
            }

          else{
          res.json({success:false,message:'no permit'});


            }

      }















    
}//@




});

});