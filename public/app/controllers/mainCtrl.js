angular.module('mainController',['authServices'])
.controller('mainCtrl',function(Auth,$timeout,$location,$rootScope){
var thisobj=this;

//load angularornot
thisobj.loadme=false;
//new view after logout

$rootScope.$on('$routeChangeStart',function(){

if(Auth.isLoggedIn()){
	//console.log('sucess');
	thisobj.isLoggedIn=true;
	Auth.getUser().then(function(data){
		//console.log(data);
		thisobj.username= data.data.username;
		thisobj.usermail=data.data.email;
		thisobj.loadme=true;
	});

}
else{
	//console.log('not');
	thisobj.username='';
	thisobj.isLoggedIn=false;
	thisobj.loadme=true;
 }

	});







thisobj.doLogin=function(loginData)
{
	thisobj.loading=true;
thisobj.failmsg=false;
//console.log(this.regData);

Auth.login(thisobj.loginData).then(function(data){
	//console.log(data.data.message);
if(data.data.success){
	thisobj.loading=false;
thisobj.successmsg=data.data.message+'.......Redirecting...';
$timeout(function(){$location.path('/about');},2000);
thisobj.loginData='';
thisobj.successmsg=false;


}

else{
//thisobj.loading=false;
thisobj.failmsg=data.data.message;

thisobj.successmsg=false;
}

});

};

this.logOut=function(){
 Auth.logOut();
$location.path('/logout');
$timeout(function(){
$location.path('/');},4000
);
};
});
