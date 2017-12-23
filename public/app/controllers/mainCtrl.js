angular.module('mainController',['authServices','userServices','ngRoute'])
.controller('mainCtrl',function(Auth,User,AuthToken,$timeout,$location,$rootScope,$window,$interval,$route,$scope){
var thisobj=this;
//current nav pills
$scope.isActive = function (viewLocation) {
     var active = (viewLocation === $location.path());
     return active;
};
//load angularornot
thisobj.loadme=false;
//creating session
thisobj.checkSession=function(){

if(Auth.isLoggedIn()){
thisobj.checkingSession=true;
var interval=$interval(function(){
var token=$window.localStorage.getItem('token');
if(token==null){
	$interval.cancel(interval);
}

else{

	self.parseJwt=function(token){
		var base64Url=token.split('.')[1];
		var base64=base64Url.replace('-','+').replace('_','/');
		return JSON.parse($window.atob(base64));
	}
	var expireTime=self.parseJwt(token);
	var timeStamp=Math.floor(Date.now()/1000);
	var timeCheck=expireTime.exp-timeStamp;
	//console.log(timeCheck);
	if(timeCheck<=5){
       showModal(1);
     $interval.cancel(interval);
	}else{
     console.log('Not expired');


	}
}
},2000);
}

};


//to intiate session whenever page or main controller loaadsloads;

thisobj.checkSession();


//show BS modal
var showModal=function(option){
	thisobj.choiceMade=false;
	thisobj.modalHeader=undefined;
	thisobj.modalBody=undefined;
	thisobj.hideButton=false;
      
       if(option===1){
       	thisobj.modalHeader='Timeout Warning';
	   thisobj.modalBody='Your session will expire in 5 Seconds.Would you like to renew it?';
       $("#myModal").modal({backdrop: "static"});
       $timeout(function(){
        if(!thisobj.choiceMade){
         Auth.logOut();
       		$window.location.reload();
          $location.path('/');
            hideModal();
            //if on homepage when loggingout
             $window.localStorage.clear();
        }
       },5000);
       
       }
      else if(option===2){
      	thisobj.hideButton=true;
      	thisobj.modalHeader='Logging Out..';
       $("#myModal").modal({backdrop: "static"});
       $timeout(function(){
       		Auth.logOut();
       		
          $location.path('/');
            hideModal();
            //if on homepage when loggingout
             $window.location.reload();
            
       	},2000);
      }


      
};


thisobj.renewSession=function(){
	thisobj.choiceMade=true;
	//console.log(thisobj.username);
   User.renewSession(thisobj.username).then(function(data){
   if(data.data.success){

   	AuthToken.setToken(data.data.token);
   	thisobj.checkSession();
   }
});

	hideModal();

};
thisobj.endSession=function(){
thisobj.choiceMade=true;
hideModal();
$timeout(function(){
showModal(2);
},1000);

};

var hideModal=function(){

$("#myModal").modal("hide");
};

//new view after logout

$rootScope.$on('$routeChangeStart',function(){
if(!thisobj.checkingSession) {thisobj.checkSession();}

thisobj.disabled=false;
thisobj.failmsg=false;
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
	
	thisobj.loginData=null;
	thisobj.isLoggedIn=false;
	thisobj.loadme=true;
	

 }
if($location.hash() == '#_=_') {$location.hash(null);}

	});



this.facebook=function(){

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
thisobj.checkSession();

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
	showModal(2);
 

};

});





