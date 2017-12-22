angular.module('mainController',['authServices'])
.controller('mainCtrl',function(Auth,$timeout,$location,$rootScope,$window){
var thisobj=this;

//load angularornot
thisobj.loadme=false;
//new view after logout

$rootScope.$on('$routeChangeStart',function(){
thisobj.disabled=false;
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
thisobj.disabled=true;
$window.location=$window.location.protocol+'//' +$window.location.host+'/auth/facebook';
};




this.google=function(){
thisobj.disabled=true;
$window.location=$window.location.protocol+'//' +$window.location.host+'/auth/google';
};


this.twitter=function(){
thisobj.disabled=true;
$window.location=$window.location.protocol+'//' +$window.location.host+'/auth/twitter';
};

thisobj.doLogin=function(loginData)
{
	thisobj.loading=true;
thisobj.failmsg=false;
thisobj.disabled=true;
thisobj.expired=false;
//console.log(this.regData);

Auth.login(thisobj.loginData).then(function(data){
	//console.log(data.data.message);
if(data.data.success){
	thisobj.loading=false;
	 thisobj.disabled=false;
thisobj.successmsg=data.data.message+'.......Redirecting...';
$timeout(function(){$location.path('/about');},1500);
thisobj.loginData=null;
thisobj.successmsg=false;


}

else{
//thisobj.loading=false;
if(data.data.expired){
	
thisobj.failmsg=data.data.message;
thisobj.expired=true;
thisobj.successmsg=false;}
else{
thisobj.failmsg=data.data.message;
thisobj.disabled=false;
thisobj.successmsg=false;

}
}

});

};

thisobj.logOut=function(){
 Auth.logOut();
$location.path('/logout');

$timeout(function(){
$location.path('/');},2000
);


};

});





