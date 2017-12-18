angular.module('userControllers',['userServices','authServices'])
.controller('regCtrl',function($http,$location,$timeout,User){
//this is limited to scope;
	var thisobj=this;
thisobj.regUser=function(regData)
{
	thisobj.loading=true;
thisobj.failmsg=false;
//console.log(this.regData);

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
thisobj.errorMsg='google account not recognised';
}
else{
Auth.google($routeParams.token);
$location.path('/');
}

});