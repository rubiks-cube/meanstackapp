var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt=require('bcrypt-nodejs');
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');


//regExp for only letters in name
var nameValidator = [
  validate({
    validator: 'matches',
     arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/,
     message:'Name must have at least 3 letters and maximum 30,no special characters or numbers,space in between  name'
  }),
  validate({
   validator: 'isLength',
  arguments: [3, 25],
  message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
  })
];

var emailValidator = [
  validate({
    validator: 'isEmail',
     message:'Not a valid email'
  }),

validate({
  validator: 'isLength',
  arguments: [3, 35],
  message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
})
];


var userValidator = [
  validate({
   validator: 'isLength',
  arguments: [3, 25],
  message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
  }),
validate({
    validator: 'isAlphanumeric',
    message: 'Username should contain alpha-numeric characters only'
})

];

var passwordValidator = [
  validate({
    validator: 'matches',
     arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,30}$/,
     message:'Password must contain lowercase ,uppercase ,digits,special characters ,b/w 8-35 size'
  }),
  validate({
   validator: 'isLength',
  arguments: [8, 25],
  message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
  })
];

var UserSchema = new Schema({
  name:{type:String,  required:true,validate: nameValidator},
  username: {type:String, lowercase:true, required:true, unique:true,validate: userValidator},
  password: {type:String, required:true,validate: passwordValidator},
  email:{type:String, lowercase:true, required:true, unique:true,validate: emailValidator}
   
  
});

UserSchema.pre('save',function(next){
  var user=this;
  bcrypt.hash(user.password, null, null, function(err, hash) {
    // Store hash in your password DB.
    user.password=hash;
  //  console.log('hii');
    next();
  
});


});
//to capialise first letter and rest small
UserSchema.plugin(titlize, {
  paths: [ 'name' ] 
  
});

UserSchema.methods.comparePassword=function(password){
	return bcrypt.compareSync(password,this.password);
}

module.exports=mongoose.model('User',UserSchema);



