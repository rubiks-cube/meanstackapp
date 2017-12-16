angular.module('userControllers',['userServices'])
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

});