angular.module('userControllers',['userServices','authServices'])
.controller('regCtrl',function($http,$location,$timeout,User){
//this is limited to scope;
	var thisobj=this;
thisobj.regUser=function(regData,valid,confirmed)
{thisobj.disabled=true;
	thisobj.loading=true;
thisobj.failmsg=false;
//console.log(this.regData);
if(valid && confirmed){
 User.create(thisobj.regData).then(function(data){
	//console.log('uiii');
	
   if(data.data.success){
	thisobj.loading=false;
   thisobj.successmsg=data.data.message+'.......Redirecting...';
      $timeout(function(){$location.path('/');},2000);


      }
   else{
  thisobj.loading=false;
   thisobj.failmsg=data.data.message;
   thisobj.disabled=false;
    thisobj.successmsg=false;
   }

 });
}

else{
thisobj.disabled=false;
	thisobj.loading=false;
	thisobj.failmsg='Ensure form is filled properly';
}


};

thisobj.checkUsername=function(regData){

	thisobj.checkingUsername=true;
	thisobj.usernameInvalid=false;
	thisobj.usernameMsg=false;
User.checkUsername(thisobj.regData).then(function(data){
if(data.data.success){
	thisobj.checkingUsername=false;
	thisobj.usernameInvalid=false;
	thisobj.usernameMsg=data.data.message;
}
else{
    thisobj.checkingUsername=false;
	
	 thisobj.usernameInvalid=true;
	  thisobj.usernameMsg=data.data.message;
}
});

}


//User.checkEmail

thisobj.checkEmail=function(regData){
//console.log('hhhhhhh');
	thisobj.checkingEmail=true;
	thisobj.emailInvalid=false;
	thisobj.emailMsg=false;
User.checkEmail(thisobj.regData).then(function(data){
if(data.data.success){
	thisobj.checkingEmail=false;
	thisobj.emailInvalid=false;
	thisobj.emailMsg=data.data.message;
}
else{

  thisobj.checkingEmail=false;
	thisobj.emailInvalid=true;
	thisobj.emailMsg=data.data.message;
}
});

}

})

//custom directive for password match

.directive('match',function(){
	return{
      restrict:'A',
      controller:function($scope){
      	$scope.confirmed=false;
            $scope.doConfirm=function(values){
            	values.forEach(function(ele){
                  if($scope.confirm==ele){

                  	$scope.confirmed=true;
                  }else{
                        $scope.confirmed=false;
                  }
            	});
            }
         },

         link:function(scope,element,attrs){
         	attrs.$observe('match',function(){
                 scope.matches=JSON.parse(attrs.match);
         		scope.doConfirm(scope.matches);
         	});
         	scope.$watch('confirm',function(){
         		scope.matches=JSON.parse(attrs.match);
         		scope.doConfirm(scope.matches);
         	});
         }
    

	};
})

.controller('facebookCtrl', function($routeParams, Auth, $location, $window,){
//console.log($routeParams.token);
var thisobj=this;
thisobj.errorMsg=false;
thisobj.expired=false;
thisobj.disabled=true;
if($window.location.pathname=='/facebookerror'){
thisobj.errorMsg='Facebook account not recognised';
}
else if($window.location.pathname=='/facebook/inactive/error'){
thisobj.errorMsg='Account not  activated..check your email!';
thisobj.expired=true;

}
else{
Auth.facebook($routeParams.token);
//console.log(user);th

$location.path('/about');
}

})


.controller('googleCtrl', function($routeParams, Auth, $location, $window){
//console.log($routeParams.token);
var thisobj=this;thisobj.errorMsg=false;
thisobj.expired=false;
thisobj.disabled=true;
if($window.location.pathname=='/googleerror'){
thisobj.errorMsg='Google account not recognised';
}else if($window.location.pathname=='/google/inactive/error'){
thisobj.errorMsg='Account not  activated..check your email!';
thisobj.expired=true;

}
else{
Auth.google($routeParams.token);
$location.path('/about');
}

})



.controller('twitterCtrl', function($routeParams, Auth, $location, $window){
//console.log($routeParams.token);
var thisobj=this;
thisobj.errorMsg=false;
thisobj.expired=false;
thisobj.disabled=true;
if($window.location.pathname=='/twittererror'){
thisobj.errorMsg='Twitter account not recognised';
}else if($window.location.pathname=='/twitter/inactive/error'){
thisobj.errorMsg='Account not  activated..check your email!';
thisobj.expired=true;
}
else{
Auth.twitter($routeParams.token);
$location.path('/');
}

});