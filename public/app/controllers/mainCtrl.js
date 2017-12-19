angular.module('mainController',['authServices'])
.controller('mainCtrl',function(Auth,$timeout,$location,$rootScope,$window){
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
if($location.hash() == '#_=_') {$location.hash(null);}

	});



this.facebook=function(){
console.log($window.location.protocol);
console.log($window.location.host);
$window.location=$window.location.protocol+'//' +$window.location.host+'/auth/facebook';
};




this.google=function(){

$window.location=$window.location.protocol+'//' +$window.location.host+'/auth/google';
};


this.twitter=function(){

$window.location=$window.location.protocol+'//' +$window.location.host+'/auth/twitter';
};

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

thisobj.logOut=function(){
 Auth.logOut();
$location.path('/logout');
$timeout(function(){
$location.path('/');},4000
);
};
});





