angular.module('userControllers',['userServices','authServices'])
.controller('regCtrl',function($http,$location,$timeout,User){
//this is limited to scope;
	var thisobj=this;
thisobj.regUser=function(regData,valid)
{
	thisobj.loading=true;
thisobj.failmsg=false;
//console.log(this.regData);
if(valid){
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

    thisobj.successmsg=false;
   }

 });
}

else{

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
console.log('hhhhhhh');
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
if($window.location.pathname=='/facebookerror'){
thisobj.errorMsg='Facebook account not recognised';
}
else{
Auth.facebook($routeParams.token);
//console.log(user);
$location.path('/about');
}

})


.controller('googleCtrl', function($routeParams, Auth, $location, $window){
//console.log($routeParams.token);
var thisobj=this;
if($window.location.pathname=='/googleerror'){
thisobj.errorMsg='Google account not recognised';
}
else{
Auth.google($routeParams.token);
$location.path('/');
}

})



.controller('twitterCtrl', function($routeParams, Auth, $location, $window){
//console.log($routeParams.token);
var thisobj=this;
if($window.location.pathname=='/twittererror'){
thisobj.errorMsg='Twitter account not recognised';
}
else{
Auth.twitter($routeParams.token);
$location.path('/');
}

});