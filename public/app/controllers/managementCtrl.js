angular.module('managementController',[])
.controller('managementCtrl',function(User,$scope){
var thisobj=this;
thisobj.loading=true;
thisobj.accessDenied=true;
thisobj.failmsg=false;
thisobj.deleteAccess=false;
thisobj.editAccess=false;
thisobj.limit=1;
thisobj.searchLimit=0;
function getUsers(){
User.getUsers().then(function(data){
   if(data.data.success){
       if(data.data.permission=='admin'||data.data.permission=='moderator'){
       thisobj.users=data.data.users;
       	thisobj.loading=false;
           thisobj.accessDenied=false;
          if(data.data.permission=='admin'){
      	     thisobj.deleteAccess=true;
           thisobj.editAccess=true;
              }
            else if(data.data.permission=='moderator'){
      	
           thisobj.editAccess=true;
            }
       }


   }else{

     thisobj.failmsg=data.data.message;
     thisobj.loading=false;
    }
});
}

getUsers();

thisobj.ShowMore=function(number){
	thisobj.showmoreerror=false;

if(number>0){
thisobj.limit=number;
}else{
  $scope.number='';

	thisobj.showmoreerror='Enter a valid number';
}

};

thisobj.ShowAll=function(){
thisobj.limit=undefined;
thisobj.showmoreerror=false;

	
};



thisobj.deleteUser=function(username){
	
User.deleteUser(username).then(function(data){//not thisobj coz not deleting this
if(data.data.success){
getUsers();
}else{
	thisobj.showmoreerror=data.data.message;
}

});


};


thisobj.search=function(searchKeyword,number){
if(searchKeyword){
 if(searchKeyword.length>0){
      thisobj.limit=0;
      $scope.searchFilter=searchKeyword;
      thisobj.limit=number;

  }else{
  	$scope.searchKeyword=undefined;
	thisobj.limit=0;
  }
}
else{

	$scope.searchKeyword=undefined;
	thisobj.limit=0;
}
};



thisobj.clear=function(){
	//console.log('mk');
	$scope.number='Clear';
	thisobj.limit=0;
	thisobj.searchKeyword=undefined;
	thisobj.searchFilter=undefined;
	thisobj.failmsg=false;

};

thisobj.advancedSearch=function(searchByUsername,searchByEmail,searchByName){

if(searchByUsername||searchByEmail||searchByName){
$scope.advancedSearchFilter={};
if(searchByName){
	$scope.advancedSearchFilter.name=searchByName;// name here isdatabase field
}
if(searchByUsername){
	$scope.advancedSearchFilter.username=searchByUsername;
}
if(searchByEmail){
	$scope.advancedSearchFilter.email=searchByEmail;
}
thisobj.searchLimit=undefined;
}else{
thisobj.searchLimit=0;
thisobj.sort='';
}

};

thisobj.sortOrder=function(order){
thisobj.sort=order;
};

})



