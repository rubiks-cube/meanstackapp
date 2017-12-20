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


});