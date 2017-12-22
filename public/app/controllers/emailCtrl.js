angular.module('emailController',['userServices'])
.controller('emailCtrl',function($routeParams,User,$timeout,$location){
 //console.log($routeParams.token);

 var thisobj=this;;
User.activeAccount($routeParams.token).then(function(data){
	thisobj.successmsg=false;
	thisobj.failmsg=false;
if(data.data.success){
thisobj.successmsg=data.data.message+'...Redirecting';
$timeout(function() {
	$location.path('/login');}, (2000));

}
else{
	thisobj.failmsg=data.data.message+'...Redirecting';
	$timeout(function() {
	$location.path('/login');}, (2000));

}
});
})

.controller('resendCtrl',function(User){
var thisobj=this;

thisobj.checkCredentials=function(loginData){
thisobj.failmsg=false;
thisobj.successmsg=false;
thisobj.disabled=true;
User.checkCredentials(thisobj.loginData).then(function(data){
console.log(data.data.success);
if(data.data.success){

User.resendLink(thisobj.loginData).then(function(data){
if(data.data.success){
	thisobj.successmsg=data.data.message;
}

});
}else{
     thisobj.disabled=false;
	thisobj.failmsg=data.data.message;
}
});
};


})

.controller('usernameCtrl',function(User){
var thisobj=this;

thisobj.sendUsername=function(userData,valid){
thisobj.failmsg=false;
thisobj.loading=true;
thisobj.disabled=true;


if(valid){

User.sendUsername(thisobj.userData.email).then(function(data){
thisobj.loading=false;

  
   if(data.data.success){
   	
    thisobj.successmsg=data.data.message;
    
    
   }else{
   	thisobj.disabled=false;
   	thisobj.failmsg= data.data.message;
   }



});

}else{
	thisobj.loading=false;
     thisobj.disabled=false;
	thisobj.failmsg="Provide a valid email";
}
};

})

.controller('passwordCtrl',function(User){

var thisobj=this;

thisobj.sendPassword=function(resetData,valid){
thisobj.failmsg=false;
thisobj.loading=true;
thisobj.disabled=true;


if(valid){

User.sendPassword(thisobj.resetData).then(function(data){
thisobj.loading=false;

  
   if(data.data.success){
   	
    thisobj.successmsg=data.data.message;
    
    
   }else{
   	thisobj.disabled=false;
   	thisobj.failmsg= data.data.message;
   }



});

}else{
	thisobj.loading=false;
     thisobj.disabled=false;
	thisobj.failmsg="Provide a valid username";
}
};

})


.controller('resetCtrl',function(User,$routeParams,$scope,$location,$timeout){
var thisobj=this;
thisobj.hide=true;
User.resetUser($routeParams.token).then(function(data){
if(data.data.success){
  thisobj.hide=false;
thisobj.successmsg='Please enter a new password';
$scope.username=data.data.user.username;

}

else{
	
   thisobj.failmsg=data.data.message;

}

});


thisobj.savePassword=function(regData,valid,confirmed){

thisobj.failmsg=false;
thisobj.disabled=true;
thisobj.loading=true;


	if(valid && confirmed){
		thisobj.regData.username=$scope.username;
     User.savePassword(thisobj.regData).then(function(data){
        thisobj.loading=false;
        if (data.data.success){
        	thisobj.successmsg=data.data.message+'....Redirecting';
        	$timeout(function() {
	$location.path('/login');}, (2000));
        }
    
       else{
       	thisobj.disabled=false;
       	thisobj.loading=false;
           thisobj.failmsg=data.data.message;

           }
      });
   }
	

	else{
		thisobj.loading=false;
        thisobj.disabled=false;
		thisobj.failmsg='Please ensure form is filled properly'
	}
};
});