.controller('editCtrl',function($scope,$routeParams,User,$timeout){
var thisobj=this;
thisobj.userTab='active';
thisobj.phase1=true;

 User.getUser($routeParams.id).then(function(data){
  
          if(data.data.success){
          	$scope.newName=data.data.user.name;
          	$scope.newEmail=data.data.user.email;
          	$scope.newUsername=data.data.user.username;
          	$scope.newPermission=data.data.user.permission;
          	thisobj.currentUser=data.data.user._id;
          	

          }else{
          	thisobj.failmsg=data.data.message;
          	thisobj.disabled=false;
          }


     });





thisobj.namePhase=function(){
$scope.nameTab='active';
$scope.usernameTab='default';
$scope.emailTab='default';
$scope.permissionTab='default';
thisobj.phase1=true;
thisobj.phase2=false;thisobj.phase3=false;thisobj.phase4=false;
thisobj.failmsg=false;



};
thisobj.usernamePhase=function(){
$scope.nameTab='default';
$scope.usernameTab='active';
$scope.emailTab='default';
$scope.permissionTab='default';
thisobj.phase1=false;
thisobj.phase2=true;thisobj.phase3=false;thisobj.phase4=false;thisobj.failmsg=false;



};
thisobj.emailPhase=function(){

$scope.nameTab='default';
$scope.usernameTab='default';
$scope.emailTab='active';
$scope.permissionTab='default';
thisobj.phase1=false;
thisobj.phase2=false;thisobj.phase3=true;thisobj.phase4=false;thisobj.failmsg=false;


};
thisobj.permissionPhase=function(){

$scope.nameTab='default';
$scope.usernameTab='default';
$scope.emailTab='default';
$scope.permissionTab='active';
thisobj.phase1=false;
thisobj.phase2=false;thisobj.phase3=false;thisobj.phase4=true;
thisobj.disableModerator=false;thisobj.disableUser=false;thisobj.disableAdmin=false;thisobj.failmsg=false;


if($scope.newPermission=='user'){
	thisobj.disableUser=true;
}else if($scope.newPermission=='moderator'){
	thisobj.disableModerator=true;
}else if($scope.newPermission=='admin'){
	thisobj.disableAdmin=true;
}

};


thisobj.updateName=function(newName,valid){
thisobj.failmsg=false;
thisobj.disabled=true;
var userObject={};


if(valid){
     userObject._id=thisobj.currentUser;
     userObject.name=$scope.newName;
     User.editUser(userObject).then(function(data){
     	if(data.data.success){
          thisobj.successmsg=data.data.message;
          $timeout(function() {
             thisobj.nameForm.name.$setPristine();
             thisobj.nameForm.name.$setUntouched();
            thisobj.successmsg=false;
          thisobj.disabled=false;

          }, 2000);



     	}else{
          thisobj.failmsg=data.data.message;
          thisobj.disabled=false;

     	}


     });
}else{
	thisobj.failmsg='Please fill name correctly';
	thisobj.disabled=false;
}

};

thisobj.updateEmail=function(newEmail,valid){
thisobj.failmsg=false;
thisobj.disabled=true;
var userObject={};


if(valid){
     userObject._id=thisobj.currentUser;
     userObject.email=$scope.newEmail;
     User.editUser(userObject).then(function(data){
     	if(data.data.success){
          thisobj.successmsg=data.data.message;
          $timeout(function() {
             thisobj.emailForm.email.$setPristine();
             thisobj.emailForm.email.$setUntouched();
            thisobj.successmsg=false;
          thisobj.disabled=false;

          }, 2000);



     	}else{
          thisobj.failmsg=data.data.message;
          thisobj.disabled=false;

     	}


     });
}else{
	thisobj.failmsg='Please fill name correctly';
	thisobj.disabled=false;
}

};

thisobj.updateUsername=function(newUsername,valid){
thisobj.failmsg=false;
thisobj.disabled=true;
var userObject={};


if(valid){
     userObject._id=thisobj.currentUser;
     userObject.username=$scope.newUsername;
     User.editUser(userObject).then(function(data){
     	if(data.data.success){
          thisobj.successmsg=data.data.message;
          $timeout(function() {
             thisobj.usernameForm.username.$setPristine();
             thisobj.usernameForm.username.$setUntouched();
            thisobj.successmsg=false;
          thisobj.disabled=false;

          }, 2000);



     	}else{
          thisobj.failmsg=data.data.message;
          thisobj.disabled=false;

     	}


     });
}else{
	thisobj.failmsg='Please fill name correctly';
	thisobj.disabled=false;
}

};
thisobj.updatePermission=function(newPermission){
thisobj.failmsg=false;
thisobj.disabled=true;
var userObject={};
thisobj.disableUser=false;
thisobj.disableModerator=false;
thisobj.disableAdmin=false;


     userObject._id=thisobj.currentUser;
     userObject.permission=newPermission;
     User.editUser(userObject).then(function(data){
     	if(data.data.success){
          thisobj.successmsg=data.data.message;
          $timeout(function() {
          	thisobj.successmsg=false;
             if(newPermission=='user'){
             	$scope.newPermission='user';
	         thisobj.disableUser=true;
	         thisobj.disableModerator=false;
	         thisobj.disableAdmin=false;
        }else if(newPermission=='moderator'){
	        $scope.newPermission='moderator';
	         thisobj.disableUser=false;
	         thisobj.disableModerator=true;
	         thisobj.disableAdmin=false;
         }else if(newPermission=='admin'){
	        $scope.newPermission='admin';
	         thisobj.disableUser=false;
	         thisobj.disableModerator=false;
	         thisobj.disableAdmin=true;
         }
            
          

          }, 2000);



     	}else{
	thisobj.failmsg=data.data.message;
	thisobj.disabled=false;
        }

});
};



});